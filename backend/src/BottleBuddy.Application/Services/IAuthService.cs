using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Models;

namespace BottleBuddy.Application.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequest request);
    Task<AuthResponseDto> LoginAsync(LoginRequest request);
    Task<UserResponseDto> GetCurrentUserAsync(string userId);
    string GenerateJwtToken(User applicationUser);
}
