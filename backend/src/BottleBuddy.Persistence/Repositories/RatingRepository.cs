using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace BottleBuddy.Persistence.Repositories;

public class RatingRepository : IRatingRepository
{
    private readonly ApplicationDbContext _context;

    public RatingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<Rating?> GetByTransactionAndRaterAsync(Guid transactionId, string raterId)
    {
        return _context.Ratings
            .FirstOrDefaultAsync(r => r.TransactionId == transactionId && r.RaterId == raterId);
    }

    public Task<List<Rating>> GetRatingsForUserAsync(string userId)
    {
        return _context.Ratings
            .Include(r => r.Rater)
            .Include(r => r.RatedUser)
            .Where(r => r.RatedUserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public Task<Rating?> GetMyRatingForTransactionAsync(Guid transactionId, string raterId)
    {
        return _context.Ratings
            .Include(r => r.Rater)
            .Include(r => r.RatedUser)
            .FirstOrDefaultAsync(r => r.TransactionId == transactionId && r.RaterId == raterId);
    }

    public Task<List<Rating>> GetRatingsForUserWithoutTrackingAsync(string userId)
    {
        return _context.Ratings
            .AsNoTracking()
            .Where(r => r.RatedUserId == userId)
            .ToListAsync();
    }

    public async Task AddAsync(Rating rating)
    {
        await _context.Ratings.AddAsync(rating);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
