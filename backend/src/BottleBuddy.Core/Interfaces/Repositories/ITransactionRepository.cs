using BottleBuddy.Core.Models;

namespace BottleBuddy.Core.Interfaces.Repositories;

public interface ITransactionRepository
{
    Task<Transaction?> GetByPickupRequestIdAsync(Guid pickupRequestId);
    Task<Transaction?> GetByIdWithDetailsAsync(Guid transactionId);
    Task AddAsync(Transaction transaction);
    Task<List<Transaction>> GetTransactionsForUserAsync(string userId);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
