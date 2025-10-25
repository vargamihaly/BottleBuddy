namespace BottleBuddy.Core.Dtos;

public class RatingResponseDto
{
    public Guid Id { get; set; }
    public string RaterId { get; set; } = string.Empty;
    public string RatedUserId { get; set; } = string.Empty;
    public Guid TransactionId { get; set; }
    public int Value { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }

    // Additional info
    public string? RaterName { get; set; }
    public string? RatedUserName { get; set; }
}
