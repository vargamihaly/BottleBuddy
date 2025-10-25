using BottleBuddy.Core.Enums;
using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace BottleBuddy.Persistence.Repositories;

public class PickupRequestRepository : IPickupRequestRepository
{
    private readonly ApplicationDbContext _context;

    public PickupRequestRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public IQueryable<PickupRequest> Query()
    {
        return _context.PickupRequests.AsQueryable();
    }

    public Task<PickupRequest?> GetByIdAsync(Guid id)
    {
        return _context.PickupRequests.FirstOrDefaultAsync(pr => pr.Id == id);
    }

    public Task<PickupRequest?> GetByIdWithDetailsAsync(Guid id)
    {
        return _context.PickupRequests
            .Include(pr => pr.Listing)
                .ThenInclude(l => l!.User)
            .Include(pr => pr.Volunteer)
            .FirstOrDefaultAsync(pr => pr.Id == id);
    }

    public Task<PickupRequest?> GetActiveRequestForListingAsync(Guid listingId, string volunteerId)
    {
        return _context.PickupRequests.FirstOrDefaultAsync(pr =>
            pr.ListingId == listingId &&
            pr.VolunteerId == volunteerId &&
            (pr.Status == PickupRequestStatus.Pending || pr.Status == PickupRequestStatus.Accepted));
    }

    public Task<List<PickupRequest>> GetPendingRequestsForListingAsync(Guid listingId, Guid excludeRequestId)
    {
        return _context.PickupRequests
            .Where(pr => pr.ListingId == listingId
                         && pr.Id != excludeRequestId
                         && pr.Status == PickupRequestStatus.Pending)
            .ToListAsync();
    }

    public async Task AddAsync(PickupRequest pickupRequest)
    {
        await _context.PickupRequests.AddAsync(pickupRequest);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
