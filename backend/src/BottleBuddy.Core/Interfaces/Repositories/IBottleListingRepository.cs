using BottleBuddy.Core.Models;

namespace BottleBuddy.Core.Interfaces.Repositories;

public interface IBottleListingRepository
{
    IQueryable<BottleListing> Query();
    Task<BottleListing?> GetByIdAsync(Guid id);
    Task AddAsync(BottleListing listing);
    void Remove(BottleListing listing);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
