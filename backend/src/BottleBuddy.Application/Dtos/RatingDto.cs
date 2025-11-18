namespace BottleBuddy.Application.Dtos;

public class RatingDto
{
    public Guid Id { get; set; }
    public string RaterId { get; set; } = string.Empty;
    public string RaterName { get; set; } = string.Empty;
    public int Value { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
