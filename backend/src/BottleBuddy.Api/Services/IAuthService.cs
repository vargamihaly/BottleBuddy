using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;

namespace BottleBuddy.Api.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequest request);
    Task<AuthResponseDto> LoginAsync(LoginRequest request);
    Task<UserResponseDto> GetCurrentUserAsync(string userId);
    string GenerateJwtToken(User user);
}
