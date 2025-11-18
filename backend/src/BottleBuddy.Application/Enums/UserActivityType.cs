namespace BottleBuddy.Application.Enums;

public enum UserActivityType
{
    // Listing lifecycle
    ListingCreated,
    ListingDeleted,
    ListingReceivedOffer,

    // Pickup request workflow - Owner perspective
    PickupRequestReceived,
    PickupRequestAcceptedByOwner,
    PickupRequestRejectedByOwner,
    PickupRequestCompletedByOwner,

    // Pickup request workflow - Volunteer perspective
    PickupRequestCreated,
    PickupRequestAccepted,
    PickupRequestRejected,
    PickupRequestCompleted,
    PickupRequestCancelled,

    // Transactions & earnings
    TransactionCompleted,

    // Ratings & reviews
    RatingReceived,

    // Map interactions
    NearbyListingAvailable,
    PickupOpportunityNearby
}