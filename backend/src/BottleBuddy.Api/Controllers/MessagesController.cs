using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Services;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/pickuprequests/{pickupRequestId}/messages")]
[Authorize]
public class MessagesController(IMessageService messageService, ILogger<MessagesController> logger) : ControllerBase
{
    /// <summary>
    /// Send a message in a pickup request conversation (supports text and/or image)
    /// </summary>
    [HttpPost]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(MessageResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<MessageResponseDto>> SendMessage(
        Guid pickupRequestId,
        [FromForm] string? content,
        [FromForm] IFormFile? image)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Message send attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        // Validate that at least one is provided
        if (string.IsNullOrWhiteSpace(content) && image == null)
        {
            return BadRequest(new { error = "Either message content or image must be provided" });
        }

        // Validate content length if provided
        if (!string.IsNullOrWhiteSpace(content) && content.Length > 1000)
        {
            return BadRequest(new { error = "Message content must not exceed 1000 characters" });
        }

        try
        {
            logger.LogInformation(
                "User {UserId} sending message to pickup request {PickupRequestId} (hasContent: {HasContent}, hasImage: {HasImage})",
                userId,
                pickupRequestId,
                !string.IsNullOrWhiteSpace(content),
                image != null);

            var dto = new CreateMessageDto { Content = content };
            var message = await messageService.SendMessageAsync(pickupRequestId, dto, userId, image);

            logger.LogInformation(
                "Message {MessageId} sent to pickup request {PickupRequestId} by user {UserId}",
                message.Id,
                pickupRequestId,
                userId);

            return CreatedAtAction(
                nameof(GetMessages),
                new { pickupRequestId },
                message);
        }
        catch (ArgumentException ex)
        {
            logger.LogWarning(ex, "Invalid argument sending message to pickup request {PickupRequestId}", pickupRequestId);
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid operation sending message to pickup request {PickupRequestId}", pickupRequestId);
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized message send attempt for pickup request {PickupRequestId}", pickupRequestId);
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Get all messages for a pickup request
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<MessageResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<List<MessageResponseDto>>> GetMessages(Guid pickupRequestId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get messages attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            logger.LogInformation(
                "User {UserId} retrieving messages for pickup request {PickupRequestId}",
                userId,
                pickupRequestId);

            var messages = await messageService.GetMessagesAsync(pickupRequestId, userId);

            logger.LogInformation(
                "Retrieved {MessageCount} messages for pickup request {PickupRequestId}",
                messages.Count,
                pickupRequestId);

            return Ok(messages);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid operation retrieving messages for pickup request {PickupRequestId}", pickupRequestId);
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized message retrieval attempt for pickup request {PickupRequestId}", pickupRequestId);
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Mark all messages as read for a pickup request
    /// </summary>
    [HttpPatch("mark-all-read")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> MarkAllAsRead(Guid pickupRequestId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Mark all as read attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            logger.LogInformation(
                "User {UserId} marking all messages as read for pickup request {PickupRequestId}",
                userId,
                pickupRequestId);

            await messageService.MarkAllAsReadAsync(pickupRequestId, userId);

            logger.LogInformation(
                "All messages marked as read for pickup request {PickupRequestId} by user {UserId}",
                pickupRequestId,
                userId);

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid operation marking messages as read for pickup request {PickupRequestId}", pickupRequestId);
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized mark as read attempt for pickup request {PickupRequestId}", pickupRequestId);
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Get unread message count for a pickup request
    /// </summary>
    [HttpGet("unread-count")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<int>> GetUnreadCount(Guid pickupRequestId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get unread count attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        logger.LogInformation(
            "User {UserId} retrieving unread count for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        var count = await messageService.GetUnreadCountAsync(pickupRequestId, userId);

        logger.LogInformation(
            "Unread count {UnreadCount} for pickup request {PickupRequestId} retrieved by user {UserId}",
            count,
            pickupRequestId,
            userId);

        return Ok(count);
    }
}

/// <summary>
/// Additional controller for user-level message operations
/// </summary>
[ApiController]
[Route("api/messages")]
[Authorize]
public class UserMessagesController(IMessageService messageService, ILogger<UserMessagesController> logger) : ControllerBase
{
    /// <summary>
    /// Get total unread message count for the current user
    /// </summary>
    [HttpGet("unread-count")]
    [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<int>> GetTotalUnreadCount()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get total unread count attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        logger.LogInformation(
            "User {UserId} retrieving total unread message count",
            userId);

        var count = await messageService.GetTotalUnreadCountAsync(userId);

        logger.LogInformation(
            "Total unread count {TotalUnreadCount} retrieved for user {UserId}",
            count,
            userId);

        return Ok(count);
    }

    /// <summary>
    /// Mark a specific message as read
    /// </summary>
    [HttpPatch("{messageId}/read")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead(Guid messageId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Mark as read attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            logger.LogInformation(
                "User {UserId} marking message {MessageId} as read",
                userId,
                messageId);

            await messageService.MarkAsReadAsync(messageId, userId);

            logger.LogInformation(
                "Message {MessageId} marked as read by user {UserId}",
                messageId,
                userId);

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid operation marking message {MessageId} as read", messageId);
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized mark as read attempt for message {MessageId}", messageId);
            return Forbid(ex.Message);
        }
    }
}
