using BottleBuddy.Application.Data;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Models;
using BottleBuddy.Application.Services;
using BottleBuddy.Tests.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace BottleBuddy.Tests.Services;

/// <summary>
/// Comprehensive tests for MessageService
/// </summary>
public class MessageServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<ILogger<MessageService>> _mockLogger;
    private readonly Mock<IMessageHubService> _mockHubService;
    private readonly Mock<IImageStorageService> _mockImageService;
    private readonly MessageService _messageService;
    private readonly TestHelpers.TestDataSet _testData;

    public MessageServiceTests()
    {
        _context = TestHelpers.CreateInMemoryDbContext();
        _mockLogger = new Mock<ILogger<MessageService>>();
        _mockHubService = new Mock<IMessageHubService>();
        _mockImageService = new Mock<IImageStorageService>();

        _messageService = new MessageService(
            _context,
            _mockLogger.Object,
            _mockImageService.Object,
            _mockHubService.Object);

        _testData = TestHelpers.SeedTestData(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    #region SendMessageAsync Tests

    [Fact]
    public async Task SendMessageAsync_WithValidContent_ShouldCreateMessage()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "Test message content" };

        // Act
        var result = await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Volunteer.Id);

        // Assert
        result.Should().NotBeNull();
        result.Content.Should().Be("Test message content");
        result.SenderId.Should().Be(_testData.Volunteer.Id);
        result.PickupRequestId.Should().Be(_testData.PickupRequest.Id);
        result.IsRead.Should().BeFalse();

        var messageInDb = await _context.Messages.FindAsync(result.Id);
        messageInDb.Should().NotBeNull();
        messageInDb!.Content.Should().Be("Test message content");
    }

    [Fact]
    public async Task SendMessageAsync_WithValidImage_ShouldCreateMessageWithImage()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "" };
        var mockFile = TestHelpers.CreateMockFormFile("test.jpg", "image/jpeg");
        var expectedImageUrl = "/uploads/messages/test-image.jpg";

        _mockImageService
            .Setup(x => x.SaveMessageImageAsync(It.IsAny<IFormFile>(), It.IsAny<Guid>()))
            .ReturnsAsync(expectedImageUrl);

        // Act
        var result = await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Volunteer.Id,
            mockFile.Object);

        // Assert
        result.Should().NotBeNull();
        result.ImageUrl.Should().Be(expectedImageUrl);
        result.ImageFileName.Should().Be("test.jpg");

        _mockImageService.Verify(
            x => x.SaveMessageImageAsync(It.IsAny<IFormFile>(), It.IsAny<Guid>()),
            Times.Once);
    }

    [Fact]
    public async Task SendMessageAsync_WithContentAndImage_ShouldCreateMessageWithBoth()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "Message with image" };
        var mockFile = TestHelpers.CreateMockFormFile("test.png", "image/png");
        var expectedImageUrl = "/uploads/messages/test-image.png";

        _mockImageService
            .Setup(x => x.SaveMessageImageAsync(It.IsAny<IFormFile>(), It.IsAny<Guid>()))
            .ReturnsAsync(expectedImageUrl);

        // Act
        var result = await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Volunteer.Id,
            mockFile.Object);

        // Assert
        result.Should().NotBeNull();
        result.Content.Should().Be("Message with image");
        result.ImageUrl.Should().Be(expectedImageUrl);
    }

    [Fact]
    public async Task SendMessageAsync_WithEmptyContentAndNoImage_ShouldThrowArgumentException()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "" };

        // Act
        Func<Task> act = async () => await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Volunteer.Id);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Either message content or image must be provided*");
    }

    [Fact]
    public async Task SendMessageAsync_WithWhitespaceContentAndNoImage_ShouldThrowArgumentException()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "   " };

        // Act
        Func<Task> act = async () => await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Volunteer.Id);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Either message content or image must be provided*");
    }

    [Fact]
    public async Task SendMessageAsync_WhenUserNotInConversation_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var unauthorizedUserId = "unauthorized-user-id";
        var dto = new CreateMessageDto { Content = "Unauthorized message" };

        // Act
        Func<Task> act = async () => await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            unauthorizedUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*You can only send messages to pickup requests you are part of*");
    }

    [Fact]
    public async Task SendMessageAsync_WhenPickupRequestNotFound_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var nonExistentPickupRequestId = Guid.NewGuid();
        var dto = new CreateMessageDto { Content = "Test message" };

        // Act
        Func<Task> act = async () => await _messageService.SendMessageAsync(
            nonExistentPickupRequestId,
            dto,
            _testData.Volunteer.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Pickup request not found*");
    }

    [Fact]
    public async Task SendMessageAsync_AsOwner_ShouldCreateMessage()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "Message from owner" };

        // Act
        var result = await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result.SenderId.Should().Be(_testData.Owner.Id);
    }

    [Fact]
    public async Task SendMessageAsync_ShouldBroadcastViaSignalR()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "Broadcast test" };

        // Act
        var result = await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Volunteer.Id);

        // Assert
        _mockHubService.Verify(
            x => x.BroadcastMessageAsync(
                _testData.PickupRequest.Id.ToString(),
                It.Is<MessageResponseDto>(m => m.Id == result.Id)),
            Times.Once);
    }

    [Fact]
    public async Task SendMessageAsync_WhenImageSaveFails_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var dto = new CreateMessageDto { Content = "" };
        var mockFile = TestHelpers.CreateMockFormFile("test.jpg", "image/jpeg");

        _mockImageService
            .Setup(x => x.SaveMessageImageAsync(It.IsAny<IFormFile>(), It.IsAny<Guid>()))
            .ThrowsAsync(new Exception("Storage error"));

        // Act
        Func<Task> act = async () => await _messageService.SendMessageAsync(
            _testData.PickupRequest.Id,
            dto,
            _testData.Volunteer.Id,
            mockFile.Object);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Failed to save image attachment*");
    }

    #endregion

    #region GetMessagesAsync Tests

    [Fact]
    public async Task GetMessagesAsync_AsAuthorizedUser_ShouldReturnMessages()
    {
        // Act
        var result = await _messageService.GetMessagesAsync(
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetMessagesAsync_ShouldOrderByCreatedAtUtcAscending()
    {
        // Arrange - Add more messages with different timestamps
        var message3 = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            _testData.PickupRequest.Id,
            _testData.Owner.Id,
            "Latest message");
        message3.CreatedAtUtc = DateTime.UtcNow.AddMinutes(1);
        message3.Sender = _testData.Owner;
        _context.Messages.Add(message3);
        await _context.SaveChangesAsync();

        // Act
        var result = await _messageService.GetMessagesAsync(
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id);

        // Assert
        result.Should().HaveCount(3);
        result[0].CreatedAt.Should().BeBefore(result[1].CreatedAt);
        result[1].CreatedAt.Should().BeBefore(result[2].CreatedAt);
    }

    [Fact]
    public async Task GetMessagesAsync_WhenUserNotInConversation_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var unauthorizedUserId = "unauthorized-user-id";

        // Act
        Func<Task> act = async () => await _messageService.GetMessagesAsync(
            _testData.PickupRequest.Id,
            unauthorizedUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*You can only view messages for pickup requests you are part of*");
    }

    [Fact]
    public async Task GetMessagesAsync_WhenPickupRequestNotFound_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var nonExistentPickupRequestId = Guid.NewGuid();

        // Act
        Func<Task> act = async () => await _messageService.GetMessagesAsync(
            nonExistentPickupRequestId,
            _testData.Volunteer.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Pickup request not found*");
    }

    [Fact]
    public async Task GetMessagesAsync_AsOwner_ShouldReturnMessages()
    {
        // Act
        var result = await _messageService.GetMessagesAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2);
    }

    #endregion

    #region MarkAsReadAsync Tests

    [Fact]
    public async Task MarkAsReadAsync_WithValidMessage_ShouldMarkAsRead()
    {
        // Arrange
        var message = _testData.Messages[0]; // Message from volunteer

        // Act
        await _messageService.MarkAsReadAsync(message.Id, _testData.Owner.Id);

        // Assert
        var updatedMessage = await _context.Messages.FindAsync(message.Id);
        updatedMessage.Should().NotBeNull();
        updatedMessage!.IsRead.Should().BeTrue();
        updatedMessage.ReadAtUtc.Should().NotBeNull();
        updatedMessage.ReadAtUtc.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task MarkAsReadAsync_ShouldBroadcastViaSignalR()
    {
        // Arrange
        var message = _testData.Messages[0]; // Message from volunteer

        // Act
        await _messageService.MarkAsReadAsync(message.Id, _testData.Owner.Id);

        // Assert
        _mockHubService.Verify(
            x => x.BroadcastMessageReadAsync(
                _testData.PickupRequest.Id.ToString(),
                message.Id.ToString(),
                It.IsAny<DateTime?>()),
            Times.Once);
    }

    [Fact]
    public async Task MarkAsReadAsync_WhenMarkingOwnMessage_ShouldNotMarkAsRead()
    {
        // Arrange
        var message = _testData.Messages[0]; // Message from volunteer

        // Act
        await _messageService.MarkAsReadAsync(message.Id, _testData.Volunteer.Id);

        // Assert
        var updatedMessage = await _context.Messages.FindAsync(message.Id);
        updatedMessage!.IsRead.Should().BeFalse();
        updatedMessage.ReadAtUtc.Should().BeNull();

        // SignalR should not be called
        _mockHubService.Verify(
            x => x.BroadcastMessageReadAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DateTime?>()),
            Times.Never);
    }

    [Fact]
    public async Task MarkAsReadAsync_WhenUserNotInConversation_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var message = _testData.Messages[0];
        var unauthorizedUserId = "unauthorized-user-id";

        // Act
        Func<Task> act = async () => await _messageService.MarkAsReadAsync(
            message.Id,
            unauthorizedUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*You can only mark messages as read in conversations you are part of*");
    }

    [Fact]
    public async Task MarkAsReadAsync_WhenMessageNotFound_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var nonExistentMessageId = Guid.NewGuid();

        // Act
        Func<Task> act = async () => await _messageService.MarkAsReadAsync(
            nonExistentMessageId,
            _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Message not found*");
    }

    #endregion

    #region MarkAllAsReadAsync Tests

    [Fact]
    public async Task MarkAllAsReadAsync_ShouldMarkAllUnreadMessages()
    {
        // Arrange - Add more unread messages
        var unreadMessage1 = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id,
            "Unread 1");
        unreadMessage1.Sender = _testData.Volunteer;

        var unreadMessage2 = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id,
            "Unread 2");
        unreadMessage2.Sender = _testData.Volunteer;

        _context.Messages.AddRange(unreadMessage1, unreadMessage2);
        await _context.SaveChangesAsync();

        // Act
        await _messageService.MarkAllAsReadAsync(_testData.PickupRequest.Id, _testData.Owner.Id);

        // Assert
        var messages = await _context.Messages
            .Where(m => m.PickupRequestId == _testData.PickupRequest.Id && m.SenderId == _testData.Volunteer.Id)
            .ToListAsync();

        messages.Should().AllSatisfy(m =>
        {
            m.IsRead.Should().BeTrue();
            m.ReadAtUtc.Should().NotBeNull();
        });
    }

    [Fact]
    public async Task MarkAllAsReadAsync_ShouldSetSameTimestampForAll()
    {
        // Arrange
        var unreadMessage1 = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id,
            "Unread 1");
        unreadMessage1.Sender = _testData.Volunteer;

        var unreadMessage2 = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id,
            "Unread 2");
        unreadMessage2.Sender = _testData.Volunteer;

        _context.Messages.AddRange(unreadMessage1, unreadMessage2);
        await _context.SaveChangesAsync();

        // Act
        await _messageService.MarkAllAsReadAsync(_testData.PickupRequest.Id, _testData.Owner.Id);

        // Assert
        var messages = await _context.Messages
            .Where(m => m.PickupRequestId == _testData.PickupRequest.Id && m.SenderId == _testData.Volunteer.Id)
            .ToListAsync();

        var firstTimestamp = messages[0].ReadAtUtc;
        messages.Should().AllSatisfy(m => m.ReadAtUtc.Should().Be(firstTimestamp));
    }

    [Fact]
    public async Task MarkAllAsReadAsync_ShouldNotMarkOwnMessages()
    {
        // Arrange - Add message from owner
        var ownMessage = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            _testData.PickupRequest.Id,
            _testData.Owner.Id,
            "Owner's message");
        ownMessage.Sender = _testData.Owner;
        _context.Messages.Add(ownMessage);
        await _context.SaveChangesAsync();

        // Act
        await _messageService.MarkAllAsReadAsync(_testData.PickupRequest.Id, _testData.Owner.Id);

        // Assert
        var ownerMessage = await _context.Messages.FindAsync(ownMessage.Id);
        ownerMessage!.IsRead.Should().BeFalse();
        ownerMessage.ReadAtUtc.Should().BeNull();
    }

    [Fact]
    public async Task MarkAllAsReadAsync_WhenUserNotInConversation_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var unauthorizedUserId = "unauthorized-user-id";

        // Act
        Func<Task> act = async () => await _messageService.MarkAllAsReadAsync(
            _testData.PickupRequest.Id,
            unauthorizedUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*You can only mark messages as read in conversations you are part of*");
    }

    [Fact]
    public async Task MarkAllAsReadAsync_WhenPickupRequestNotFound_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var nonExistentPickupRequestId = Guid.NewGuid();

        // Act
        Func<Task> act = async () => await _messageService.MarkAllAsReadAsync(
            nonExistentPickupRequestId,
            _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Pickup request not found*");
    }

    #endregion

    #region GetUnreadCountAsync Tests

    [Fact]
    public async Task GetUnreadCountAsync_ShouldReturnCorrectCount()
    {
        // Arrange - Messages from volunteer (should be counted for owner)
        var unreadMessage = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id,
            "Unread");
        unreadMessage.Sender = _testData.Volunteer;
        _context.Messages.Add(unreadMessage);
        await _context.SaveChangesAsync();

        // Act
        var count = await _messageService.GetUnreadCountAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert - 1 from seed data + 1 we just added = 2 unread messages from volunteer
        count.Should().Be(2);
    }

    [Fact]
    public async Task GetUnreadCountAsync_ShouldExcludeOwnMessages()
    {
        // Act
        var count = await _messageService.GetUnreadCountAsync(
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id);

        // Assert - Should count only owner's message
        count.Should().Be(1);
    }

    [Fact]
    public async Task GetUnreadCountAsync_ShouldExcludeReadMessages()
    {
        // Arrange - Mark messages as read
        await _messageService.MarkAllAsReadAsync(_testData.PickupRequest.Id, _testData.Owner.Id);

        // Act
        var count = await _messageService.GetUnreadCountAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        count.Should().Be(0);
    }

    #endregion

    #region GetTotalUnreadCountAsync Tests

    [Fact]
    public async Task GetTotalUnreadCountAsync_ShouldReturnCorrectTotal()
    {
        // Arrange - Create another pickup request with messages
        var listing2 = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), _testData.Owner.Id, "Listing 2");
        _context.BottleListings.Add(listing2);

        var pickupRequest2 = TestHelpers.CreateMockPickupRequest(
            Guid.NewGuid(),
            listing2.Id,
            _testData.Volunteer.Id);
        pickupRequest2.Listing = listing2;
        _context.PickupRequests.Add(pickupRequest2);

        var message3 = TestHelpers.CreateMockMessage(
            Guid.NewGuid(),
            pickupRequest2.Id,
            _testData.Volunteer.Id,
            "Message in second conversation");
        message3.Sender = _testData.Volunteer;
        _context.Messages.Add(message3);
        await _context.SaveChangesAsync();

        // Act
        var count = await _messageService.GetTotalUnreadCountAsync(_testData.Owner.Id);

        // Assert - Should count unread from both pickup requests
        count.Should().Be(2); // 1 from first PR + 1 from second PR
    }

    [Fact]
    public async Task GetTotalUnreadCountAsync_ShouldExcludeOwnMessages()
    {
        // Act
        var count = await _messageService.GetTotalUnreadCountAsync(_testData.Volunteer.Id);

        // Assert - Should only count owner's message
        count.Should().Be(1);
    }

    [Fact]
    public async Task GetTotalUnreadCountAsync_WhenNoUnreadMessages_ShouldReturnZero()
    {
        // Arrange - Mark all as read
        await _messageService.MarkAllAsReadAsync(_testData.PickupRequest.Id, _testData.Owner.Id);

        // Act
        var count = await _messageService.GetTotalUnreadCountAsync(_testData.Owner.Id);

        // Assert
        count.Should().Be(0);
    }

    #endregion
}
