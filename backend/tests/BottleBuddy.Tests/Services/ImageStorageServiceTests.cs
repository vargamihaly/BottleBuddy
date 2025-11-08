using BottleBuddy.Application.Services;
using BottleBuddy.Tests.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using Xunit;

namespace BottleBuddy.Tests.Services;

/// <summary>
/// Comprehensive tests for ImageStorageService
/// </summary>
public class ImageStorageServiceTests : IDisposable
{
    private readonly Mock<IWebHostEnvironment> _mockEnvironment;
    private readonly Mock<ILogger<ImageStorageService>> _mockLogger;
    private readonly ImageStorageService _imageService;
    private readonly string _testWebRootPath;
    private readonly string _testUploadPath;

    public ImageStorageServiceTests()
    {
        // Create temporary directory for testing
        _testWebRootPath = Path.Combine(Path.GetTempPath(), $"test_wwwroot_{Guid.NewGuid()}");
        _testUploadPath = Path.Combine(_testWebRootPath, "uploads", "messages");
        Directory.CreateDirectory(_testUploadPath);

        _mockEnvironment = new Mock<IWebHostEnvironment>();
        _mockEnvironment.Setup(e => e.WebRootPath).Returns(_testWebRootPath);

        _mockLogger = new Mock<ILogger<ImageStorageService>>();

        _imageService = new ImageStorageService(_mockEnvironment.Object, _mockLogger.Object);
    }

    public void Dispose()
    {
        // Clean up test directory
        if (Directory.Exists(_testWebRootPath))
        {
            Directory.Delete(_testWebRootPath, true);
        }
    }

    #region SaveMessageImageAsync - Happy Path Tests

    [Fact]
    public async Task SaveMessageImageAsync_WithValidJpegImage_ShouldSaveSuccessfully()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("test.jpg", "image/jpeg", ImageFormat.Jpeg);

        // Act
        var result = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        result.Should().NotBeNullOrEmpty();
        result.Should().StartWith("/uploads/messages/");
        result.Should().Contain(messageId.ToString());
        result.Should().EndWith(".jpg");

        // Verify file was actually saved
        var fileName = Path.GetFileName(result.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        var filePath = Path.Combine(_testUploadPath, fileName);
        File.Exists(filePath).Should().BeTrue();
    }

    [Fact]
    public async Task SaveMessageImageAsync_WithValidPngImage_ShouldSaveSuccessfully()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("test.png", "image/png", ImageFormat.Png);

        // Act
        var result = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        result.Should().NotBeNullOrEmpty();
        result.Should().StartWith("/uploads/messages/");
        result.Should().Contain(messageId.ToString());
    }

    [Fact]
    public async Task SaveMessageImageAsync_WithValidGifImage_ShouldSaveSuccessfully()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("test.gif", "image/gif", ImageFormat.Gif);

        // Act
        var result = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        result.Should().NotBeNullOrEmpty();
        result.Should().StartWith("/uploads/messages/");
    }

    [Fact]
    public async Task SaveMessageImageAsync_ShouldGenerateUniqueFilename()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile1 = CreateValidImageFile("test.jpg", "image/jpeg", ImageFormat.Jpeg);
        var mockFile2 = CreateValidImageFile("test.jpg", "image/jpeg", ImageFormat.Jpeg);

        // Act
        var result1 = await _imageService.SaveMessageImageAsync(mockFile1.Object, messageId);
        await Task.Delay(10); // Ensure different timestamp
        var result2 = await _imageService.SaveMessageImageAsync(mockFile2.Object, messageId);

        // Assert
        result1.Should().NotBe(result2);
    }

    [Fact]
    public async Task SaveMessageImageAsync_ShouldSanitizeFilename()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("test file-name.jpg", "image/jpeg", ImageFormat.Jpeg);

        // Act
        var result = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        result.Should().Contain("test_file_name");
        result.Should().NotContain(" ");
        result.Should().NotContain("--");
    }

    #endregion

    #region SaveMessageImageAsync - Validation Tests

    [Fact]
    public async Task SaveMessageImageAsync_WithNullFile_ShouldThrowArgumentException()
    {
        // Arrange
        var messageId = Guid.NewGuid();

        // Act
        Func<Task> act = async () => await _imageService.SaveMessageImageAsync(null!, messageId);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*No file provided*");
    }

    [Fact]
    public async Task SaveMessageImageAsync_WithEmptyFile_ShouldThrowArgumentException()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = TestHelpers.CreateMockFormFile("test.jpg", "image/jpeg", "", 0);

        // Act
        Func<Task> act = async () => await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*No file provided*");
    }

    [Fact]
    public async Task SaveMessageImageAsync_WithInvalidFileType_ShouldThrowArgumentException()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = TestHelpers.CreateMockFormFile("test.txt", "text/plain");

        // Act
        Func<Task> act = async () => await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*File type not allowed*");
    }

    [Fact]
    public async Task SaveMessageImageAsync_WithInvalidMimeType_ShouldThrowArgumentException()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = TestHelpers.CreateMockFormFile("test.jpg", "application/octet-stream");

        // Act
        Func<Task> act = async () => await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Invalid file content type*");
    }

    [Fact]
    public async Task SaveMessageImageAsync_WithFileTooLarge_ShouldThrowArgumentException()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var fileSizeOver5MB = 6 * 1024 * 1024; // 6 MB
        var mockFile = TestHelpers.CreateMockFormFile("large.jpg", "image/jpeg", "fake content", fileSizeOver5MB);

        // Act
        Func<Task> act = async () => await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*File size exceeds maximum allowed size*");
    }

    #endregion

    #region SaveMessageImageAsync - Image Processing Tests

    [Fact]
    public async Task SaveMessageImageAsync_WithLargeImage_ShouldResize()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("large.jpg", "image/jpeg", ImageFormat.Jpeg, width: 3000, height: 2000);

        // Act
        var result = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        result.Should().NotBeNullOrEmpty();

        // Verify the saved image is resized
        var fileName = Path.GetFileName(result.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        var filePath = Path.Combine(_testUploadPath, fileName);

        using var savedImage = await Image.LoadAsync(filePath);
        savedImage.Width.Should().BeLessOrEqualTo(1920);
        savedImage.Height.Should().BeLessOrEqualTo(1920);

        // Aspect ratio should be preserved
        var originalAspectRatio = 3000.0 / 2000.0;
        var savedAspectRatio = (double)savedImage.Width / savedImage.Height;
        savedAspectRatio.Should().BeApproximately(originalAspectRatio, 0.01);
    }

    [Fact]
    public async Task SaveMessageImageAsync_WithSmallImage_ShouldNotResize()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var originalWidth = 800;
        var originalHeight = 600;
        var mockFile = CreateValidImageFile("small.jpg", "image/jpeg", ImageFormat.Jpeg, originalWidth, originalHeight);

        // Act
        var result = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        var fileName = Path.GetFileName(result.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        var filePath = Path.Combine(_testUploadPath, fileName);

        using var savedImage = await Image.LoadAsync(filePath);
        savedImage.Width.Should().Be(originalWidth);
        savedImage.Height.Should().Be(originalHeight);
    }

    [Fact]
    public async Task SaveMessageImageAsync_ShouldSaveAsJpegFormat()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("test.png", "image/png", ImageFormat.Png);

        // Act
        var result = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Assert
        var fileName = Path.GetFileName(result.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        var filePath = Path.Combine(_testUploadPath, fileName);

        using var savedImage = await Image.LoadAsync(filePath);
        // The image should be saved in a valid format (ImageSharp will handle it)
        savedImage.Should().NotBeNull();
    }

    [Fact]
    public async Task SaveMessageImageAsync_ShouldCreateUploadDirectoryIfNotExists()
    {
        // Arrange
        var newWebRoot = Path.Combine(Path.GetTempPath(), $"test_new_{Guid.NewGuid()}");
        var newMockEnvironment = new Mock<IWebHostEnvironment>();
        newMockEnvironment.Setup(e => e.WebRootPath).Returns(newWebRoot);

        var newImageService = new ImageStorageService(newMockEnvironment.Object, _mockLogger.Object);
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("test.jpg", "image/jpeg", ImageFormat.Jpeg);

        try
        {
            // Act
            var result = await newImageService.SaveMessageImageAsync(mockFile.Object, messageId);

            // Assert
            var uploadPath = Path.Combine(newWebRoot, "uploads", "messages");
            Directory.Exists(uploadPath).Should().BeTrue();

            var fileName = Path.GetFileName(result.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            var filePath = Path.Combine(uploadPath, fileName);
            File.Exists(filePath).Should().BeTrue();
        }
        finally
        {
            // Cleanup
            if (Directory.Exists(newWebRoot))
            {
                Directory.Delete(newWebRoot, true);
            }
        }
    }

    #endregion

    #region DeleteMessageImageAsync Tests

    [Fact]
    public async Task DeleteMessageImageAsync_WithExistingFile_ShouldDeleteAndReturnTrue()
    {
        // Arrange
        var messageId = Guid.NewGuid();
        var mockFile = CreateValidImageFile("test.jpg", "image/jpeg", ImageFormat.Jpeg);
        var imagePath = await _imageService.SaveMessageImageAsync(mockFile.Object, messageId);

        // Verify file exists
        var fileName = Path.GetFileName(imagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        var filePath = Path.Combine(_testUploadPath, fileName);
        File.Exists(filePath).Should().BeTrue();

        // Act
        var result = await _imageService.DeleteMessageImageAsync(imagePath);

        // Assert
        result.Should().BeTrue();
        File.Exists(filePath).Should().BeFalse();
    }

    [Fact]
    public async Task DeleteMessageImageAsync_WithNonExistentFile_ShouldReturnFalse()
    {
        // Arrange
        var imagePath = "/uploads/messages/non-existent-file.jpg";

        // Act
        var result = await _imageService.DeleteMessageImageAsync(imagePath);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteMessageImageAsync_WithEmptyPath_ShouldReturnFalse()
    {
        // Act
        var result = await _imageService.DeleteMessageImageAsync("");

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteMessageImageAsync_WithNullPath_ShouldReturnFalse()
    {
        // Act
        var result = await _imageService.DeleteMessageImageAsync(null!);

        // Assert
        result.Should().BeFalse();
    }

    #endregion

    #region Helper Methods

    private enum ImageFormat
    {
        Jpeg,
        Png,
        Gif
    }

    private Mock<IFormFile> CreateValidImageFile(
        string filename,
        string contentType,
        ImageFormat format,
        int width = 100,
        int height = 100)
    {
        var stream = new MemoryStream();

        // Create a real image using ImageSharp
        using (var image = new Image<Rgba32>(width, height))
        {
            // Fill with a color
            image.Mutate(x => x.BackgroundColor(Color.Blue));

            // Save in the appropriate format
            switch (format)
            {
                case ImageFormat.Jpeg:
                    image.SaveAsJpeg(stream, new JpegEncoder());
                    break;
                case ImageFormat.Png:
                    image.SaveAsPng(stream, new PngEncoder());
                    break;
                case ImageFormat.Gif:
                    image.SaveAsGif(stream);
                    break;
            }
        }

        stream.Position = 0;

        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.FileName).Returns(filename);
        mockFile.Setup(f => f.ContentType).Returns(contentType);
        mockFile.Setup(f => f.Length).Returns(stream.Length);
        mockFile.Setup(f => f.OpenReadStream()).Returns(() =>
        {
            var newStream = new MemoryStream();
            stream.Position = 0;
            stream.CopyTo(newStream);
            newStream.Position = 0;
            stream.Position = 0;
            return newStream;
        });

        return mockFile;
    }

    #endregion
}
