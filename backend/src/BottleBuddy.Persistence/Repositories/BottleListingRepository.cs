using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace BottleBuddy.Persistence.Repositories;

public class BottleListingRepository : IBottleListingRepository
{
    private readonly ApplicationDbContext _context;

    public BottleListingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<BottleListing> Query()
    {
        return _context.BottleListings.AsQueryable();
    }

    public Task<BottleListing?> GetByIdAsync(Guid id)
    {
        return _context.BottleListings.FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task AddAsync(BottleListing listing)
    {
        await _context.BottleListings.AddAsync(listing);
    }

    public void Remove(BottleListing listing)
    {
        _context.BottleListings.Remove(listing);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
