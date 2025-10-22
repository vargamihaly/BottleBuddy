namespace BottleBuddy.Api.Models;

public class Rating
{
    public Guid Id { get; set; }
    public string RaterId { get; set; } = string.Empty;
    public string RatedUserId { get; set; } = string.Empty;
    public ApplicationUser? Rater { get; set; }
    public ApplicationUser? RatedUser { get; set; }
    public Guid TransactionId { get; set; }
    public Transaction? Transaction { get; set; }
    public int Value { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
