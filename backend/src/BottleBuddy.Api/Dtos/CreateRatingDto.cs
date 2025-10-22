namespace BottleBuddy.Api.Dtos;

public class CreateRatingDto
{
    public Guid TransactionId { get; set; }
    public int Value { get; set; } // 1-5 stars
    public string? Comment { get; set; }
}
