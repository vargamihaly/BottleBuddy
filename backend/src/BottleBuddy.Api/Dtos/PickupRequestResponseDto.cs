namespace BottleBuddy.Api.Dtos;

public class PickupRequestResponseDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public string VolunteerId { get; set; } = string.Empty;
    public string? VolunteerName { get; set; }
    public string? VolunteerEmail { get; set; }
    public string? Message { get; set; }
    public DateTime? PickupTime { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
