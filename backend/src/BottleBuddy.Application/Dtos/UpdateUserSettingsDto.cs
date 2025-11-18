namespace BottleBuddy.Application.Dtos;

public class UpdateUserSettingsDto
{
    public string? PreferredLanguage { get; set; }
    public UpdateUserNotificationSettingsDto? NotificationSettings { get; set; }
}
