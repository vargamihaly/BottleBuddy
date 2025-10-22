using BottleBuddy.Api.Data;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BottleBuddy.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;

    public TransactionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TransactionResponseDto> CreateTransactionAsync(Guid pickupRequestId, string userId)
    {
        // Get the pickup request with listing
        var pickupRequest = await _context.PickupRequests
            .Include(pr => pr.Listing)
            .ThenInclude(l => l!.User)
            .Include(pr => pr.Volunteer)
            .FirstOrDefaultAsync(pr => pr.Id == pickupRequestId);

        if (pickupRequest == null)
        {
            throw new InvalidOperationException("Pickup request not found");
        }

        if (pickupRequest.Listing == null)
        {
            throw new InvalidOperationException("Associated listing not found");
        }

        // Verify user is either owner or volunteer
        var isOwner = pickupRequest.Listing.UserId == userId;
        var isVolunteer = pickupRequest.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            throw new UnauthorizedAccessException("You are not authorized to create a transaction for this pickup request");
        }

        // Check if pickup request is in completed status
        if (pickupRequest.Status != "completed")
        {
            throw new InvalidOperationException("Pickup request must be completed before creating a transaction");
        }

        // Check if transaction already exists
        var existingTransaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.PickupRequestId == pickupRequestId);

        if (existingTransaction != null)
        {
            // Return existing transaction
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
            Status = "completed",
            CreatedAt = DateTime.UtcNow,
            CompletedAt = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return await MapToResponseDto(transaction);
    }

    public async Task<TransactionResponseDto?> GetTransactionByPickupRequestIdAsync(Guid pickupRequestId, string userId)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Listing)
            .ThenInclude(l => l!.User)
            .Include(t => t.PickupRequest)
            .ThenInclude(pr => pr!.Volunteer)
            .FirstOrDefaultAsync(t => t.PickupRequestId == pickupRequestId);

        if (transaction == null)
        {
            return null;
        }

        // Verify user is either owner or volunteer
        var isOwner = transaction.Listing?.UserId == userId;
        var isVolunteer = transaction.PickupRequest?.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            throw new UnauthorizedAccessException("You are not authorized to view this transaction");
        }

        return await MapToResponseDto(transaction);
    }

    public async Task<List<TransactionResponseDto>> GetMyTransactionsAsync(string userId)
    {
        var transactions = await _context.Transactions
            .Include(t => t.Listing)
            .ThenInclude(l => l!.User)
            .Include(t => t.PickupRequest)
            .ThenInclude(pr => pr!.Volunteer)
            .Where(t => t.Listing!.UserId == userId || t.PickupRequest!.VolunteerId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        var result = new List<TransactionResponseDto>();
        foreach (var transaction in transactions)
        {
            result.Add(await MapToResponseDto(transaction));
        }

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
                .Include(l => l!.User)
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
            Status = transaction.Status,
            CreatedAt = transaction.CreatedAt,
            CompletedAt = transaction.CompletedAt,
            VolunteerName = transaction.PickupRequest?.Volunteer?.UserName,
            OwnerName = transaction.Listing?.User?.UserName,
            BottleCount = transaction.Listing?.BottleCount,
            ListingTitle = transaction.Listing?.Title
        };
    }
}
