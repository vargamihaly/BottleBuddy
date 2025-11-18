using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Helpers;

public static class UserActivityHelper
{
    public static List<UserActivityType> GetTypesForCategory(UserActivityCategory category)
    {
        return category switch
        {
            UserActivityCategory.Listings => new List<UserActivityType>
            {
                UserActivityType.ListingCreated,
                UserActivityType.ListingDeleted,
                UserActivityType.ListingReceivedOffer
            },
            UserActivityCategory.Pickups => new List<UserActivityType>
            {
                // Owner perspective
                UserActivityType.PickupRequestReceived,
                UserActivityType.PickupRequestAcceptedByOwner,
                UserActivityType.PickupRequestRejectedByOwner,
                UserActivityType.PickupRequestCompletedByOwner,
                // Volunteer perspective
                UserActivityType.PickupRequestCreated,
                UserActivityType.PickupRequestAccepted,
                UserActivityType.PickupRequestRejected,
                UserActivityType.PickupRequestCompleted,
                UserActivityType.PickupRequestCancelled
            },
            UserActivityCategory.Transactions => new List<UserActivityType>
            {
                UserActivityType.TransactionCompleted
            },
            UserActivityCategory.Ratings => new List<UserActivityType>
            {
                UserActivityType.RatingReceived,
            },
            _ => new List<UserActivityType>()
        };
    }
}
