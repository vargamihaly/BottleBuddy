using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Models;

public class PickupRequest
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public BottleListing? Listing { get; set; }
    public string VolunteerId { get; set; } = string.Empty;
    public User? Volunteer { get; set; }
    public string? Message { get; set; }
    public DateTime? PickupTime { get; set; }
    public PickupRequestStatus Status { get; set; } = PickupRequestStatus.Pending;

    // Audit fields
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}
