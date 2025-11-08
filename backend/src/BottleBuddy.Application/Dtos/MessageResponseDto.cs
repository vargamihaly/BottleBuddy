namespace BottleBuddy.Application.Dtos;

public class MessageResponseDto
{
    public Guid Id { get; set; }
    public Guid PickupRequestId { get; set; }
    public string SenderId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAtUtc { get; set; }
    public DateTime CreatedAt { get; set; }

    // Image attachment
    public string? ImageUrl { get; set; }
    public string? ImageFileName { get; set; }

    // Additional info
    public string? SenderName { get; set; }
    public string? SenderAvatarUrl { get; set; }
}
