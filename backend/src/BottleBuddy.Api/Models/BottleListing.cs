namespace BottleBuddy.Api.Models;

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
    public string Status { get; set; } = "open";
    public string Title { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    // Audit fields
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
