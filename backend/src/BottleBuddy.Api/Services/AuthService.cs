using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;
using BottleBuddy.Api.Data;

namespace BottleBuddy.Api.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IConfiguration configuration,
    ActivitySource activitySource,
    ApplicationDbContext context) : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
    private readonly IConfiguration _configuration = configuration;
    private readonly ActivitySource _activitySource = activitySource;
    private readonly ApplicationDbContext _context = context;

    public async Task<AuthResponseDto> RegisterAsync(RegisterRequest request)
    {
        using var activity = _activitySource.StartActivity("AuthService.RegisterAsync");
        activity?.SetTag("service.operation", "user.registration");

        activity?.AddEvent(new ActivityEvent("Checking if user exists"));
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            activity?.AddEvent(new ActivityEvent("User already exists"));
            activity?.SetStatus(ActivityStatusCode.Error, "User already exists");
            throw new InvalidOperationException("A user with this email already exists.");
        }

        // Check if username is taken (if provided)
        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            activity?.AddEvent(new ActivityEvent("Checking if username is taken"));
            var existingProfile = await _context.Profiles
                .FirstOrDefaultAsync(p => p.Username == request.Username);
            if (existingProfile != null)
            {
                activity?.AddEvent(new ActivityEvent("Username already taken"));
                activity?.SetStatus(ActivityStatusCode.Error, "Username already taken");
                throw new InvalidOperationException("This username is already taken.");
            }
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email
        };

        activity?.AddEvent(new ActivityEvent("Creating new user"));
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            activity?.AddEvent(new ActivityEvent("User creation failed"));
            activity?.SetTag("error.validation", errors);
            activity?.SetStatus(ActivityStatusCode.Error, "User creation failed");
            throw new InvalidOperationException(errors);
        }

        activity?.SetTag("user.id", user.Id);
        activity?.AddEvent(new ActivityEvent("User created successfully"));

        // Create associated Profile
        activity?.AddEvent(new ActivityEvent("Creating user profile"));
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

        _context.Profiles.Add(profile);
        await _context.SaveChangesAsync();

        activity?.AddEvent(new ActivityEvent("Profile created successfully"));
        activity?.SetTag("profile.username", profile.Username);

        activity?.AddEvent(new ActivityEvent("Generating JWT token"));
        var token = GenerateJwtToken(user);
        return new AuthResponseDto { Token = token };
    }

    private string GenerateUsernameFromEmail(string email)
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
        using var activity = _activitySource.StartActivity("AuthService.LoginAsync");
        activity?.SetTag("service.operation", "user.login");

        activity?.AddEvent(new ActivityEvent("Looking up user by email"));
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            activity?.AddEvent(new ActivityEvent("User not found"));
            activity?.SetStatus(ActivityStatusCode.Error, "User not found");
            throw new UnauthorizedAccessException("Invalid credentials. Please check your email and password.");
        }

        activity?.SetTag("user.id", user.Id);
        activity?.AddEvent(new ActivityEvent("Validating password"));
        var result = await _signInManager.PasswordSignInAsync(
            request.Email,
            request.Password,
            isPersistent: false,
            lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            if (result.IsLockedOut)
            {
                activity?.AddEvent(new ActivityEvent("Account locked out"));
                activity?.SetStatus(ActivityStatusCode.Error, "Account locked");
                throw new UnauthorizedAccessException("Account locked. Please try again later.");
            }
            activity?.AddEvent(new ActivityEvent("Invalid credentials"));
            activity?.SetStatus(ActivityStatusCode.Error, "Invalid credentials");
            throw new UnauthorizedAccessException("Invalid credentials. Please check your email and password.");
        }

        activity?.AddEvent(new ActivityEvent("Login successful"));
        activity?.AddEvent(new ActivityEvent("Generating JWT token"));
        var token = GenerateJwtToken(user);
        return new AuthResponseDto { Token = token };
    }

    public async Task<UserResponseDto> GetCurrentUserAsync(string userId)
    {
        using var activity = _activitySource.StartActivity("AuthService.GetCurrentUserAsync");
        activity?.SetTag("service.operation", "user.get");
        activity?.SetTag("user.id", userId);

        activity?.AddEvent(new ActivityEvent("Fetching user by ID with profile"));
        var user = await _userManager.Users
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            activity?.AddEvent(new ActivityEvent("User not found"));
            activity?.SetStatus(ActivityStatusCode.Error, "User not found");
            throw new KeyNotFoundException("User not found.");
        }

        activity?.AddEvent(new ActivityEvent("User found successfully"));
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
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
