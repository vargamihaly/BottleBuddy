namespace BottleBuddy.Application.Dtos;

public class CreatePickupRequestDto
{
    public Guid ListingId { get; set; }
    public string? Message { get; set; }
    public DateTime? PickupTime { get; set; }
}
