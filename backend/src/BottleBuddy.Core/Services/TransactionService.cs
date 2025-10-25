using BottleBuddy.Core.Dtos;
using BottleBuddy.Core.Enums;
using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Core.Services;

public class TransactionService : ITransactionService
{
    private readonly IPickupRequestRepository _pickupRequestRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly ILogger<TransactionService> _logger;

    public TransactionService(
        IPickupRequestRepository pickupRequestRepository,
        ITransactionRepository transactionRepository,
        ILogger<TransactionService> logger)
    {
        _pickupRequestRepository = pickupRequestRepository;
        _transactionRepository = transactionRepository;
        _logger = logger;
    }

    public async Task<TransactionResponseDto> CreateTransactionAsync(Guid pickupRequestId, string userId)
    {
        _logger.LogInformation(
            "User {UserId} creating transaction for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        var pickupRequest = await _pickupRequestRepository.GetByIdWithDetailsAsync(pickupRequestId);

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

        var isOwner = pickupRequest.Listing.UserId == userId;
        var isVolunteer = pickupRequest.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            _logger.LogWarning(
                "User {UserId} attempted unauthorized transaction creation for pickup request {PickupRequestId}",
                userId,
                pickupRequestId);
            throw new UnauthorizedAccessException("You are not authorized to create a transaction for this pickup request");
        }

        if (pickupRequest.Status != PickupRequestStatus.Completed)
        {
            _logger.LogWarning(
                "Transaction creation failed: pickup request {PickupRequestId} has status {Status}",
                pickupRequestId,
                pickupRequest.Status);
            throw new InvalidOperationException("Pickup request must be completed before creating a transaction");
        }

        var existingTransaction = await _transactionRepository.GetByPickupRequestIdAsync(pickupRequestId);

        if (existingTransaction != null)
        {
            _logger.LogInformation(
                "Transaction already exists for pickup request {PickupRequestId}; returning existing transaction {TransactionId}",
                pickupRequestId,
                existingTransaction.Id);
            return MapToResponseDto(existingTransaction);
        }

        var listing = pickupRequest.Listing;
        var totalRefund = listing.EstimatedRefund;
        var ownerPercentage = listing.SplitPercentage ?? 50m;
        var volunteerPercentage = 100m - ownerPercentage;

        var ownerAmount = (totalRefund * ownerPercentage) / 100m;
        var volunteerAmount = (totalRefund * volunteerPercentage) / 100m;

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            ListingId = listing.Id,
            PickupRequestId = pickupRequestId,
            VolunteerAmount = volunteerAmount,
            OwnerAmount = ownerAmount,
            TotalRefund = totalRefund,
            Status = TransactionStatus.Completed,
            CreatedAt = DateTime.UtcNow,
            CompletedAt = DateTime.UtcNow,
            Listing = listing,
            PickupRequest = pickupRequest
        };

        await _transactionRepository.AddAsync(transaction);
        await _transactionRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Transaction {TransactionId} created for pickup request {PickupRequestId}",
            transaction.Id,
            pickupRequestId);

        return MapToResponseDto(transaction);
    }

    public async Task<TransactionResponseDto?> GetTransactionByPickupRequestIdAsync(Guid pickupRequestId, string userId)
    {
        _logger.LogInformation(
            "User {UserId} retrieving transaction for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        var transaction = await _transactionRepository.GetByPickupRequestIdAsync(pickupRequestId);

        if (transaction == null)
        {
            _logger.LogInformation(
                "No transaction found for pickup request {PickupRequestId}",
                pickupRequestId);
            return null;
        }

        var isOwner = transaction.Listing?.UserId == userId;
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
        return MapToResponseDto(transaction);
    }

    public async Task<List<TransactionResponseDto>> GetMyTransactionsAsync(string userId)
    {
        _logger.LogInformation("Retrieving transactions for user {UserId}", userId);
        var transactions = await _transactionRepository.GetTransactionsForUserAsync(userId);

        var result = transactions.Select(MapToResponseDto).ToList();

        _logger.LogInformation(
            "Retrieved {TransactionCount} transactions for user {UserId}",
            result.Count,
            userId);

        return result;
    }

    private TransactionResponseDto MapToResponseDto(Transaction transaction)
    {
        if (transaction.Listing == null || transaction.PickupRequest == null)
        {
            throw new InvalidOperationException("Transaction is missing related data for mapping");
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
            CreatedAt = transaction.CreatedAt,
            CompletedAt = transaction.CompletedAt,
            VolunteerName = transaction.PickupRequest.Volunteer?.UserName,
            OwnerName = transaction.Listing.User?.UserName,
            BottleCount = transaction.Listing.BottleCount,
            ListingTitle = transaction.Listing.Title
        };
    }
}
