using System.ComponentModel.DataAnnotations;

namespace BottleBuddy.Api.Dtos;

public class CreateBottleListingRequest
{
    [Required(ErrorMessage = "Bottle count is required")]
    [Range(1, 10000, ErrorMessage = "Bottle count must be between 1 and 10000")]
    public int BottleCount { get; set; }

    [Required(ErrorMessage = "Location address is required")]
    [MinLength(3, ErrorMessage = "Location address must be at least 3 characters")]
    public string LocationAddress { get; set; } = string.Empty;

    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string? Title { get; set; }

    [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }

    [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
    public double? Latitude { get; set; }

    [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
    public double? Longitude { get; set; }

    [Required(ErrorMessage = "Estimated refund is required")]
    [Range(0, 1000000, ErrorMessage = "Estimated refund must be between 0 and 1,000,000")]
    public decimal EstimatedRefund { get; set; }

    public DateTime? PickupDeadline { get; set; }

    [Range(0, 100, ErrorMessage = "Split percentage must be between 0 and 100")]
    public decimal? SplitPercentage { get; set; }
}
