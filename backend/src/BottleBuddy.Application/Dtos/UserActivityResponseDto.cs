using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Dtos;

public class UserActivityResponseDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public UserActivityType Type { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public bool IsRead { get; set; }

    // Optional references
    public Guid? ListingId { get; set; }
    public Guid? PickupRequestId { get; set; }
    public Guid? TransactionId { get; set; }
    public Guid? RatingId { get; set; }

    // Optional related entities
    public RatingDto? Rating { get; set; }

    // Template data for frontend localization
    public Dictionary<string, object> TemplateData { get; set; } = new();
}
