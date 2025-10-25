using BottleBuddy.Core.Models;

namespace BottleBuddy.Core.Interfaces.Repositories;

public interface IPickupRequestRepository
{
    IQueryable<PickupRequest> Query();
    Task<PickupRequest?> GetByIdAsync(Guid id);
    Task<PickupRequest?> GetByIdWithDetailsAsync(Guid id);
    Task<PickupRequest?> GetActiveRequestForListingAsync(Guid listingId, string volunteerId);
    Task<List<PickupRequest>> GetPendingRequestsForListingAsync(Guid listingId, Guid excludeRequestId);
    Task AddAsync(PickupRequest pickupRequest);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
