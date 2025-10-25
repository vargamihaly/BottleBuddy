using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Google.Apis.Auth;
using BottleBuddy.Core.Dtos;
using BottleBuddy.Core.Services;
using BottleBuddy.Core.Models;
using BottleBuddy.Persistence;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    IAuthService authService,
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext,
    IConfiguration configuration,
    ILogger<AuthController> logger) : ControllerBase
{

    /// <summary>
    /// Register a new user account
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            logger.LogInformation("Register endpoint invoked for email {Email}", request.Email);
            var response = await authService.RegisterAsync(request);
            logger.LogInformation("Registration succeeded for email {Email}", request.Email);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Registration failed for email {Email}", request.Email);
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Login with email and password
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            logger.LogInformation("Login endpoint invoked for email {Email}", request.Email);
            var response = await authService.LoginAsync(request);
            logger.LogInformation("Login succeeded for email {Email}", request.Email);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Login failed for email {Email}", request.Email);
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get current authenticated user information
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get current user invoked without authenticated user");
            return Unauthorized();
        }

        try
        {
            logger.LogInformation("Retrieving current user profile for user {UserId}", userId);
            var user = await authService.GetCurrentUserAsync(userId);
            logger.LogInformation("Retrieved current user profile for user {UserId}", userId);
            return Ok(user);
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "User {UserId} not found while retrieving profile", userId);
            return NotFound(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Sign in with Google ID token (from @react-oauth/google)
    /// </summary>
    [HttpPost("google-signin")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GoogleSignIn([FromBody] GoogleSignInRequest request)
    {
        logger.LogInformation("=== Google Sign-In Request Started ===");

        try
        {
            // Log the request
            logger.LogInformation("Received Google ID token (length: {TokenLength})", request.IdToken?.Length ?? 0);

            // Validate the Google ID token
            var clientId = configuration["Authentication:Google:ClientId"];
            logger.LogInformation("Using Google Client ID: {ClientId}", clientId);

            if (string.IsNullOrEmpty(clientId))
            {
                logger.LogError("Google Client ID is not configured!");
                return BadRequest(new { error = "Google authentication is not properly configured" });
            }

            var validationSettings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId! }
            };

            logger.LogInformation("Validating Google token with Google API...");
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, validationSettings);
            logger.LogInformation("Google token validated successfully. Email: {Email}, Name: {Name}", payload.Email, payload.Name);

            // Find or create user
            logger.LogInformation("Searching for existing user with email: {Email}", payload.Email);
            var user = await userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                logger.LogInformation("User not found. Creating new user...");

                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    EmailConfirmed = true // Google already verified the email
                };

                logger.LogInformation("Creating ApplicationUser with email: {Email}", user.Email);
                var result = await userManager.CreateAsync(user);

                if (!result.Succeeded)
                {
                    logger.LogError("Failed to create user. Errors: {Errors}",
                        string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
                    return BadRequest(new { error = "Failed to create user account", details = result.Errors });
                }

                logger.LogInformation("ApplicationUser created successfully. UserId: {UserId}", user.Id);

                // Create associated Profile for OAuth user
                var profile = new Profile
                {
                    Id = user.Id,
                    FullName = payload.Name,
                    Username = payload.Email.Split('@')[0].ToLowerInvariant(),
                    Phone = null,
                    AvatarUrl = payload.Picture,
                    Rating = null,
                    TotalRatings = 0,
                    CreatedAt = DateTime.UtcNow
                };

                logger.LogInformation("Creating Profile for UserId: {UserId}, Username: {Username}, FullName: {FullName}",
                    profile.Id, profile.Username, profile.FullName);

                dbContext.Profiles.Add(profile);

                try
                {
                    await dbContext.SaveChangesAsync();
                    logger.LogInformation("Profile saved successfully for UserId: {UserId}", user.Id);
                }
                catch (Exception dbEx)
                {
                    logger.LogError(dbEx, "Failed to save profile to database for UserId: {UserId}", user.Id);
                    throw;
                }
            }
            else
            {
                logger.LogInformation("Existing user found. UserId: {UserId}, Email: {Email}", user.Id, user.Email);
            }

            // Generate JWT token
            logger.LogInformation("Generating JWT token for UserId: {UserId}", user.Id);
            var jwt = authService.GenerateJwtToken(user);
            logger.LogInformation("JWT token generated successfully (length: {TokenLength})", jwt?.Length ?? 0);

            logger.LogInformation("=== Google Sign-In Completed Successfully ===");
            return Ok(new AuthResponseDto { Token = jwt });
        }
        catch (InvalidJwtException ex)
        {
            logger.LogError(ex, "Invalid Google JWT token");
            return BadRequest(new { error = "Invalid Google token", details = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Google sign-in failed with exception: {ExceptionType}", ex.GetType().Name);
            logger.LogError("Exception details - Message: {Message}, StackTrace: {StackTrace}", ex.Message, ex.StackTrace);
            return BadRequest(new { error = "Failed to sign in with Google", details = ex.Message, type = ex.GetType().Name });
        }
    }
}

public record GoogleSignInRequest(string IdToken);
