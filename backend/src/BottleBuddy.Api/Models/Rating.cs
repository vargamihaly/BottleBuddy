namespace BottleBuddy.Api.Models;

public class Rating
{
    public Guid Id { get; set; }
    public string RaterId { get; set; } = string.Empty;
    public string RatedUserId { get; set; } = string.Empty;
    public User? Rater { get; set; }
    public User? RatedUser { get; set; }
    public Guid TransactionId { get; set; }
    public Transaction? Transaction { get; set; }
    public int Value { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
