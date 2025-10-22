using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;
using BottleBuddy.Api.Data;
using System.Linq;

namespace BottleBuddy.Api.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IConfiguration configuration,
    ApplicationDbContext context,
    ILogger<AuthService> logger) : IAuthService
{

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequest request)
    {
        logger.LogInformation("Registering new user with email {Email}", request.Email);
        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            logger.LogWarning("Registration failed: user with email {Email} already exists", request.Email);
            throw new InvalidOperationException("A user with this email already exists.");
        }

        // Check if username is taken (if provided)
        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            var existingProfile = await context.Profiles
                .FirstOrDefaultAsync(p => p.Username == request.Username);
            if (existingProfile != null)
            {
                logger.LogWarning("Registration failed: username {Username} already taken", request.Username);
                throw new InvalidOperationException("This username is already taken.");
            }
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            logger.LogWarning("Registration failed for email {Email} with errors: {Errors}", request.Email, errors);
            throw new InvalidOperationException(errors);
        }

        // Create associated Profile
        var profile = new Profile
        {
            Id = user.Id,
            FullName = request.FullName,
            Username = request.Username ?? GenerateUsernameFromEmail(request.Email),
            Phone = request.Phone,
            AvatarUrl = null, // Can be uploaded later
            Rating = null,
            TotalRatings = 0,
            CreatedAt = DateTime.UtcNow
        };

        context.Profiles.Add(profile);
        await context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        logger.LogInformation("Registration succeeded for email {Email}", request.Email);
        return new AuthResponseDto { Token = token };
    }

    private static string GenerateUsernameFromEmail(string email)
    {
        // Extract username part from email (before @)
        var username = email.Split('@')[0];

        // Remove any invalid characters and convert to lowercase
        username = new string(username.Where(c => char.IsLetterOrDigit(c) || c == '_' || c == '-').ToArray());
        username = username.ToLowerInvariant();

        // Ensure username is not empty
        if (string.IsNullOrEmpty(username))
        {
            username = "user";
        }

        return username;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequest request)
    {
        logger.LogInformation("Login attempt for email {Email}", request.Email);
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            logger.LogWarning("Login failed: user with email {Email} not found", request.Email);
            throw new UnauthorizedAccessException("Invalid credentials. Please check your email and password.");
        }

        var result = await signInManager.PasswordSignInAsync(
            request.Email,
            request.Password,
            isPersistent: false,
            lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                logger.LogWarning("Login failed: account locked for email {Email}", request.Email);
                throw new UnauthorizedAccessException("Account locked. Please try again later.");
            }
            logger.LogWarning("Login failed: invalid credentials for email {Email}", request.Email);
            throw new UnauthorizedAccessException("Invalid credentials. Please check your email and password.");
        }

        var token = GenerateJwtToken(user);
        logger.LogInformation("Login succeeded for email {Email}", request.Email);
        return new AuthResponseDto { Token = token };
    }

    public async Task<UserResponseDto> GetCurrentUserAsync(string userId)
    {
        logger.LogInformation("Retrieving current user profile for user {UserId}", userId);
        var user = await userManager.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            logger.LogWarning("User {UserId} not found while retrieving profile", userId);
            throw new KeyNotFoundException("User not found.");
        }

        return new UserResponseDto
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName,
            EmailConfirmed = user.EmailConfirmed,
            // Profile information
            FullName = user.Profile?.FullName,
            Username = user.Profile?.Username,
            Phone = user.Profile?.Phone,
            AvatarUrl = user.Profile?.AvatarUrl,
            Rating = user.Profile?.Rating,
            TotalRatings = user.Profile?.TotalRatings ?? 0,
            ProfileCreatedAt = user.Profile?.CreatedAt
        };
    }

    public string GenerateJwtToken(ApplicationUser user)
    {
        logger.LogInformation("Generating JWT token for user {UserId}", user.Id);
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        logger.LogInformation("JWT token generated for user {UserId} with expiration {Expiration}", user.Id, token.ValidTo);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
