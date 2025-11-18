namespace BottleBuddy.Application.Models;

public class UserNotificationSettings
{
    public bool EmailNotificationsEnabled { get; set; } = true;
    public bool PickupRequestReceivedEmail { get; set; } = true;
    public bool PickupRequestAcceptedEmail { get; set; } = true;
    public bool TransactionCompletedEmail { get; set; } = true;
}
