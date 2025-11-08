using BottleBuddy.Application.Dtos;

namespace BottleBuddy.Application.Services;

/// <summary>
/// Service for broadcasting real-time message updates via SignalR
/// </summary>
public interface IMessageHubService
{
    /// <summary>
    /// Broadcast a new message to all participants in a conversation
    /// </summary>
    Task BroadcastMessageAsync(string pickupRequestId, MessageResponseDto message);

    /// <summary>
    /// Broadcast that a message has been marked as read
    /// </summary>
    Task BroadcastMessageReadAsync(string pickupRequestId, string messageId, DateTime? readAtUtc);
}
