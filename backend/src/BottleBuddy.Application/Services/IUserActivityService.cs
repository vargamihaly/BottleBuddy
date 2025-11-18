using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Services;

public interface IUserActivityService
{
    Task<(IEnumerable<UserActivityResponseDto> Activities, PaginationMetadata Metadata)> GetUserActivitiesAsync(
        string userId,
        int page = 1,
        int pageSize = 20,
        bool? isRead = null,
        UserActivityType? type = null,
        UserActivityCategory? category = null);

    Task<int> GetUnreadCountAsync(string userId);

    Task CreateActivityAsync(ActivityCreationData data);

    Task MarkAsReadAsync(Guid activityId, string userId);

    Task MarkAllAsReadAsync(string userId);

    Task DeleteActivityAsync(Guid activityId, string userId);
}
