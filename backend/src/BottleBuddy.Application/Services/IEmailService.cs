namespace BottleBuddy.Application.Services;

public interface IEmailService
{
    /// <summary>
    /// Sends an email notification to the bottle listing owner when a new pickup request is received.
    /// </summary>
    /// <param name="ownerUserId">The user ID of the bottle listing owner</param>
    /// <param name="volunteerName">The name of the volunteer who made the pickup request</param>
    /// <param name="bottleCount">The number of bottles in the listing</param>
    /// <param name="locationAddress">The address where the bottles are located</param>
    /// <param name="listingId">The ID of the bottle listing</param>
    /// <param name="pickupRequestId">The ID of the pickup request</param>
    Task SendPickupRequestReceivedEmailAsync(
        string ownerUserId,
        string volunteerName,
        int bottleCount,
        string locationAddress,
        Guid listingId,
        Guid pickupRequestId);

    /// <summary>
    /// Sends an email notification to the volunteer when their pickup request is accepted by the owner.
    /// </summary>
    /// <param name="volunteerUserId">The user ID of the volunteer</param>
    /// <param name="bottleCount">The number of bottles in the listing</param>
    /// <param name="locationAddress">The address where the bottles are located</param>
    /// <param name="listingId">The ID of the bottle listing</param>
    /// <param name="pickupRequestId">The ID of the pickup request</param>
    Task SendPickupRequestAcceptedEmailAsync(
        string volunteerUserId,
        int bottleCount,
        string locationAddress,
        Guid listingId,
        Guid pickupRequestId);

    /// <summary>
    /// Sends an email notification when a transaction is completed.
    /// </summary>
    /// <param name="userId">The user ID of the recipient (owner or volunteer)</param>
    /// <param name="amount">The transaction amount in HUF</param>
    /// <param name="bottleCount">The number of bottles in the transaction</param>
    /// <param name="locationAddress">The address where the transaction occurred</param>
    /// <param name="transactionId">The ID of the transaction</param>
    /// <param name="isOwner">Whether the recipient is the owner (true) or volunteer (false)</param>
    Task SendTransactionCompletedEmailAsync(
        string userId,
        decimal amount,
        int bottleCount,
        string locationAddress,
        Guid transactionId,
        bool isOwner);
}
