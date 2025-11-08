using BottleBuddy.Api.Hubs;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Services;
using Microsoft.AspNetCore.SignalR;

namespace BottleBuddy.Api.Services;

/// <summary>
/// Implementation of IMessageHubService for broadcasting messages via SignalR
/// </summary>
public class MessageHubService(IHubContext<MessageHub> hubContext, ILogger<MessageHubService> logger)
    : IMessageHubService
{
    public async Task BroadcastMessageAsync(string pickupRequestId, MessageResponseDto message)
    {
        var groupName = GetGroupName(pickupRequestId);

        logger.LogInformation("Broadcasting new message {MessageId} to group {GroupName}", message.Id, groupName);

        await hubContext.Clients.Group(groupName).SendAsync("ReceiveMessage", message);
    }

    public async Task BroadcastMessageReadAsync(string pickupRequestId, string messageId, DateTime? readAtUtc)
    {
        var groupName = GetGroupName(pickupRequestId);

        logger.LogInformation("Broadcasting message read status for {MessageId} to group {GroupName}", messageId, groupName);

        await hubContext.Clients.Group(groupName).SendAsync("MessageRead", new { messageId, readAtUtc });
    }

    private static string GetGroupName(string pickupRequestId)
    {
        return $"conversation_{pickupRequestId}";
    }
}