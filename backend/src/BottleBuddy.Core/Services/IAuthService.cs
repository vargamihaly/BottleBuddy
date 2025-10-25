using BottleBuddy.Core.Dtos;
using BottleBuddy.Core.Models;

namespace BottleBuddy.Core.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequest request);
    Task<AuthResponseDto> LoginAsync(LoginRequest request);
    Task<UserResponseDto> GetCurrentUserAsync(string userId);
    string GenerateJwtToken(ApplicationUser user);
}
