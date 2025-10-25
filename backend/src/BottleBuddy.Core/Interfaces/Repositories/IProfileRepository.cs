using BottleBuddy.Core.Models;

namespace BottleBuddy.Core.Interfaces.Repositories;

public interface IProfileRepository
{
    Task<Profile?> GetByIdAsync(string id);
    Task<Profile?> GetByUsernameAsync(string username);
    Task AddAsync(Profile profile);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
