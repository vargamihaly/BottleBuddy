using System.Text.Json.Serialization;

namespace BottleBuddy.Api.Dtos;

public class UserResponseDto
{
    // User account information
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    [JsonIgnore] // Don't serialize UserName from Identity, use Username from Profile instead
    public string? UserName { get; set; }

    public bool EmailConfirmed { get; set; }

    // Profile information
    public string? FullName { get; set; }
    public string? Username { get; set; }
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public double? Rating { get; set; }
    public int TotalRatings { get; set; }
    public DateTime? ProfileCreatedAt { get; set; }
}
