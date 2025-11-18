namespace BottleBuddy.Application.Dtos;

public class UpdateUserNotificationSettingsDto
{
    public bool? EmailNotificationsEnabled { get; set; }
    public bool? PickupRequestReceivedEmail { get; set; }
    public bool? PickupRequestAcceptedEmail { get; set; }
    public bool? TransactionCompletedEmail { get; set; }
}
