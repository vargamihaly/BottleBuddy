namespace BottleBuddy.Core.Dtos;

public class TransactionResponseDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid PickupRequestId { get; set; }
    public decimal VolunteerAmount { get; set; }
    public decimal OwnerAmount { get; set; }
    public decimal TotalRefund { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    // Additional info for display
    public string? VolunteerName { get; set; }
    public string? OwnerName { get; set; }
    public int? BottleCount { get; set; }
    public string? ListingTitle { get; set; }
}
