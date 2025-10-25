using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace BottleBuddy.Persistence.Repositories;

public class ProfileRepository : IProfileRepository
{
    private readonly ApplicationDbContext _context;

    public ProfileRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public Task<Profile?> GetByIdAsync(string id)
    {
        return _context.Profiles.FirstOrDefaultAsync(p => p.Id == id);
    }

    public Task<Profile?> GetByUsernameAsync(string username)
    {
        return _context.Profiles.FirstOrDefaultAsync(p => p.Username == username);
    }

    public async Task AddAsync(Profile profile)
    {
        await _context.Profiles.AddAsync(profile);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return _context.SaveChangesAsync(cancellationToken);
    }
}
