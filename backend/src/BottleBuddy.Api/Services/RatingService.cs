using BottleBuddy.Api.Data;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BottleBuddy.Api.Services;

public class RatingService : IRatingService
{
    private readonly ApplicationDbContext _context;

    public RatingService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RatingResponseDto> CreateRatingAsync(CreateRatingDto dto, string raterId)
    {
        // Validate rating value
        if (dto.Value < 1 || dto.Value > 5)
        {
            throw new ArgumentException("Rating value must be between 1 and 5");
        }

        // Get the transaction
        var transaction = await _context.Transactions
            .Include(t => t.Listing)
            .Include(t => t.PickupRequest)
            .FirstOrDefaultAsync(t => t.Id == dto.TransactionId);

        if (transaction == null)
        {
            throw new InvalidOperationException("Transaction not found");
        }

        // Verify user is part of this transaction
        var isOwner = transaction.Listing?.UserId == raterId;
        var isVolunteer = transaction.PickupRequest?.VolunteerId == raterId;

        if (!isOwner && !isVolunteer)
        {
            throw new UnauthorizedAccessException("You can only rate transactions you were part of");
        }

        // Determine who is being rated
        var ratedUserId = isOwner
            ? transaction.PickupRequest!.VolunteerId
            : transaction.Listing!.UserId;

        // Check if user already rated this transaction
        var existingRating = await _context.Ratings
            .FirstOrDefaultAsync(r => r.TransactionId == dto.TransactionId && r.RaterId == raterId);

        if (existingRating != null)
        {
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
            CreatedAt = DateTime.UtcNow
        };

        _context.Ratings.Add(rating);

        // Update rated user's profile rating
        await UpdateUserRatingAsync(ratedUserId);

        await _context.SaveChangesAsync();

        return await MapToResponseDto(rating);
    }

    public async Task<List<RatingResponseDto>> GetRatingsForUserAsync(string userId)
    {
        var ratings = await _context.Ratings
            .Include(r => r.Rater)
            .Include(r => r.RatedUser)
            .Where(r => r.RatedUserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var result = new List<RatingResponseDto>();
        foreach (var rating in ratings)
        {
            result.Add(await MapToResponseDto(rating));
        }

        return result;
    }

    public async Task<RatingResponseDto?> GetMyRatingForTransactionAsync(Guid transactionId, string raterId)
    {
        var rating = await _context.Ratings
            .Include(r => r.Rater)
            .Include(r => r.RatedUser)
            .FirstOrDefaultAsync(r => r.TransactionId == transactionId && r.RaterId == raterId);

        if (rating == null)
        {
            return null;
        }

        return await MapToResponseDto(rating);
    }

    private async Task UpdateUserRatingAsync(string userId)
    {
        // Calculate average rating for user
        var ratings = await _context.Ratings
            .Where(r => r.RatedUserId == userId)
            .ToListAsync();

        if (ratings.Count == 0)
        {
            return;
        }

        var averageRating = ratings.Average(r => r.Value);

        // Update profile
        var profile = await _context.Profiles.FindAsync(userId);
        if (profile != null)
        {
            profile.Rating = averageRating;
            profile.TotalRatings = ratings.Count;
            profile.UpdatedAt = DateTime.UtcNow;
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
            CreatedAt = rating.CreatedAt,
            RaterName = rating.Rater?.UserName,
            RatedUserName = rating.RatedUser?.UserName
        };
    }
}
