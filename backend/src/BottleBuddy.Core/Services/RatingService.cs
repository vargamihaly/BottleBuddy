using BottleBuddy.Core.Dtos;
using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Core.Services;

public class RatingService : IRatingService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IRatingRepository _ratingRepository;
    private readonly IProfileRepository _profileRepository;
    private readonly ILogger<RatingService> _logger;

    public RatingService(
        ITransactionRepository transactionRepository,
        IRatingRepository ratingRepository,
        IProfileRepository profileRepository,
        ILogger<RatingService> logger)
    {
        _transactionRepository = transactionRepository;
        _ratingRepository = ratingRepository;
        _profileRepository = profileRepository;
        _logger = logger;
    }

    public async Task<RatingResponseDto> CreateRatingAsync(CreateRatingDto dto, string raterId)
    {
        _logger.LogInformation(
            "User {RaterId} creating rating for transaction {TransactionId}",
            raterId,
            dto.TransactionId);

        if (dto.Value < 1 || dto.Value > 5)
        {
            _logger.LogWarning(
                "Rating creation failed: value {RatingValue} out of bounds for transaction {TransactionId}",
                dto.Value,
                dto.TransactionId);
            throw new ArgumentException("Rating value must be between 1 and 5");
        }

        var transaction = await _transactionRepository.GetByIdWithDetailsAsync(dto.TransactionId);

        if (transaction == null)
        {
            _logger.LogWarning(
                "Rating creation failed: transaction {TransactionId} not found for user {RaterId}",
                dto.TransactionId,
                raterId);
            throw new InvalidOperationException("Transaction not found");
        }

        var isOwner = transaction.Listing?.UserId == raterId;
        var isVolunteer = transaction.PickupRequest?.VolunteerId == raterId;

        if (!isOwner && !isVolunteer)
        {
            _logger.LogWarning(
                "User {RaterId} attempted to rate transaction {TransactionId} without participation",
                raterId,
                dto.TransactionId);
            throw new UnauthorizedAccessException("You can only rate transactions you were part of");
        }

        var ratedUserId = isOwner
            ? transaction.PickupRequest!.VolunteerId
            : transaction.Listing!.UserId;

        var existingRating = await _ratingRepository.GetByTransactionAndRaterAsync(dto.TransactionId, raterId);

        if (existingRating != null)
        {
            _logger.LogWarning(
                "User {RaterId} attempted duplicate rating for transaction {TransactionId}",
                raterId,
                dto.TransactionId);
            throw new InvalidOperationException("You have already rated this transaction");
        }

        var rating = new Rating
        {
            Id = Guid.NewGuid(),
            RaterId = raterId,
            RatedUserId = ratedUserId,
            TransactionId = dto.TransactionId,
            Value = dto.Value,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        await _ratingRepository.AddAsync(rating);

        await UpdateUserRatingAsync(ratedUserId);

        await _ratingRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Rating {RatingId} created for transaction {TransactionId} by user {RaterId}",
            rating.Id,
            dto.TransactionId,
            raterId);

        return await MapToResponseDto(rating);
    }

    public async Task<List<RatingResponseDto>> GetRatingsForUserAsync(string userId)
    {
        _logger.LogInformation("Retrieving ratings for user {RatedUserId}", userId);
        var ratings = await _ratingRepository.GetRatingsForUserAsync(userId);

        var result = new List<RatingResponseDto>();
        foreach (var rating in ratings)
        {
            result.Add(await MapToResponseDto(rating));
        }

        _logger.LogInformation(
            "Retrieved {RatingCount} ratings for user {RatedUserId}",
            result.Count,
            userId);

        return result;
    }

    public async Task<RatingResponseDto?> GetMyRatingForTransactionAsync(Guid transactionId, string raterId)
    {
        _logger.LogInformation(
            "User {RaterId} retrieving rating for transaction {TransactionId}",
            raterId,
            transactionId);

        var rating = await _ratingRepository.GetMyRatingForTransactionAsync(transactionId, raterId);

        if (rating == null)
        {
            _logger.LogInformation(
                "No rating found for transaction {TransactionId} by user {RaterId}",
                transactionId,
                raterId);
            return null;
        }

        _logger.LogInformation(
            "Rating {RatingId} retrieved for transaction {TransactionId} by user {RaterId}",
            rating.Id,
            transactionId,
            raterId);
        return await MapToResponseDto(rating);
    }

    private async Task UpdateUserRatingAsync(string userId)
    {
        _logger.LogInformation("Updating aggregate rating for user {UserId}", userId);
        var ratings = await _ratingRepository.GetRatingsForUserWithoutTrackingAsync(userId);

        if (ratings.Count == 0)
        {
            _logger.LogInformation(
                "No ratings available to update aggregate for user {UserId}",
                userId);
            return;
        }

        var averageRating = ratings.Average(r => r.Value);

        var profile = await _profileRepository.GetByIdAsync(userId);
        if (profile != null)
        {
            profile.Rating = averageRating;
            profile.TotalRatings = ratings.Count;
            profile.UpdatedAt = DateTime.UtcNow;
            await _profileRepository.SaveChangesAsync();
        }
    }

    private async Task<RatingResponseDto> MapToResponseDto(Rating rating)
    {
        if (rating.Rater == null || rating.RatedUser == null)
        {
            var hydrated = await _ratingRepository.GetMyRatingForTransactionAsync(rating.TransactionId, rating.RaterId);
            if (hydrated != null)
            {
                rating = hydrated;
            }
        }

        return new RatingResponseDto
        {
            Id = rating.Id,
            RaterId = rating.RaterId,
            RatedUserId = rating.RatedUserId,
            TransactionId = rating.TransactionId,
            Value = rating.Value,
            Comment = rating.Comment,
            CreatedAt = rating.CreatedAt,
            RaterName = rating.Rater?.UserName,
            RatedUserName = rating.RatedUser?.UserName
        };
    }
}
