using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Services;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/user-settings")]
[Authorize]
public class UserSettingsController(IUserSettingsService userSettingsService, ILogger<UserSettingsController> logger) : ControllerBase
{
    /// <summary>
    /// Get current user's settings
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetSettings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get user settings attempted without authenticated user");
            return Unauthorized();
        }

        logger.LogInformation("Fetching user settings for user {UserId}", userId);

        // Use GetOrCreateSettingsAsync to automatically create if doesn't exist
        var settings = await userSettingsService.GetOrCreateSettingsAsync(userId);

        return Ok(new { data = settings });
    }

    /// <summary>
    /// Update current user's settings
    /// </summary>
    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateUserSettingsDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Update user settings attempted without authenticated user");
            return Unauthorized();
        }

        logger.LogInformation("Updating user settings for user {UserId}", userId);

        try
        {
            // First ensure settings exist (auto-create if needed)
            await userSettingsService.GetOrCreateSettingsAsync(userId);

            // Then update them
            var updatedSettings = await userSettingsService.UpdateSettingsAsync(userId, dto);

            return Ok(new { data = updatedSettings });
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogError(ex, "User settings not found for user {UserId}", userId);
            return NotFound(new { error = ex.Message });
        }
    }
}
