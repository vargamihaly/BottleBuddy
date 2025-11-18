using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Dtos;

public class ActivityCreationData
{
    public UserActivityType Type { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Guid? ListingId { get; set; }
    public Guid? PickupRequestId { get; set; }
    public Guid? TransactionId { get; set; }
    public Guid? RatingId { get; set; }
    public Dictionary<string, object> TemplateData { get; set; } = new();
}
