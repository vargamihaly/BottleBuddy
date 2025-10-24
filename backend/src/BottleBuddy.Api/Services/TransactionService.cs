using BottleBuddy.Api.Data;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;
using BottleBuddy.Api.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TransactionService> _logger;

    public TransactionService(ApplicationDbContext context, ILogger<TransactionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<TransactionResponseDto> CreateTransactionAsync(Guid pickupRequestId, string userId)
    {
        _logger.LogInformation(
            "User {UserId} creating transaction for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        // Get the pickup request with listing
        var pickupRequest = await _context.PickupRequests
            .Include(pr => pr.Listing)
            .ThenInclude(l => l!.Owner)
            .Include(pr => pr.Volunteer)
            .FirstOrDefaultAsync(pr => pr.Id == pickupRequestId);

        if (pickupRequest == null)
        {
            _logger.LogWarning(
                "Transaction creation failed: pickup request {PickupRequestId} not found for user {UserId}",
                pickupRequestId,
                userId);
            throw new InvalidOperationException("Pickup request not found");
        }

        if (pickupRequest.Listing == null)
        {
            _logger.LogWarning(
                "Transaction creation failed: listing missing for pickup request {PickupRequestId}",
                pickupRequestId);
            throw new InvalidOperationException("Associated listing not found");
        }

        // Verify user is either owner or volunteer
        var isOwner = pickupRequest.Listing.OwnerId == userId;
        var isVolunteer = pickupRequest.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            _logger.LogWarning(
                "User {UserId} attempted unauthorized transaction creation for pickup request {PickupRequestId}",
                userId,
                pickupRequestId);
            throw new UnauthorizedAccessException("You are not authorized to create a transaction for this pickup request");
        }

        // Check if pickup request is in completed status
        if (pickupRequest.Status != PickupRequestStatus.Completed)
        {
            _logger.LogWarning(
                "Transaction creation failed: pickup request {PickupRequestId} has status {Status}",
                pickupRequestId,
                pickupRequest.Status);
            throw new InvalidOperationException("Pickup request must be completed before creating a transaction");
        }

        // Check if transaction already exists
        var existingTransaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.PickupRequestId == pickupRequestId);

        if (existingTransaction != null)
        {
            // Return existing transaction
            _logger.LogInformation(
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

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Transaction {TransactionId} created for pickup request {PickupRequestId}",
            transaction.Id,
            pickupRequestId);

        return await MapToResponseDto(transaction);
    }

    public async Task<TransactionResponseDto?> GetTransactionByPickupRequestIdAsync(Guid pickupRequestId, string userId)
    {
        _logger.LogInformation(
            "User {UserId} retrieving transaction for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        var transaction = await _context.Transactions
            .Include(t => t.Listing)
            .ThenInclude(l => l!.Owner)
            .Include(t => t.PickupRequest)
            .ThenInclude(pr => pr!.Volunteer)
            .FirstOrDefaultAsync(t => t.PickupRequestId == pickupRequestId);

        if (transaction == null)
        {
            _logger.LogInformation(
                "No transaction found for pickup request {PickupRequestId}",
                pickupRequestId);
            return null;
        }

        // Verify user is either owner or volunteer
        var isOwner = transaction.Listing?.OwnerId == userId;
        var isVolunteer = transaction.PickupRequest?.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            _logger.LogWarning(
                "User {UserId} attempted unauthorized access to transaction {TransactionId}",
                userId,
                transaction.Id);
            throw new UnauthorizedAccessException("You are not authorized to view this transaction");
        }

        _logger.LogInformation(
            "Transaction {TransactionId} retrieved for pickup request {PickupRequestId} by user {UserId}",
            transaction.Id,
            pickupRequestId,
            userId);
        return await MapToResponseDto(transaction);
    }

    public async Task<List<TransactionResponseDto>> GetMyTransactionsAsync(string userId)
    {
        _logger.LogInformation("Retrieving transactions for user {UserId}", userId);
        var transactions = await _context.Transactions
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

        _logger.LogInformation(
            "Retrieved {TransactionCount} transactions for user {UserId}",
            result.Count,
            userId);

        return result;
    }

    private async Task<TransactionResponseDto> MapToResponseDto(Transaction transaction)
    {
        // Load related entities if not already loaded
        if (transaction.Listing == null || transaction.PickupRequest == null)
        {
            await _context.Entry(transaction)
                .Reference(t => t.Listing)
                .Query()
                .Include(l => l!.Owner)
                .LoadAsync();

            await _context.Entry(transaction)
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
            Status = transaction.Status.ToString().ToLower(),
            CreatedAt = transaction.CreatedAtUtc,
            CompletedAt = transaction.CompletedAtUtc,
            VolunteerName = transaction.PickupRequest?.Volunteer?.UserName,
            OwnerName = transaction.Listing?.Owner?.UserName,
            BottleCount = transaction.Listing?.BottleCount,
            ListingTitle = transaction.Listing?.Title
        };
    }
}
