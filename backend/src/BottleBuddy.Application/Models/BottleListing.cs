using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Models;

public class BottleListing
{
    public Guid Id { get; set; }
    public int BottleCount { get; set; }
    public string LocationAddress { get; set; } = string.Empty;
    public string? Description { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public decimal EstimatedRefund { get; set; }
    public DateTime? PickupDeadline { get; set; }
    public decimal? SplitPercentage { get; set; }
    public ListingStatus Status { get; set; } = ListingStatus.Open;
    public string Title { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public User? Owner { get; set; }

    // Navigation property for pickup requests
    public ICollection<PickupRequest> PickupRequests { get; set; } = new List<PickupRequest>();

    // Audit fields
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}
