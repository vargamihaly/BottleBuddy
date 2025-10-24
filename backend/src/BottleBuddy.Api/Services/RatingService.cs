using BottleBuddy.Api.Data;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace BottleBuddy.Api.Services;

public class RatingService : IRatingService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<RatingService> _logger;

    public RatingService(ApplicationDbContext context, ILogger<RatingService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<RatingResponseDto> CreateRatingAsync(CreateRatingDto dto, string raterId)
    {
        _logger.LogInformation(
            "User {RaterId} creating rating for transaction {TransactionId}",
            raterId,
            dto.TransactionId);

        // Validate rating value
        if (dto.Value < 1 || dto.Value > 5)
        {
            _logger.LogWarning(
                "Rating creation failed: value {RatingValue} out of bounds for transaction {TransactionId}",
                dto.Value,
                dto.TransactionId);
            throw new ArgumentException("Rating value must be between 1 and 5");
        }

        // Get the transaction
        var transaction = await _context.Transactions
            .Include(t => t.Listing)
            .Include(t => t.PickupRequest)
            .FirstOrDefaultAsync(t => t.Id == dto.TransactionId);

        if (transaction == null)
        {
            _logger.LogWarning(
                "Rating creation failed: transaction {TransactionId} not found for user {RaterId}",
                dto.TransactionId,
                raterId);
            throw new InvalidOperationException("Transaction not found");
        }

        // Verify user is part of this transaction
        var isOwner = transaction.Listing?.OwnerId == raterId;
        var isVolunteer = transaction.PickupRequest?.VolunteerId == raterId;

        if (!isOwner && !isVolunteer)
        {
            _logger.LogWarning(
                "User {RaterId} attempted to rate transaction {TransactionId} without participation",
                raterId,
                dto.TransactionId);
            throw new UnauthorizedAccessException("You can only rate transactions you were part of");
        }

        // Determine who is being rated
        var ratedUserId = isOwner
            ? transaction.PickupRequest!.VolunteerId
            : transaction.Listing!.OwnerId;

        // Check if user already rated this transaction
        var existingRating = await _context.Ratings
            .FirstOrDefaultAsync(r => r.TransactionId == dto.TransactionId && r.RaterId == raterId);

        if (existingRating != null)
        {
            _logger.LogWarning(
                "User {RaterId} attempted duplicate rating for transaction {TransactionId}",
                raterId,
                dto.TransactionId);
            throw new InvalidOperationException("You have already rated this transaction");
        }

        // Create rating
        var rating = new Rating
        {
            Id = Guid.NewGuid(),
            RaterId = raterId,
            RatedUserId = ratedUserId,
            TransactionId = dto.TransactionId,
            Value = dto.Value,
            Comment = dto.Comment,
            CreatedAtUtc = DateTime.UtcNow
        };

        _context.Ratings.Add(rating);

        // Update rated user's profile rating
        await UpdateUserRatingAsync(ratedUserId);

        await _context.SaveChangesAsync();

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
        var ratings = await _context.Ratings
            .Include(r => r.Rater)
            .Include(r => r.RatedUser)
            .Where(r => r.RatedUserId == userId)
            .OrderByDescending(r => r.CreatedAtUtc)
            .ToListAsync();

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
        var rating = await _context.Ratings
            .Include(r => r.Rater)
            .Include(r => r.RatedUser)
            .FirstOrDefaultAsync(r => r.TransactionId == transactionId && r.RaterId == raterId);

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
        // Calculate average rating for user
        var ratings = await _context.Ratings
            .Where(r => r.RatedUserId == userId)
            .ToListAsync();

        if (ratings.Count == 0)
        {
            _logger.LogInformation(
                "No ratings available to update aggregate for user {UserId}",
                userId);
            return;
        }

        var averageRating = ratings.Average(r => r.Value);

        // Update profile
        var profile = await _context.Profiles.FindAsync(userId);
        if (profile != null)
        {
            profile.Rating = averageRating;
            profile.TotalRatings = ratings.Count;
            profile.UpdatedAtUtc = DateTime.UtcNow;
            _logger.LogInformation(
                "Updated profile rating for user {UserId} to {AverageRating} based on {RatingCount} ratings",
                userId,
                averageRating,
                ratings.Count);
        }
    }

    private async Task<RatingResponseDto> MapToResponseDto(Rating rating)
    {
        // Load related entities if not already loaded
        if (rating.Rater == null || rating.RatedUser == null)
        {
            await _context.Entry(rating)
                .Reference(r => r.Rater)
                .LoadAsync();

            await _context.Entry(rating)
                .Reference(r => r.RatedUser)
                .LoadAsync();
        }

        return new RatingResponseDto
        {
            Id = rating.Id,
            RaterId = rating.RaterId,
            RatedUserId = rating.RatedUserId,
            TransactionId = rating.TransactionId,
            Value = rating.Value,
            Comment = rating.Comment,
            CreatedAt = rating.CreatedAtUtc,
            RaterName = rating.Rater?.UserName,
            RatedUserName = rating.RatedUser?.UserName
        };
    }
}
