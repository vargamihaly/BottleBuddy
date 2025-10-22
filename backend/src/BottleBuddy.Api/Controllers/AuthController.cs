using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using System.Diagnostics;
using Google.Apis.Auth;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;
using BottleBuddy.Api.Models;
using BottleBuddy.Api.Data;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    IAuthService authService,
    ActivitySource activitySource,
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext dbContext,
    IConfiguration configuration,
    ILogger<AuthController> logger) : ControllerBase
{
    private readonly IAuthService _authService = authService;
    private readonly ActivitySource _activitySource = activitySource;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ApplicationDbContext _dbContext = dbContext;
    private readonly IConfiguration _configuration = configuration;
    private readonly ILogger<AuthController> _logger = logger;

    /// <summary>
    /// Register a new user account
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        using var activity = _activitySource.StartActivity("AuthController.Register");
        activity?.SetTag("auth.email", request.Email);

        try
        {
            activity?.AddEvent(new ActivityEvent("Registration attempt started"));
            var response = await _authService.RegisterAsync(request);
            activity?.AddEvent(new ActivityEvent("Registration successful"));
            activity?.SetTag("auth.success", true);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            activity?.AddEvent(new ActivityEvent("Registration failed"));
            activity?.SetTag("auth.success", false);
            activity?.SetTag("error.message", ex.Message);
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
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
        using var activity = _activitySource.StartActivity("AuthController.Login");
        activity?.SetTag("auth.email", request.Email);

        try
        {
            activity?.AddEvent(new ActivityEvent("Login attempt started"));
            var response = await _authService.LoginAsync(request);
            activity?.AddEvent(new ActivityEvent("Login successful"));
            activity?.SetTag("auth.success", true);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            activity?.AddEvent(new ActivityEvent("Login failed"));
            activity?.SetTag("auth.success", false);
            activity?.SetTag("error.message", ex.Message);
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
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
        using var activity = _activitySource.StartActivity("AuthController.GetCurrentUser");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            activity?.AddEvent(new ActivityEvent("Unauthorized - no user ID"));
            activity?.SetStatus(ActivityStatusCode.Error, "No user ID found");
            return Unauthorized();
        }

        activity?.SetTag("auth.userId", userId);

        try
        {
            activity?.AddEvent(new ActivityEvent("Fetching current user"));
            var user = await _authService.GetCurrentUserAsync(userId);
            activity?.AddEvent(new ActivityEvent("User fetched successfully"));
            return Ok(user);
        }
        catch (KeyNotFoundException ex)
        {
            activity?.AddEvent(new ActivityEvent("User not found"));
            activity?.SetTag("error.message", ex.Message);
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
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
        using var activity = _activitySource.StartActivity("AuthController.GoogleSignIn");
        _logger.LogInformation("=== Google Sign-In Request Started ===");

        try
        {
            // Log the request
            _logger.LogInformation("Received Google ID token (length: {TokenLength})", request.IdToken?.Length ?? 0);

            activity?.AddEvent(new ActivityEvent("Validating Google token"));

            // Validate the Google ID token
            var clientId = _configuration["Authentication:Google:ClientId"];
            _logger.LogInformation("Using Google Client ID: {ClientId}", clientId);

            if (string.IsNullOrEmpty(clientId))
            {
                _logger.LogError("Google Client ID is not configured!");
                return BadRequest(new { error = "Google authentication is not properly configured" });
            }

            var validationSettings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId! }
            };

            _logger.LogInformation("Validating Google token with Google API...");
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, validationSettings);
            _logger.LogInformation("Google token validated successfully. Email: {Email}, Name: {Name}", payload.Email, payload.Name);

            activity?.SetTag("auth.email", payload.Email);
            activity?.AddEvent(new ActivityEvent("Google token validated"));

            // Find or create user
            _logger.LogInformation("Searching for existing user with email: {Email}", payload.Email);
            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                _logger.LogInformation("User not found. Creating new user...");
                activity?.AddEvent(new ActivityEvent("Creating new user from Google"));

                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    EmailConfirmed = true // Google already verified the email
                };

                _logger.LogInformation("Creating ApplicationUser with email: {Email}", user.Email);
                var result = await _userManager.CreateAsync(user);

                if (!result.Succeeded)
                {
                    _logger.LogError("Failed to create user. Errors: {Errors}",
                        string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
                    activity?.SetStatus(ActivityStatusCode.Error, "Failed to create user");
                    return BadRequest(new { error = "Failed to create user account", details = result.Errors });
                }

                _logger.LogInformation("ApplicationUser created successfully. UserId: {UserId}", user.Id);

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

                _logger.LogInformation("Creating Profile for UserId: {UserId}, Username: {Username}, FullName: {FullName}",
                    profile.Id, profile.Username, profile.FullName);

                _dbContext.Profiles.Add(profile);

                try
                {
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation("Profile saved successfully for UserId: {UserId}", user.Id);
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Failed to save profile to database for UserId: {UserId}", user.Id);
                    throw;
                }

                activity?.AddEvent(new ActivityEvent("User and profile created"));
            }
            else
            {
                _logger.LogInformation("Existing user found. UserId: {UserId}, Email: {Email}", user.Id, user.Email);
            }

            // Generate JWT token
            _logger.LogInformation("Generating JWT token for UserId: {UserId}", user.Id);
            var jwt = _authService.GenerateJwtToken(user);
            _logger.LogInformation("JWT token generated successfully (length: {TokenLength})", jwt?.Length ?? 0);

            activity?.AddEvent(new ActivityEvent("JWT token generated"));
            activity?.SetTag("auth.success", true);

            _logger.LogInformation("=== Google Sign-In Completed Successfully ===");
            return Ok(new AuthResponseDto { Token = jwt });
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogError(ex, "Invalid Google JWT token");
            activity?.AddEvent(new ActivityEvent("Invalid Google token"));
            activity?.SetTag("auth.success", false);
            activity?.SetTag("error.message", ex.Message);
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            return BadRequest(new { error = "Invalid Google token", details = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Google sign-in failed with exception: {ExceptionType}", ex.GetType().Name);
            _logger.LogError("Exception details - Message: {Message}, StackTrace: {StackTrace}", ex.Message, ex.StackTrace);
            activity?.AddEvent(new ActivityEvent("Google sign-in failed"));
            activity?.SetTag("auth.success", false);
            activity?.SetTag("error.message", ex.Message);
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            return BadRequest(new { error = "Failed to sign in with Google", details = ex.Message, type = ex.GetType().Name });
        }
    }
}

public record GoogleSignInRequest(string IdToken);
