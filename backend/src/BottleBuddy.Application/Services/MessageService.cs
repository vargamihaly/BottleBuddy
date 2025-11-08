using BottleBuddy.Application.Data;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Application.Services;

public class MessageService(
    ApplicationDbContext context,
    ILogger<MessageService> logger,
    IImageStorageService imageStorageService,
    IMessageHubService? messageHubService = null)
    : IMessageService
{
    public async Task<MessageResponseDto> SendMessageAsync(Guid pickupRequestId, CreateMessageDto dto, string senderId, IFormFile? image = null)
    {
        logger.LogInformation(
            "User {SenderId} sending message to pickup request {PickupRequestId}",
            senderId,
            pickupRequestId);

        // Validate that either content or image is provided
        if (string.IsNullOrWhiteSpace(dto.Content) && image == null)
        {
            throw new ArgumentException("Either message content or image must be provided");
        }

        // Get the pickup request with related entities
        var pickupRequest = await context.PickupRequests
            .Include(pr => pr.Listing)
            .FirstOrDefaultAsync(pr => pr.Id == pickupRequestId);

        if (pickupRequest == null)
        {
            logger.LogWarning(
                "Message send failed: pickup request {PickupRequestId} not found",
                pickupRequestId);
            throw new InvalidOperationException("Pickup request not found");
        }

        // Verify user is participant (either volunteer or listing owner)
        var isVolunteer = pickupRequest.VolunteerId == senderId;
        var isOwner = pickupRequest.Listing?.OwnerId == senderId;

        if (!isVolunteer && !isOwner)
        {
            logger.LogWarning(
                "User {SenderId} attempted to send message to pickup request {PickupRequestId} without authorization",
                senderId,
                pickupRequestId);
            throw new UnauthorizedAccessException("You can only send messages to pickup requests you are part of");
        }

        // Create the message
        var message = new Message
        {
            Id = Guid.NewGuid(),
            PickupRequestId = pickupRequestId,
            SenderId = senderId,
            Content = dto.Content?.Trim() ?? string.Empty,
            IsRead = false,
            CreatedAtUtc = DateTime.UtcNow
        };

        // Handle image upload if provided
        if (image != null)
        {
            try
            {
                message.ImageUrl = await imageStorageService.SaveMessageImageAsync(image, message.Id);
                message.ImageFileName = image.FileName;

                logger.LogInformation(
                    "Image attached to message {MessageId}: {ImageUrl}",
                    message.Id,
                    message.ImageUrl);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to save image for message {MessageId}", message.Id);
                throw new InvalidOperationException("Failed to save image attachment", ex);
            }
        }

        context.Messages.Add(message);
        await context.SaveChangesAsync();

        logger.LogInformation(
            "Message {MessageId} created for pickup request {PickupRequestId} by user {SenderId}",
            message.Id,
            pickupRequestId,
            senderId);

        var messageDto = await MapToResponseDto(message);

        // Broadcast the new message via SignalR
        if (messageHubService != null)
        {
            await messageHubService.BroadcastMessageAsync(pickupRequestId.ToString(), messageDto);
        }

        return messageDto;
    }

    public async Task<List<MessageResponseDto>> GetMessagesAsync(Guid pickupRequestId, string userId)
    {
        logger.LogInformation(
            "User {UserId} retrieving messages for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        // Verify user is participant
        var pickupRequest = await context.PickupRequests
            .Include(pr => pr.Listing)
            .FirstOrDefaultAsync(pr => pr.Id == pickupRequestId);

        if (pickupRequest == null)
        {
            logger.LogWarning(
                "Get messages failed: pickup request {PickupRequestId} not found",
                pickupRequestId);
            throw new InvalidOperationException("Pickup request not found");
        }

        var isVolunteer = pickupRequest.VolunteerId == userId;
        var isOwner = pickupRequest.Listing?.OwnerId == userId;

        if (!isVolunteer && !isOwner)
        {
            logger.LogWarning(
                "User {UserId} attempted to view messages for pickup request {PickupRequestId} without authorization",
                userId,
                pickupRequestId);
            throw new UnauthorizedAccessException("You can only view messages for pickup requests you are part of");
        }

        // Get messages ordered by creation time
        var messages = await context.Messages
            .Include(m => m.Sender)
            .ThenInclude(u => u!.Profile)
            .Where(m => m.PickupRequestId == pickupRequestId)
            .OrderBy(m => m.CreatedAtUtc)
            .ToListAsync();

        var result = new List<MessageResponseDto>();
        foreach (var message in messages)
        {
            result.Add(await MapToResponseDto(message));
        }

        logger.LogInformation(
            "Retrieved {MessageCount} messages for pickup request {PickupRequestId}",
            result.Count,
            pickupRequestId);

        return result;
    }

    public async Task MarkAsReadAsync(Guid messageId, string userId)
    {
        logger.LogInformation(
            "User {UserId} marking message {MessageId} as read",
            userId,
            messageId);

        var message = await context.Messages
            .Include(m => m.PickupRequest)
            .ThenInclude(pr => pr!.Listing)
            .FirstOrDefaultAsync(m => m.Id == messageId);

        if (message == null)
        {
            logger.LogWarning(
                "Mark as read failed: message {MessageId} not found",
                messageId);
            throw new InvalidOperationException("Message not found");
        }

        // Verify user is recipient (not the sender)
        var isVolunteer = message.PickupRequest?.VolunteerId == userId;
        var isOwner = message.PickupRequest?.Listing?.OwnerId == userId;

        if (!isVolunteer && !isOwner)
        {
            logger.LogWarning(
                "User {UserId} attempted to mark message {MessageId} as read without authorization",
                userId,
                messageId);
            throw new UnauthorizedAccessException("You can only mark messages as read in conversations you are part of");
        }

        // Don't mark own messages as read
        if (message.SenderId == userId)
        {
            logger.LogInformation(
                "User {UserId} attempted to mark own message {MessageId} as read - ignoring",
                userId,
                messageId);
            return;
        }

        message.IsRead = true;
        message.ReadAtUtc = DateTime.UtcNow;
        await context.SaveChangesAsync();

        logger.LogInformation(
            "Message {MessageId} marked as read by user {UserId}",
            messageId,
            userId);

        // Broadcast read status update via SignalR
        if (messageHubService != null && message.PickupRequestId != Guid.Empty)
        {
            await messageHubService.BroadcastMessageReadAsync(
                message.PickupRequestId.ToString(),
                messageId.ToString(),
                message.ReadAtUtc);
        }
    }

    public async Task MarkAllAsReadAsync(Guid pickupRequestId, string userId)
    {
        logger.LogInformation(
            "User {UserId} marking all messages as read for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        // Verify user is participant
        var pickupRequest = await context.PickupRequests
            .Include(pr => pr.Listing)
            .FirstOrDefaultAsync(pr => pr.Id == pickupRequestId);

        if (pickupRequest == null)
        {
            logger.LogWarning(
                "Mark all as read failed: pickup request {PickupRequestId} not found",
                pickupRequestId);
            throw new InvalidOperationException("Pickup request not found");
        }

        var isVolunteer = pickupRequest.VolunteerId == userId;
        var isOwner = pickupRequest.Listing?.OwnerId == userId;

        if (!isVolunteer && !isOwner)
        {
            logger.LogWarning(
                "User {UserId} attempted to mark all messages as read for pickup request {PickupRequestId} without authorization",
                userId,
                pickupRequestId);
            throw new UnauthorizedAccessException("You can only mark messages as read in conversations you are part of");
        }

        // Mark all messages not sent by the user as read
        var messagesToUpdate = await context.Messages
            .Where(m => m.PickupRequestId == pickupRequestId
                && m.SenderId != userId
                && !m.IsRead)
            .ToListAsync();

        var messageIds = messagesToUpdate.Select(m => m.Id.ToString()).ToList();
        var readAtUtc = DateTime.UtcNow;

        foreach (var message in messagesToUpdate)
        {
            message.IsRead = true;
            message.ReadAtUtc = readAtUtc;
        }

        await context.SaveChangesAsync();

        logger.LogInformation(
            "Marked {MessageCount} messages as read for pickup request {PickupRequestId} by user {UserId}",
            messagesToUpdate.Count,
            pickupRequestId,
            userId);

        // Broadcast read status updates via SignalR
        if (messageHubService != null && messageIds.Count > 0)
        {
            foreach (var messageId in messageIds)
            {
                await messageHubService.BroadcastMessageReadAsync(
                    pickupRequestId.ToString(),
                    messageId,
                    readAtUtc);
            }
        }
    }

    public async Task<int> GetUnreadCountAsync(Guid pickupRequestId, string userId)
    {
        logger.LogInformation(
            "User {UserId} retrieving unread count for pickup request {PickupRequestId}",
            userId,
            pickupRequestId);

        // Count unread messages where user is NOT the sender
        var count = await context.Messages
            .Include(m => m.PickupRequest)
            .ThenInclude(pr => pr!.Listing)
            .Where(m => m.PickupRequestId == pickupRequestId
                && m.SenderId != userId
                && !m.IsRead
                && (m.PickupRequest!.VolunteerId == userId || m.PickupRequest.Listing!.OwnerId == userId))
            .CountAsync();

        logger.LogInformation(
            "User {UserId} has {UnreadCount} unread messages for pickup request {PickupRequestId}",
            userId,
            count,
            pickupRequestId);

        return count;
    }

    public async Task<int> GetTotalUnreadCountAsync(string userId)
    {
        logger.LogInformation(
            "User {UserId} retrieving total unread message count",
            userId);

        // Get all pickup requests where user is participant
        var pickupRequestIds = await context.PickupRequests
            .Include(pr => pr.Listing)
            .Where(pr => pr.VolunteerId == userId || pr.Listing!.OwnerId == userId)
            .Select(pr => pr.Id)
            .ToListAsync();

        // Count unread messages in those pickup requests where user is NOT the sender
        var count = await context.Messages
            .Where(m => pickupRequestIds.Contains(m.PickupRequestId)
                && m.SenderId != userId
                && !m.IsRead)
            .CountAsync();

        logger.LogInformation(
            "User {UserId} has {TotalUnreadCount} total unread messages",
            userId,
            count);

        return count;
    }

    private async Task<MessageResponseDto> MapToResponseDto(Message message)
    {
        // Load sender and profile if not already loaded
        if (message.Sender == null)
        {
            await context.Entry(message)
                .Reference(m => m.Sender)
                .LoadAsync();

            if (message.Sender?.Profile == null)
            {
                await context.Entry(message.Sender!)
                    .Reference(u => u.Profile)
                    .LoadAsync();
            }
        }

        return new MessageResponseDto
        {
            Id = message.Id,
            PickupRequestId = message.PickupRequestId,
            SenderId = message.SenderId,
            Content = message.Content,
            IsRead = message.IsRead,
            ReadAtUtc = message.ReadAtUtc,
            CreatedAt = message.CreatedAtUtc,
            ImageUrl = message.ImageUrl,
            ImageFileName = message.ImageFileName,
            SenderName = message.Sender?.Profile?.FullName ?? message.Sender?.UserName,
            SenderAvatarUrl = message.Sender?.Profile?.AvatarUrl
        };
    }
}
