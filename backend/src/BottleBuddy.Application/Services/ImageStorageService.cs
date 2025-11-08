using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace BottleBuddy.Application.Services;

/// <summary>
/// Service for managing image storage for message attachments
/// </summary>
public class ImageStorageService : IImageStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ImageStorageService> _logger;
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB
    private const int MaxImageDimension = 1920; // Max width or height
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
    private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/gif" };

    public ImageStorageService(IWebHostEnvironment environment, ILogger<ImageStorageService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public async Task<string> SaveMessageImageAsync(IFormFile file, Guid messageId)
    {
        // Validate file
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("No file provided");
        }

        // Check file size
        if (file.Length > MaxFileSizeBytes)
        {
            throw new ArgumentException($"File size exceeds maximum allowed size of {MaxFileSizeBytes / 1024 / 1024}MB");
        }

        // Check file extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            throw new ArgumentException($"File type not allowed. Allowed types: {string.Join(", ", AllowedExtensions)}");
        }

        // Check MIME type
        if (!AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            throw new ArgumentException($"Invalid file content type. Allowed types: {string.Join(", ", AllowedMimeTypes)}");
        }

        try
        {
            // Create upload directory if it doesn't exist
            var uploadDir = Path.Combine(_environment.WebRootPath, "uploads", "messages");
            Directory.CreateDirectory(uploadDir);

            // Generate unique filename
            var timestamp = DateTime.UtcNow.Ticks;
            var sanitizedOriginalName = Path.GetFileNameWithoutExtension(file.FileName)
                .Replace(" ", "_")
                .Replace("-", "_");
            var fileName = $"{messageId}_{timestamp}_{sanitizedOriginalName}{extension}";
            var filePath = Path.Combine(uploadDir, fileName);

            // Load and process the image
            using (var image = await Image.LoadAsync(file.OpenReadStream()))
            {
                // Resize if needed
                if (image.Width > MaxImageDimension || image.Height > MaxImageDimension)
                {
                    _logger.LogInformation(
                        "Resizing image {FileName} from {OriginalWidth}x{OriginalHeight}",
                        fileName,
                        image.Width,
                        image.Height);

                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(MaxImageDimension, MaxImageDimension),
                        Mode = ResizeMode.Max
                    }));
                }

                // Save with optimization
                var encoder = new JpegEncoder
                {
                    Quality = 85 // Good quality with compression
                };

                await image.SaveAsync(filePath, encoder);
            }

            // Return relative URL path
            var relativePath = $"/uploads/messages/{fileName}";

            _logger.LogInformation(
                "Image saved successfully for message {MessageId}: {FilePath}",
                messageId,
                relativePath);

            return relativePath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving image for message {MessageId}", messageId);
            throw new InvalidOperationException("Failed to save image", ex);
        }
    }

    public async Task<bool> DeleteMessageImageAsync(string imagePath)
    {
        if (string.IsNullOrEmpty(imagePath))
        {
            return false;
        }

        try
        {
            // Convert relative URL path to physical path
            var relativePath = imagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var fullPath = Path.Combine(_environment.WebRootPath, relativePath);

            if (File.Exists(fullPath))
            {
                await Task.Run(() => File.Delete(fullPath));
                _logger.LogInformation("Deleted image: {ImagePath}", imagePath);
                return true;
            }

            _logger.LogWarning("Image not found for deletion: {ImagePath}", imagePath);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting image: {ImagePath}", imagePath);
            return false;
        }
    }
}
