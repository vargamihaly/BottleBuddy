namespace BottleBuddy.Api.Models;

public class Profile
{
    // Primary key - same as ApplicationUser.Id (one-to-one)
    public string Id { get; set; } = string.Empty;

    // Profile information
    public string? FullName { get; set; }
    public string? Username { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }

    // Rating information (calculated from user ratings)
    public double? Rating { get; set; }
    public int TotalRatings { get; set; } = 0;

    // Timestamps
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    // Navigation property - one-to-one relationship with ApplicationUser
    public User? User { get; set; }
}
