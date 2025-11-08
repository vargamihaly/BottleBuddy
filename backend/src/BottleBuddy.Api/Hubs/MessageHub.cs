using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace BottleBuddy.Api.Hubs;

[Authorize]
public class MessageHub(ILogger<MessageHub> logger) : Hub
{
    /// <summary>
    /// Join a conversation group for a specific pickup request
    /// </summary>
    public async Task JoinConversation(string pickupRequestId)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        logger.LogInformation("User {UserId} joining conversation {PickupRequestId}", userId, pickupRequestId);

        await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(pickupRequestId));
    }

    /// <summary>
    /// Leave a conversation group for a specific pickup request
    /// </summary>
    public async Task LeaveConversation(string pickupRequestId)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        logger.LogInformation("User {UserId} leaving conversation {PickupRequestId}", userId, pickupRequestId);

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(pickupRequestId));
    }

    /// <summary>
    /// Send typing indicator to other participants in the conversation
    /// </summary>
    public async Task SendTypingIndicator(string pickupRequestId, bool isTyping)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        logger.LogDebug("User {UserId} typing indicator: {IsTyping} in conversation {PickupRequestId}", userId, isTyping, pickupRequestId);

        await Clients.OthersInGroup(GetGroupName(pickupRequestId)).SendAsync("UserTyping", new { userId, isTyping });
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        logger.LogInformation("SignalR connection established: {ConnectionId} for user {UserId}", Context.ConnectionId,userId);

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        logger.LogInformation(exception, "SignalR connection closed: {ConnectionId} for user {UserId}", Context.ConnectionId, userId);

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Get the group name for a pickup request conversation
    /// </summary>
    private static string GetGroupName(string pickupRequestId)
    {
        return $"conversation_{pickupRequestId}";
    }
}
