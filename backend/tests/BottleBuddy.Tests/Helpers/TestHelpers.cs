using BottleBuddy.Application.Data;
using BottleBuddy.Application.Enums;
using BottleBuddy.Application.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace BottleBuddy.Tests.Helpers;

/// <summary>
/// Helper methods for creating test data and mocks
/// </summary>
public static class TestHelpers
{
    /// <summary>
    /// Creates an in-memory database context for testing
    /// </summary>
    /// <param name="databaseName">Optional database name (defaults to a unique GUID)</param>
    /// <returns>ApplicationDbContext configured with InMemory provider</returns>
    public static ApplicationDbContext CreateInMemoryDbContext(string? databaseName = null)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName ?? Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    /// <summary>
    /// Creates a mock IFormFile for testing file uploads
    /// </summary>
    /// <param name="filename">The filename</param>
    /// <param name="contentType">The MIME content type</param>
    /// <param name="content">Optional file content (defaults to "fake image content")</param>
    /// <param name="size">Optional file size in bytes (overrides content length if specified)</param>
    /// <returns>Mock IFormFile</returns>
    public static Mock<IFormFile> CreateMockFormFile(
        string filename,
        string contentType,
        string? content = null,
        long? size = null)
    {
        var fileContent = content ?? "fake image content";
        var stream = new MemoryStream();
        var writer = new StreamWriter(stream);
        writer.Write(fileContent);
        writer.Flush();
        stream.Position = 0;

        var mockFile = new Mock<IFormFile>();
        mockFile.Setup(f => f.FileName).Returns(filename);
        mockFile.Setup(f => f.ContentType).Returns(contentType);
        mockFile.Setup(f => f.Length).Returns(size ?? stream.Length);
        mockFile.Setup(f => f.OpenReadStream()).Returns(stream);
        mockFile.Setup(f => f.CopyToAsync(It.IsAny<Stream>(), It.IsAny<CancellationToken>()))
            .Returns((Stream target, CancellationToken token) => stream.CopyToAsync(target, token));

        return mockFile;
    }

    /// <summary>
    /// Creates a test User with Profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="email">User email</param>
    /// <param name="username">Username</param>
    /// <param name="fullName">Full name</param>
    /// <returns>User with Profile</returns>
    public static User CreateMockUser(
        string id,
        string email,
        string username,
        string? fullName = null)
    {
        var user = new User
        {
            Id = id,
            Email = email,
            UserName = username,
            EmailConfirmed = true,
            Profile = new Profile
            {
                Id = id,
                Username = username,
                FullName = fullName ?? username,
                CreatedAtUtc = DateTime.UtcNow
            }
        };

        return user;
    }

    /// <summary>
    /// Creates a test BottleListing
    /// </summary>
    /// <param name="id">Listing ID</param>
    /// <param name="ownerId">Owner user ID</param>
    /// <param name="title">Listing title</param>
    /// <param name="bottleCount">Number of bottles</param>
    /// <param name="status">Listing status</param>
    /// <returns>BottleListing</returns>
    public static BottleListing CreateMockBottleListing(
        Guid id,
        string ownerId,
        string title = "Test Listing",
        int bottleCount = 10,
        ListingStatus status = ListingStatus.Open)
    {
        return new BottleListing
        {
            Id = id,
            OwnerId = ownerId,
            Title = title,
            BottleCount = bottleCount,
            LocationAddress = "123 Test St",
            Description = "Test description",
            EstimatedRefund = 5.00m,
            Status = status,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Creates a test PickupRequest
    /// </summary>
    /// <param name="id">PickupRequest ID</param>
    /// <param name="listingId">Listing ID</param>
    /// <param name="volunteerId">Volunteer user ID</param>
    /// <param name="status">Request status</param>
    /// <returns>PickupRequest</returns>
    public static PickupRequest CreateMockPickupRequest(
        Guid id,
        Guid listingId,
        string volunteerId,
        PickupRequestStatus status = PickupRequestStatus.Pending)
    {
        return new PickupRequest
        {
            Id = id,
            ListingId = listingId,
            VolunteerId = volunteerId,
            Message = "I'd like to pick this up",
            Status = status,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Creates a test Message
    /// </summary>
    /// <param name="id">Message ID</param>
    /// <param name="pickupRequestId">PickupRequest ID</param>
    /// <param name="senderId">Sender user ID</param>
    /// <param name="content">Message content</param>
    /// <param name="isRead">Whether message is read</param>
    /// <param name="imageUrl">Optional image URL</param>
    /// <returns>Message</returns>
    public static Message CreateMockMessage(
        Guid id,
        Guid pickupRequestId,
        string senderId,
        string content = "Test message",
        bool isRead = false,
        string? imageUrl = null)
    {
        return new Message
        {
            Id = id,
            PickupRequestId = pickupRequestId,
            SenderId = senderId,
            Content = content,
            IsRead = isRead,
            ImageUrl = imageUrl,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Seeds test data into the context
    /// </summary>
    /// <param name="context">Database context</param>
    /// <param name="saveChanges">Whether to save changes (default true)</param>
    /// <returns>TestDataSet containing all seeded entities</returns>
    public static TestDataSet SeedTestData(ApplicationDbContext context, bool saveChanges = true)
    {
        // Create users
        var owner = CreateMockUser("owner-id", "owner@test.com", "owner", "Test Owner");
        var volunteer = CreateMockUser("volunteer-id", "volunteer@test.com", "volunteer", "Test Volunteer");

        context.Users.AddRange(owner, volunteer);
        context.Profiles.AddRange(owner.Profile!, volunteer.Profile!);

        // Create listing
        var listingId = Guid.NewGuid();
        var listing = CreateMockBottleListing(listingId, owner.Id);
        listing.Owner = owner;
        context.BottleListings.Add(listing);

        // Create pickup request
        var pickupRequestId = Guid.NewGuid();
        var pickupRequest = CreateMockPickupRequest(pickupRequestId, listingId, volunteer.Id);
        pickupRequest.Listing = listing;
        pickupRequest.Volunteer = volunteer;
        context.PickupRequests.Add(pickupRequest);

        // Create some messages
        var message1 = CreateMockMessage(Guid.NewGuid(), pickupRequestId, volunteer.Id, "Hello from volunteer");
        message1.Sender = volunteer;
        var message2 = CreateMockMessage(Guid.NewGuid(), pickupRequestId, owner.Id, "Hello from owner");
        message2.Sender = owner;

        context.Messages.AddRange(message1, message2);

        if (saveChanges)
        {
            context.SaveChanges();
        }

        return new TestDataSet
        {
            Owner = owner,
            Volunteer = volunteer,
            Listing = listing,
            PickupRequest = pickupRequest,
            Messages = new[] { message1, message2 }
        };
    }

    /// <summary>
    /// Container for test data entities
    /// </summary>
    public class TestDataSet
    {
        public User Owner { get; set; } = null!;
        public User Volunteer { get; set; } = null!;
        public BottleListing Listing { get; set; } = null!;
        public PickupRequest PickupRequest { get; set; } = null!;
        public Message[] Messages { get; set; } = Array.Empty<Message>();
    }
}
