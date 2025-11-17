using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Application.Services;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserActivitiesController(IUserActivityService userActivityService, ILogger<UserActivitiesController> logger) : ControllerBase
{
    /// <summary>
    /// Get user activities with pagination
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetActivities([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] bool? isRead = null)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get activities attempted without authenticated user");
            return Unauthorized();
        }

        logger.LogInformation("Fetching activities for user {UserId}", userId);

        var (activities, metadata) = await userActivityService.GetUserActivitiesAsync(
            userId,
            page,
            pageSize,
            isRead);

        return Ok(new
        {
            data = activities,
            pagination = metadata
        });
    }

    /// <summary>
    /// Get count of unread activities
    /// </summary>
    [HttpGet("unread-count")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get unread count attempted without authenticated user");
            return Unauthorized();
        }

        var count = await userActivityService.GetUnreadCountAsync(userId);

        return Ok(new { data = count });
    }

    /// <summary>
    /// Mark an activity as read
    /// </summary>
    [HttpPatch("{id}/mark-read")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Mark as read attempted without authenticated user");
            return Unauthorized();
        }

        try
        {
            await userActivityService.MarkAsReadAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Activity {ActivityId} not found for user {UserId}", id, userId);
            return NotFound(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Mark all activities as read
    /// </summary>
    [HttpPatch("mark-all-read")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Mark all as read attempted without authenticated user");
            return Unauthorized();
        }

        await userActivityService.MarkAllAsReadAsync(userId);
        return NoContent();
    }

    /// <summary>
    /// Delete an activity
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteActivity(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Delete activity attempted without authenticated user");
            return Unauthorized();
        }

        try
        {
            await userActivityService.DeleteActivityAsync(id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Activity {ActivityId} not found for user {UserId}", id, userId);
            return NotFound(new { error = ex.Message });
        }
    }
}
