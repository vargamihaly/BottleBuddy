namespace BottleBuddy.Application.Dtos;

public class BottleListingResponseDto
{
    public Guid Id { get; set; }
    public int BottleCount { get; set; }
    public string LocationAddress { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Description { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public decimal EstimatedRefund { get; set; }
    public decimal? SplitPercentage { get; set; }
    public string Status { get; set; } = "open";
    public DateTime? PickupDeadline { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // User information
    public string? CreatedByUserName { get; set; }
    public string? CreatedByUserEmail { get; set; }
    public double? CreatedByUserRating { get; set; }
}
