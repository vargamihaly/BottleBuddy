namespace BottleBuddy.Application.Dtos;

public class UserSettingsDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = string.Empty;
    public UserNotificationSettingsDto NotificationSettings { get; set; } = new();
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}
