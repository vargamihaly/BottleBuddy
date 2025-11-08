using Microsoft.AspNetCore.Http;

namespace BottleBuddy.Application.Services;

/// <summary>
/// Service for managing image storage for message attachments
/// </summary>
public interface IImageStorageService
{
    /// <summary>
    /// Save a message image and return the relative URL path
    /// </summary>
    /// <param name="file">The uploaded image file</param>
    /// <param name="messageId">The ID of the message this image belongs to</param>
    /// <returns>Relative URL path to the saved image (e.g., /uploads/messages/filename.jpg)</returns>
    Task<string> SaveMessageImageAsync(IFormFile file, Guid messageId);

    /// <summary>
    /// Delete a message image
    /// </summary>
    /// <param name="imagePath">The relative URL path to the image</param>
    /// <returns>True if deleted successfully, false if file not found</returns>
    Task<bool> DeleteMessageImageAsync(string imagePath);
}
