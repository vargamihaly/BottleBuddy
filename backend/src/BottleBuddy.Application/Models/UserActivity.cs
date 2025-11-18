using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Models;

public class UserActivity
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public UserActivityType Type { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public bool IsRead { get; set; }

    // Optional references to related entities
    public Guid? ListingId { get; set; }
    public Guid? PickupRequestId { get; set; }
    public Guid? TransactionId { get; set; }
    public Guid? RatingId { get; set; }

    // Template data for frontend localization (stored as JSON)
    public string TemplateData { get; set; } = string.Empty;

    // Navigation properties
    public User? User { get; set; }
    public BottleListing? Listing { get; set; }
    public PickupRequest? PickupRequest { get; set; }
    public Transaction? Transaction { get; set; }
    public Rating? Rating { get; set; }
}