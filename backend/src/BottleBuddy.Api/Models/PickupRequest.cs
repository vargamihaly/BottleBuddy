using BottleBuddy.Api.Enums;

namespace BottleBuddy.Api.Models;

public class PickupRequest
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public BottleListing? Listing { get; set; }
    public string VolunteerId { get; set; } = string.Empty;
    public ApplicationUser? Volunteer { get; set; }
    public string? Message { get; set; }
    public DateTime? PickupTime { get; set; }
    public PickupRequestStatus Status { get; set; } = PickupRequestStatus.Pending;

    // Audit fields
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
