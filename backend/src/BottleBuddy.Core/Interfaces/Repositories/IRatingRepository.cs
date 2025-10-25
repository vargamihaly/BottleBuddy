using BottleBuddy.Core.Models;

namespace BottleBuddy.Core.Interfaces.Repositories;

public interface IRatingRepository
{
    Task<Rating?> GetByTransactionAndRaterAsync(Guid transactionId, string raterId);
    Task<List<Rating>> GetRatingsForUserAsync(string userId);
    Task<Rating?> GetMyRatingForTransactionAsync(Guid transactionId, string raterId);
    Task<List<Rating>> GetRatingsForUserWithoutTrackingAsync(string userId);
    Task AddAsync(Rating rating);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
