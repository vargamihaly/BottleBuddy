using BottleBuddy.Application.Data;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Application.Services;

public class UserSettingsService(
    ApplicationDbContext context,
    ILogger<UserSettingsService> logger) : IUserSettingsService
{
    /// <summary>
    /// Update settings for a user
    /// </summary>
    public async Task<UserSettingsDto> UpdateSettingsAsync(
        string userId,
        UpdateUserSettingsDto dto)
    {
        logger.LogInformation("Updating user settings for user {UserId}", userId);

        var settings = await context.UserSettings
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings == null)
        {
            logger.LogWarning("User settings not found for user {UserId}", userId);
            throw new KeyNotFoundException($"User settings not found for user {userId}");
        }

        // Update preferred language if provided
        if (dto.PreferredLanguage != null)
        {
            settings.PreferredLanguage = dto.PreferredLanguage;
        }

        // Update notification settings if provided (PATCH semantics)
        if (dto.NotificationSettings != null)
        {
            if (dto.NotificationSettings.EmailNotificationsEnabled.HasValue)
            {
                settings.NotificationSettings.EmailNotificationsEnabled =
                    dto.NotificationSettings.EmailNotificationsEnabled.Value;
            }

            if (dto.NotificationSettings.PickupRequestReceivedEmail.HasValue)
            {
                settings.NotificationSettings.PickupRequestReceivedEmail =
                    dto.NotificationSettings.PickupRequestReceivedEmail.Value;
            }

            if (dto.NotificationSettings.PickupRequestAcceptedEmail.HasValue)
            {
                settings.NotificationSettings.PickupRequestAcceptedEmail =
                    dto.NotificationSettings.PickupRequestAcceptedEmail.Value;
            }

            if (dto.NotificationSettings.TransactionCompletedEmail.HasValue)
            {
                settings.NotificationSettings.TransactionCompletedEmail =
                    dto.NotificationSettings.TransactionCompletedEmail.Value;
            }
        }

        settings.UpdatedAtUtc = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("User settings updated for user {UserId}", userId);

        return MapToDto(settings);
    }

    /// <summary>
    /// Get settings for a user, creating them with defaults if they don't exist
    /// </summary>
    public async Task<UserSettingsDto> GetOrCreateSettingsAsync(string userId)
    {
        logger.LogInformation("Getting or creating user settings for user {UserId}", userId);

        var settings = await context.UserSettings
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (settings == null)
        {
            logger.LogInformation("Creating default user settings for user {UserId}", userId);

            settings = new UserSettings
            {
                Id = userId, // Same as UserId for one-to-one relationship
                UserId = userId,
                PreferredLanguage = "en-US",
                NotificationSettings = new UserNotificationSettings
                {
                    EmailNotificationsEnabled = true,
                    PickupRequestReceivedEmail = true,
                    PickupRequestAcceptedEmail = true,
                    TransactionCompletedEmail = true
                },
                CreatedAtUtc = DateTime.UtcNow,
                UpdatedAtUtc = DateTime.UtcNow
            };

            context.UserSettings.Add(settings);
            await context.SaveChangesAsync();

            logger.LogInformation("Default user settings created for user {UserId}", userId);
        }

        return MapToDto(settings);
    }

    /// <summary>
    /// Map UserSettings entity to DTO
    /// </summary>
    private static UserSettingsDto MapToDto(UserSettings settings)
    {
        return new UserSettingsDto
        {
            Id = settings.Id,
            UserId = settings.UserId,
            PreferredLanguage = settings.PreferredLanguage,
            NotificationSettings = new UserNotificationSettingsDto
            {
                EmailNotificationsEnabled = settings.NotificationSettings.EmailNotificationsEnabled,
                PickupRequestReceivedEmail = settings.NotificationSettings.PickupRequestReceivedEmail,
                PickupRequestAcceptedEmail = settings.NotificationSettings.PickupRequestAcceptedEmail,
                TransactionCompletedEmail = settings.NotificationSettings.TransactionCompletedEmail
            },
            CreatedAtUtc = settings.CreatedAtUtc,
            UpdatedAtUtc = settings.UpdatedAtUtc
        };
    }
}
