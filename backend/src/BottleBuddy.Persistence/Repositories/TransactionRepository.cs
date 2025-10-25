using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace BottleBuddy.Persistence.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<Transaction?> GetByPickupRequestIdAsync(Guid pickupRequestId)
    {
        return _context.Transactions
            .Include(t => t.Listing)
                .ThenInclude(l => l!.User)
            .Include(t => t.PickupRequest)
                .ThenInclude(pr => pr!.Volunteer)
            .FirstOrDefaultAsync(t => t.PickupRequestId == pickupRequestId);
    }

    public Task<Transaction?> GetByIdWithDetailsAsync(Guid transactionId)
    {
        return _context.Transactions
            .Include(t => t.Listing)
                .ThenInclude(l => l!.User)
            .Include(t => t.PickupRequest)
                .ThenInclude(pr => pr!.Volunteer)
            .FirstOrDefaultAsync(t => t.Id == transactionId);
    }

    public async Task AddAsync(Transaction transaction)
    {
        await _context.Transactions.AddAsync(transaction);
    }

    public Task<List<Transaction>> GetTransactionsForUserAsync(string userId)
    {
        return _context.Transactions
            .Include(t => t.Listing)
                .ThenInclude(l => l!.User)
            .Include(t => t.PickupRequest)
                .ThenInclude(pr => pr!.Volunteer)
            .Where(t => (t.Listing != null && t.Listing.UserId == userId) ||
                        (t.PickupRequest != null && t.PickupRequest.VolunteerId == userId))
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
