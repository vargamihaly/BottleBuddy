using BottleBuddy.Application.Dtos;

namespace BottleBuddy.Application.Services;

/// <summary>
/// Service for managing user settings (language preferences and notification preferences)
/// </summary>
public interface IUserSettingsService
{
    /// <summary>
    /// Update settings for a user
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <param name="dto">The updated settings</param>
    /// <returns>The updated settings</returns>
    /// <exception cref="KeyNotFoundException">Thrown when settings don't exist for the user</exception>
    Task<UserSettingsDto> UpdateSettingsAsync(string userId, UpdateUserSettingsDto dto);

    //TODO can be deleted? 
    
    /// <summary>
    /// Get settings for a user, creating them with defaults if they don't exist
    /// </summary>
    /// <param name="userId">The user ID</param>
    /// <returns>The user's settings</returns>
    Task<UserSettingsDto> GetOrCreateSettingsAsync(string userId);
}
