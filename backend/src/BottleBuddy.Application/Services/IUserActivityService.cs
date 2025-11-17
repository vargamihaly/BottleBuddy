using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Services;

public interface IUserActivityService
{
    Task<(IEnumerable<UserActivityResponseDto> Activities, PaginationMetadata Metadata)> GetUserActivitiesAsync(
        string userId,
        int page = 1,
        int pageSize = 20,
        bool? isRead = null);

    Task<int> GetUnreadCountAsync(string userId);

    Task CreateActivityAsync(
        string userId,
        UserActivityType type,
        string title,
        string description,
        Guid? listingId = null,
        Guid? pickupRequestId = null,
        Guid? transactionId = null,
        Guid? ratingId = null,
        Dictionary<string, object>? metadata = null);

    Task MarkAsReadAsync(Guid activityId, string userId);

    Task MarkAllAsReadAsync(string userId);

    Task DeleteActivityAsync(Guid activityId, string userId);
}
