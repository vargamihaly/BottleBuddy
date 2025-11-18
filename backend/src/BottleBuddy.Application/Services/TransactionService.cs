using BottleBuddy.Application.Data;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Enums;
using BottleBuddy.Application.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Application.Services;

public class TransactionService(
    ApplicationDbContext context,
    IUserActivityService userActivityService,
    IEmailService emailService,
    IUserSettingsService settingsService,
    ILogger<TransactionService> logger)
    : ITransactionService
{
    public async Task<TransactionResponseDto> CreateTransactionAsync(Guid pickupRequestId, string userId)
    {
        logger.LogInformation(
            "User {UserId} creating transaction for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        // Get the pickup request with listing
        var pickupRequest = await context.PickupRequests
            .Include(pr => pr.Listing)
            .ThenInclude(l => l!.Owner)
            .Include(pr => pr.Volunteer)
            .FirstOrDefaultAsync(pr => pr.Id == pickupRequestId);

        if (pickupRequest is null)
        {
            logger.LogWarning(
                "Transaction creation failed: pickup request {PickupRequestId} not found for user {UserId}",
                pickupRequestId,
                userId);
            throw new InvalidOperationException("Pickup request not found");
        }

        if (pickupRequest.Listing is null)
        {
            logger.LogWarning(
                "Transaction creation failed: listing missing for pickup request {PickupRequestId}",
                pickupRequestId);
            throw new InvalidOperationException("Associated listing not found");
        }

        // Verify user is either owner or volunteer
        var isOwner = pickupRequest.Listing.OwnerId == userId;
        var isVolunteer = pickupRequest.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            logger.LogWarning(
                "User {UserId} attempted unauthorized transaction creation for pickup request {PickupRequestId}",
                userId,
                pickupRequestId);
            throw new UnauthorizedAccessException("You are not authorized to create a transaction for this pickup request");
        }

        // Check if pickup request is in completed status
        if (pickupRequest.Status != PickupRequestStatus.Completed)
        {
            logger.LogWarning(
                "Transaction creation failed: pickup request {PickupRequestId} has status {Status}",
                pickupRequestId,
                pickupRequest.Status);
            throw new InvalidOperationException("Pickup request must be completed before creating a transaction");
        }

        // Check if transaction already exists
        var existingTransaction = await context.Transactions
            .FirstOrDefaultAsync(t => t.PickupRequestId == pickupRequestId);

        if (existingTransaction != null)
        {
            // Return existing transaction
            logger.LogInformation(
                "Transaction already exists for pickup request {PickupRequestId}; returning existing transaction {TransactionId}",
                pickupRequestId,
                existingTransaction.Id);
            return await MapToResponseDto(existingTransaction);
        }

        // Calculate amounts based on split percentage
        var listing = pickupRequest.Listing;
        var totalRefund = listing.EstimatedRefund;
        var ownerPercentage = listing.SplitPercentage ?? 50m; // Default 50/50
        var volunteerPercentage = 100m - ownerPercentage;

        var ownerAmount = (totalRefund * ownerPercentage) / 100m;
        var volunteerAmount = (totalRefund * volunteerPercentage) / 100m;

        // Create transaction
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            ListingId = listing.Id,
            PickupRequestId = pickupRequestId,
            VolunteerAmount = volunteerAmount,
            OwnerAmount = ownerAmount,
            TotalRefund = totalRefund,
            Status = TransactionStatus.Completed,
            CreatedAtUtc = DateTime.UtcNow,
            CompletedAtUtc = DateTime.UtcNow
        };

        context.Transactions.Add(transaction);
        await context.SaveChangesAsync();

        // Create activities for transaction completion
        await userActivityService.CreateActivityAsync(new ActivityCreationData
        {
            Type = UserActivityType.TransactionCompleted,
            UserId = listing.OwnerId,
            ListingId = listing.Id,
            PickupRequestId = pickupRequestId,
            TransactionId = transaction.Id,
            TemplateData = new Dictionary<string, object>
            {
                { "role", "owner" },
                { "locationAddress", listing.LocationAddress },
                { "ownerAmount", ownerAmount }
            }
        });

        await userActivityService.CreateActivityAsync(new ActivityCreationData
        {
            Type = UserActivityType.TransactionCompleted,
            UserId = pickupRequest.VolunteerId,
            ListingId = listing.Id,
            PickupRequestId = pickupRequestId,
            TransactionId = transaction.Id,
            TemplateData = new Dictionary<string, object>
            {
                { "role", "volunteer" },
                { "volunteerAmount", volunteerAmount }
            }
        });

       
        // Send email notification to owner
        try
        {
            var ownerSettings = await settingsService.GetOrCreateSettingsAsync(listing.OwnerId);
            if (ownerSettings.NotificationSettings.EmailNotificationsEnabled && ownerSettings.NotificationSettings.TransactionCompletedEmail)
            {
                await emailService.SendTransactionCompletedEmailAsync(
                    listing.OwnerId,
                    ownerAmount,
                    listing.BottleCount,
                    listing.LocationAddress,
                    transaction.Id,
                    isOwner: true);
                logger.LogInformation(
                    "Email sent for TransactionCompleted to user {UserId}",
                    listing.OwnerId);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(
                ex,
                "Failed to send TransactionCompleted email to user {UserId}",
                listing.OwnerId);
            // Don't rethrow - email failure shouldn't break the flow
        }

        // Send email notification to volunteer
        try
        {
            var volunteerSettings = await settingsService.GetOrCreateSettingsAsync(pickupRequest.VolunteerId);
            if (volunteerSettings.NotificationSettings.EmailNotificationsEnabled && volunteerSettings.NotificationSettings.TransactionCompletedEmail)
            {
                await emailService.SendTransactionCompletedEmailAsync(
                    pickupRequest.VolunteerId,
                    volunteerAmount,
                    listing.BottleCount,
                    listing.LocationAddress,
                    transaction.Id,
                    isOwner: false);
                logger.LogInformation(
                    "Email sent for TransactionCompleted to user {UserId}",
                    pickupRequest.VolunteerId);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(
                ex,
                "Failed to send TransactionCompleted email to user {UserId}",
                pickupRequest.VolunteerId);
            // Don't rethrow - email failure shouldn't break the flow
        }

        logger.LogInformation(
            "Transaction {TransactionId} created for pickup request {PickupRequestId}",
            transaction.Id,
            pickupRequestId);

        return await MapToResponseDto(transaction);
    }

    public async Task<TransactionResponseDto?> GetTransactionByPickupRequestIdAsync(Guid pickupRequestId, string userId)
    {
        logger.LogInformation(
            "User {UserId} retrieving transaction for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        var transaction = await context.Transactions
            .Include(t => t.Listing)
            .ThenInclude(l => l!.Owner)
            .Include(t => t.PickupRequest)
            .ThenInclude(pr => pr!.Volunteer)
            .FirstOrDefaultAsync(t => t.PickupRequestId == pickupRequestId);

        if (transaction == null)
        {
            logger.LogInformation(
                "No transaction found for pickup request {PickupRequestId}",
                pickupRequestId);
            return null;
        }

        // Verify user is either owner or volunteer
        var isOwner = transaction.Listing?.OwnerId == userId;
        var isVolunteer = transaction.PickupRequest?.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            logger.LogWarning(
                "User {UserId} attempted unauthorized access to transaction {TransactionId}",
                userId,
                transaction.Id);
            throw new UnauthorizedAccessException("You are not authorized to view this transaction");
        }

        logger.LogInformation(
            "Transaction {TransactionId} retrieved for pickup request {PickupRequestId} by user {UserId}",
            transaction.Id,
            pickupRequestId,
            userId);
        return await MapToResponseDto(transaction);
    }

    public async Task<List<TransactionResponseDto>> GetTransactionsForUserAsync(string userId)
    {
        logger.LogInformation("Retrieving transactions for user {UserId}", userId);
        var transactions = await context.Transactions
            .Include(t => t.Listing)
            .ThenInclude(l => l!.Owner)
            .Include(t => t.PickupRequest)
            .ThenInclude(pr => pr!.Volunteer)
            .Where(t => t.Listing!.OwnerId == userId || t.PickupRequest!.VolunteerId == userId)
            .OrderByDescending(t => t.CreatedAtUtc)
            .ToListAsync();

        var result = new List<TransactionResponseDto>();
        foreach (var transaction in transactions)
        {
            result.Add(await MapToResponseDto(transaction));
        }

        logger.LogInformation(
            "Retrieved {TransactionCount} transactions for user {UserId}",
            result.Count,
            userId);

        return result;
    }

    private async Task<TransactionResponseDto> MapToResponseDto(Transaction transaction)
    {
        // Load related entities if not already loaded
        if (transaction.Listing is null || transaction.PickupRequest is null)
        {
            await context.Entry(transaction)
                .Reference(t => t.Listing)
                .Query()
                .Include(l => l!.Owner)
                .LoadAsync();

            await context.Entry(transaction)
                .Reference(t => t.PickupRequest)
                .Query()
                .Include(pr => pr!.Volunteer)
                .LoadAsync();
        }

        return new TransactionResponseDto
        {
            Id = transaction.Id,
            ListingId = transaction.ListingId,
            PickupRequestId = transaction.PickupRequestId,
            VolunteerAmount = transaction.VolunteerAmount,
            OwnerAmount = transaction.OwnerAmount,
            TotalRefund = transaction.TotalRefund,
            Status = transaction.Status,
            CreatedAt = transaction.CreatedAtUtc,
            CompletedAt = transaction.CompletedAtUtc,
            VolunteerName = transaction.PickupRequest?.Volunteer?.UserName,
            OwnerName = transaction.Listing?.Owner?.UserName,
            BottleCount = transaction.Listing?.BottleCount,
            ListingTitle = transaction.Listing?.Title
        };
    }
}
