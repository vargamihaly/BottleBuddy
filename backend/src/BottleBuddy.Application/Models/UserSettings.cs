namespace BottleBuddy.Application.Models;

public class UserSettings
{
    // Primary key - same as ApplicationUser.Id (one-to-one)
    public string Id { get; set; } = string.Empty;

    // Foreign key to User
    public string UserId { get; set; } = string.Empty;

    // Preferred language, e.g. "en-US"
    public string PreferredLanguage { get; set; } = "en-US";

    // Owned sub-entity for notification settings
    public UserNotificationSettings NotificationSettings { get; set; } = new UserNotificationSettings();

    // Timestamps
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    // Navigation property - one-to-one relationship with ApplicationUser
    public User? User { get; set; }
}
