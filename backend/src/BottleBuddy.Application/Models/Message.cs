namespace BottleBuddy.Application.Models;

/// <summary>
/// Represents a message in a pickup request conversation
/// </summary>
public class Message
{
    public Guid Id { get; set; }

    /// <summary>
    /// The pickup request this message belongs to
    /// </summary>
    public Guid PickupRequestId { get; set; }
    public PickupRequest? PickupRequest { get; set; }

    /// <summary>
    /// ID of the user who sent this message
    /// </summary>
    public string SenderId { get; set; } = string.Empty;
    public User? Sender { get; set; }

    /// <summary>
    /// Message content (max 1000 characters)
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// Relative path or URL to attached image (e.g., /uploads/messages/filename.jpg)
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Original filename of the attached image
    /// </summary>
    public string? ImageFileName { get; set; }

    /// <summary>
    /// Whether the message has been read by the recipient
    /// </summary>
    public bool IsRead { get; set; } = false;

    /// <summary>
    /// When the message was marked as read (UTC), null if not read yet
    /// </summary>
    public DateTime? ReadAtUtc { get; set; }

    /// <summary>
    /// When the message was created (UTC)
    /// </summary>
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
