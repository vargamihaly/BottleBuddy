using BottleBuddy.Application.Dtos;
using Microsoft.AspNetCore.Http;

namespace BottleBuddy.Application.Services;

public interface IMessageService
{
    /// <summary>
    /// Send a message in a pickup request conversation
    /// </summary>
    Task<MessageResponseDto> SendMessageAsync(Guid pickupRequestId, CreateMessageDto dto, string senderId, IFormFile? image = null);

    /// <summary>
    /// Get all messages for a pickup request (ordered by creation time)
    /// </summary>
    Task<List<MessageResponseDto>> GetMessagesAsync(Guid pickupRequestId, string userId);

    /// <summary>
    /// Mark a message as read
    /// </summary>
    Task MarkAsReadAsync(Guid messageId, string userId);

    /// <summary>
    /// Mark all messages in a pickup request as read for the current user
    /// </summary>
    Task MarkAllAsReadAsync(Guid pickupRequestId, string userId);

    /// <summary>
    /// Get unread message count for a specific pickup request
    /// </summary>
    Task<int> GetUnreadCountAsync(Guid pickupRequestId, string userId);

    /// <summary>
    /// Get total unread message count for a user across all their pickup requests
    /// </summary>
    Task<int> GetTotalUnreadCountAsync(string userId);
}
