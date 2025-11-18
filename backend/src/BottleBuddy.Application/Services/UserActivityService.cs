using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Enums;
using BottleBuddy.Application.Helpers;
using BottleBuddy.Application.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using BottleBuddy.Application.Data;

namespace BottleBuddy.Application.Services;

public class UserActivityService(ApplicationDbContext context, ILogger<UserActivityService> logger) : IUserActivityService
{
    public async Task<(IEnumerable<UserActivityResponseDto> Activities, PaginationMetadata Metadata)> GetUserActivitiesAsync(
        string userId,
        int page = 1,
        int pageSize = 20,
        bool? isRead = null,
        UserActivityType? type = null,
        UserActivityCategory? category = null)
    {
        logger.LogInformation("Fetching activities for user {UserId}, page {Page}, pageSize {PageSize}, type {Type}, category {Category}",
            userId, page, pageSize, type, category);

        // Validate pagination parameters
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 20;

        var query = context.UserActivities
            .Where(ua => ua.UserId == userId);

        // Filter by read status if specified
        if (isRead.HasValue)
        {
            query = query.Where(ua => ua.IsRead == isRead.Value);
        }

        // Filter by category (takes precedence over type)
        if (category.HasValue && category.Value != UserActivityCategory.All)
        {
            var typesInCategory = UserActivityHelper.GetTypesForCategory(category.Value);
            query = query.Where(ua => typesInCategory.Contains(ua.Type));
        }
        // Filter by specific type if specified and no category filter
        else if (type.HasValue)
        {
            query = query.Where(ua => ua.Type == type.Value);
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Calculate pagination metadata
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        var hasNext = page < totalPages;
        var hasPrevious = page > 1;

        // Get paginated results - include Rating navigation property
        var activitiesData = await query
            .Include(ua => ua.Rating)
                .ThenInclude(r => r!.Rater) // Include rater details
            .OrderByDescending(ua => ua.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var activities = activitiesData.Select(ua => new UserActivityResponseDto
        {
            Id = ua.Id,
            UserId = ua.UserId,
            Type = ua.Type,
            CreatedAtUtc = ua.CreatedAtUtc,
            IsRead = ua.IsRead,
            ListingId = ua.ListingId,
            PickupRequestId = ua.PickupRequestId,
            TransactionId = ua.TransactionId,
            RatingId = ua.RatingId,
            Rating = ua.Rating != null ? new RatingDto
            {
                Id = ua.Rating.Id,
                RaterId = ua.Rating.RaterId,
                RaterName = ua.Rating.Rater?.UserName ?? ua.Rating.Rater?.Email ?? "Unknown",
                Value = ua.Rating.Value,
                Comment = ua.Rating.Comment,
                CreatedAtUtc = ua.Rating.CreatedAtUtc
            } : null,
            TemplateData = !string.IsNullOrEmpty(ua.TemplateData)
                ? JsonSerializer.Deserialize<Dictionary<string, object>>(ua.TemplateData) ?? new Dictionary<string, object>()
                : new Dictionary<string, object>()
        }).ToList();

        var metadata = new PaginationMetadata
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNext = hasNext,
            HasPrevious = hasPrevious
        };

        logger.LogInformation("Retrieved {Count} activities for user {UserId}", activities.Count, userId);

        return (activities, metadata);
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await context.UserActivities
            .Where(ua => ua.UserId == userId && !ua.IsRead)
            .CountAsync();
    }

    public async Task CreateActivityAsync(ActivityCreationData data)
    {
        logger.LogInformation("Creating activity of type {Type} for user {UserId}", data.Type, data.UserId);

        var activity = new UserActivity
        {
            Id = Guid.NewGuid(),
            UserId = data.UserId,
            Type = data.Type,
            CreatedAtUtc = DateTime.UtcNow,
            IsRead = false,
            ListingId = data.ListingId,
            PickupRequestId = data.PickupRequestId,
            TransactionId = data.TransactionId,
            RatingId = data.RatingId,
            TemplateData = JsonSerializer.Serialize(data.TemplateData)
        };

        context.UserActivities.Add(activity);
        await context.SaveChangesAsync();

        logger.LogInformation("Activity {ActivityId} created for user {UserId}", activity.Id, data.UserId);
    }

    public async Task MarkAsReadAsync(Guid activityId, string userId)
    {
        var activity = await context.UserActivities
            .FirstOrDefaultAsync(ua => ua.Id == activityId && ua.UserId == userId);

        if (activity == null)
        {
            logger.LogWarning("Activity {ActivityId} not found for user {UserId}", activityId, userId);
            throw new KeyNotFoundException($"Activity {activityId} not found");
        }

        activity.IsRead = true;
        await context.SaveChangesAsync();

        logger.LogInformation("Activity {ActivityId} marked as read for user {UserId}", activityId, userId);
    }

    public async Task MarkAllAsReadAsync(string userId)
    {
        var unreadActivities = await context.UserActivities
            .Where(ua => ua.UserId == userId && !ua.IsRead)
            .ToListAsync();

        foreach (var activity in unreadActivities)
        {
            activity.IsRead = true;
        }

        await context.SaveChangesAsync();

        logger.LogInformation("Marked {Count} activities as read for user {UserId}", unreadActivities.Count, userId);
    }

    public async Task DeleteActivityAsync(Guid activityId, string userId)
    {
        var activity = await context.UserActivities
            .FirstOrDefaultAsync(ua => ua.Id == activityId && ua.UserId == userId);

        if (activity == null)
        {
            logger.LogWarning("Activity {ActivityId} not found for user {UserId}", activityId, userId);
            throw new KeyNotFoundException($"Activity {activityId} not found");
        }

        context.UserActivities.Remove(activity);
        await context.SaveChangesAsync();

        logger.LogInformation("Activity {ActivityId} deleted for user {UserId}", activityId, userId);
    }
}
