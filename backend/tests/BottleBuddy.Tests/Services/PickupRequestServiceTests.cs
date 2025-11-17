//using BottleBuddy.Application.Data;
//using BottleBuddy.Application.Dtos;
//using BottleBuddy.Application.Enums;
//using BottleBuddy.Application.Models;
//using BottleBuddy.Application.Services;
//using BottleBuddy.Tests.Helpers;
//using FluentAssertions;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Logging;
//using Moq;
//using Xunit;

//namespace BottleBuddy.Tests.Services;

///// <summary>
///// Comprehensive tests for PickupRequestService
///// </summary>
//public class PickupRequestServiceTests : IDisposable
//{
//    private readonly ApplicationDbContext _context;
//    private readonly Mock<ILogger<PickupRequestService>> _mockLogger;
//    private readonly Mock<ITransactionService> _mockTransactionService;
//    private readonly PickupRequestService _pickupRequestService;
//    private readonly TestHelpers.TestDataSet _testData;

//    public PickupRequestServiceTests()
//    {
//        _context = TestHelpers.CreateInMemoryDbContext();
//        _mockLogger = new Mock<ILogger<PickupRequestService>>();
//        _mockTransactionService = new Mock<ITransactionService>();

//        _pickupRequestService = new PickupRequestService(
//            _context,
//            _mockTransactionService.Object,
//            _mockLogger.Object);

//        _testData = TestHelpers.SeedTestData(_context);
//    }

//    public void Dispose()
//    {
//        _context.Database.EnsureDeleted();
//        _context.Dispose();
//    }

//    #region CreatePickupRequestAsync Tests

//    [Fact]
//    public async Task CreatePickupRequestAsync_WithValidData_ShouldCreateRequest()
//    {
//        // Arrange
//        var newVolunteer = TestHelpers.CreateMockUser("new-volunteer-id", "newvolunteer@test.com", "newvolunteer");
//        _context.Users.Add(newVolunteer);
//        _context.Profiles.Add(newVolunteer.Profile!);
//        await _context.SaveChangesAsync();

//        var dto = new CreatePickupRequestDto
//        {
//            ListingId = _testData.Listing.Id,
//            Message = "I'd like to help pick up these bottles",
//            PickupTime = DateTime.UtcNow.AddDays(1)
//        };

//        // Act
//        var result = await _pickupRequestService.CreatePickupRequestAsync(dto, newVolunteer.Id);

//        // Assert
//        result.Should().NotBeNull();
//        result.ListingId.Should().Be(_testData.Listing.Id);
//        result.VolunteerId.Should().Be(newVolunteer.Id);
//        result.Message.Should().Be("I'd like to help pick up these bottles");
//        result.Status.Should().Be(PickupRequestStatus.Pending);
//        result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

//        var requestInDb = await _context.PickupRequests.FindAsync(result.Id);
//        requestInDb.Should().NotBeNull();
//        requestInDb!.Status.Should().Be(PickupRequestStatus.Pending);
//    }

//    [Fact]
//    public async Task CreatePickupRequestAsync_WithNonExistentListing_ShouldThrowInvalidOperationException()
//    {
//        // Arrange
//        var dto = new CreatePickupRequestDto
//        {
//            ListingId = Guid.NewGuid(),
//            Message = "Test message"
//        };

//        // Act
//        Func<Task> act = async () => await _pickupRequestService.CreatePickupRequestAsync(dto, _testData.Volunteer.Id);

//        // Assert
//        await act.Should().ThrowAsync<InvalidOperationException>()
//            .WithMessage("*Listing not found*");
//    }

//    [Fact]
//    public async Task CreatePickupRequestAsync_WithClosedListing_ShouldThrowInvalidOperationException()
//    {
//        // Arrange
//        _testData.Listing.Status = ListingStatus.Claimed;
//        await _context.SaveChangesAsync();

//        var dto = new CreatePickupRequestDto
//        {
//            ListingId = _testData.Listing.Id,
//            Message = "Test message"
//        };

//        var newVolunteer = TestHelpers.CreateMockUser("new-volunteer-id", "newvolunteer@test.com", "newvolunteer");
//        _context.Users.Add(newVolunteer);
//        await _context.SaveChangesAsync();

//        // Act
//        Func<Task> act = async () => await _pickupRequestService.CreatePickupRequestAsync(dto, newVolunteer.Id);

//        // Assert
//        await act.Should().ThrowAsync<InvalidOperationException>()
//            .WithMessage("*Listing is no longer available*");
//    }

//    [Fact]
//    public async Task CreatePickupRequestAsync_WhenUserIsOwner_ShouldThrowInvalidOperationException()
//    {
//        // Arrange
//        var dto = new CreatePickupRequestDto
//        {
//            ListingId = _testData.Listing.Id,
//            Message = "Test message"
//        };

//        // Act
//        Func<Task> act = async () => await _pickupRequestService.CreatePickupRequestAsync(dto, _testData.Owner.Id);

//        // Assert
//        await act.Should().ThrowAsync<InvalidOperationException>()
//            .WithMessage("*You cannot pick up your own listing*");
//    }

//    [Fact]
//    public async Task CreatePickupRequestAsync_WithDuplicateRequest_ShouldThrowInvalidOperationException()
//    {
//        // Arrange
//        var dto = new CreatePickupRequestDto
//        {
//            ListingId = _testData.Listing.Id,
//            Message = "Another request"
//        };

//        // _testData already has a pending pickup request from volunteer

//        // Act
//        Func<Task> act = async () => await _pickupRequestService.CreatePickupRequestAsync(dto, _testData.Volunteer.Id);

//        // Assert
//        await act.Should().ThrowAsync<InvalidOperationException>()
//            .WithMessage("*You already have an active pickup request for this listing*");
//    }

//    [Fact]
//    public async Task CreatePickupRequestAsync_ShouldSetInitialStatusToPending()
//    {
//        // Arrange
//        var newVolunteer = TestHelpers.CreateMockUser("new-volunteer-id", "newvolunteer@test.com", "newvolunteer");
//        _context.Users.Add(newVolunteer);
//        _context.Profiles.Add(newVolunteer.Profile!);
//        await _context.SaveChangesAsync();

//        var dto = new CreatePickupRequestDto
//        {
//            ListingId = _testData.Listing.Id,
//            Message = "Test"
//        };

//        // Act
//        var result = await _pickupRequestService.CreatePickupRequestAsync(dto, newVolunteer.Id);

//        // Assert
//        result.Status.Should().Be(PickupRequestStatus.Pending);
//    }

//    [Fact]
//    public async Task CreatePickupRequestAsync_ShouldSetVolunteerIdCorrectly()
//    {
//        // Arrange
//        var newVolunteer = TestHelpers.CreateMockUser("new-volunteer-id", "newvolunteer@test.com", "newvolunteer");
//        _context.Users.Add(newVolunteer);
//        _context.Profiles.Add(newVolunteer.Profile!);
//        await _context.SaveChangesAsync();

//        var dto = new CreatePickupRequestDto
//        {
//            ListingId = _testData.Listing.Id,
//            Message = "Test"
//        };

//        // Act
//        var result = await _pickupRequestService.CreatePickupRequestAsync(dto, newVolunteer.Id);

//        // Assert
//        result.VolunteerId.Should().Be(newVolunteer.Id);
//        result.VolunteerName.Should().Be(newVolunteer.UserName);
//    }

//    #endregion

//    #region GetPickupRequestsForListingAsync Tests

//    [Fact]
//    public async Task GetPickupRequestsForListingAsync_AsOwner_ShouldReturnAllRequests()
//    {
//        // Arrange
//        var newVolunteer = TestHelpers.CreateMockUser("new-volunteer-id", "newvolunteer@test.com", "newvolunteer");
//        _context.Users.Add(newVolunteer);
//        await _context.SaveChangesAsync();

//        var newRequest = TestHelpers.CreateMockPickupRequest(
//            Guid.NewGuid(),
//            _testData.Listing.Id,
//            newVolunteer.Id);
//        newRequest.Volunteer = newVolunteer;
//        _context.PickupRequests.Add(newRequest);
//        await _context.SaveChangesAsync();

//        // Act
//        var result = await _pickupRequestService.GetPickupRequestsForListingAsync(_testData.Listing.Id, _testData.Owner.Id);

//        // Assert
//        result.Should().NotBeNull();
//        result.Should().HaveCount(2); // Original + new one
//    }

//    [Fact]
//    public async Task GetPickupRequestsForListingAsync_AsNonOwner_ShouldThrowUnauthorizedAccessException()
//    {
//        // Arrange
//        var unauthorizedUserId = "unauthorized-user-id";

//        // Act
//        Func<Task> act = async () => await _pickupRequestService.GetPickupRequestsForListingAsync(
//            _testData.Listing.Id,
//            unauthorizedUserId);

//        // Assert
//        await act.Should().ThrowAsync<UnauthorizedAccessException>()
//            .WithMessage("*You do not have access to this listing*");
//    }

//    [Fact]
//    public async Task GetPickupRequestsForListingAsync_ShouldOrderByCreatedAtUtcDescending()
//    {
//        // Arrange
//        var newVolunteer = TestHelpers.CreateMockUser("new-volunteer-id", "newvolunteer@test.com", "newvolunteer");
//        _context.Users.Add(newVolunteer);
//        await _context.SaveChangesAsync();

//        var newRequest = TestHelpers.CreateMockPickupRequest(
//            Guid.NewGuid(),
//            _testData.Listing.Id,
//            newVolunteer.Id);
//        newRequest.Volunteer = newVolunteer;
//        newRequest.CreatedAtUtc = DateTime.UtcNow.AddMinutes(1);
//        _context.PickupRequests.Add(newRequest);
//        await _context.SaveChangesAsync();

//        // Act
//        var result = await _pickupRequestService.GetPickupRequestsForListingAsync(_testData.Listing.Id, _testData.Owner.Id);

//        // Assert
//        result.Should().HaveCount(2);
//        result[0].CreatedAt.Should().BeAfter(result[1].CreatedAt);
//    }

//    [Fact]
//    public async Task GetPickupRequestsForListingAsync_WithNoRequests_ShouldReturnEmptyList()
//    {
//        // Arrange
//        var newListing = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), _testData.Owner.Id, "New Listing");
//        _context.BottleListings.Add(newListing);
//        await _context.SaveChangesAsync();

//        // Act
//        var result = await _pickupRequestService.GetPickupRequestsForListingAsync(newListing.Id, _testData.Owner.Id);

//        // Assert
//        result.Should().BeEmpty();
//    }

//    #endregion

//    #region GetMyPickupRequestsAsync Tests

//    [Fact]
//    public async Task GetMyPickupRequestsAsync_ShouldReturnAllRequestsForVolunteer()
//    {
//        // Act
//        var result = await _pickupRequestService.GetMyPickupRequestsAsync(_testData.Volunteer.Id);

//        // Assert
//        result.Should().NotBeNull();
//        result.Should().HaveCount(1);
//        result[0].VolunteerId.Should().Be(_testData.Volunteer.Id);
//    }

//    [Fact]
//    public async Task GetMyPickupRequestsAsync_ShouldIncludeAllStatuses()
//    {
//        // Arrange
//        var newListing = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), _testData.Owner.Id, "Another Listing");
//        _context.BottleListings.Add(newListing);

//        var acceptedRequest = TestHelpers.CreateMockPickupRequest(
//            Guid.NewGuid(),
//            newListing.Id,
//            _testData.Volunteer.Id,
//            PickupRequestStatus.Accepted);
//        _context.PickupRequests.Add(acceptedRequest);
//        await _context.SaveChangesAsync();

//        // Act
//        var result = await _pickupRequestService.GetMyPickupRequestsAsync(_testData.Volunteer.Id);

//        // Assert
//        result.Should().HaveCount(2);
//        result.Should().Contain(r => r.Status == PickupRequestStatus.Pending);
//        result.Should().Contain(r => r.Status == PickupRequestStatus.Accepted);
//    }

//    [Fact]
//    public async Task GetMyPickupRequestsAsync_ShouldOrderByCreatedAtUtcDescending()
//    {
//        // Arrange
//        var newListing = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), _testData.Owner.Id, "Another Listing");
//        _context.BottleListings.Add(newListing);

//        var newerRequest = TestHelpers.CreateMockPickupRequest(
//            Guid.NewGuid(),
//            newListing.Id,
//            _testData.Volunteer.Id);
//        newerRequest.CreatedAtUtc = DateTime.UtcNow.AddMinutes(1);
//        _context.PickupRequests.Add(newerRequest);
//        await _context.SaveChangesAsync();

//        // Act
//        var result = await _pickupRequestService.GetMyPickupRequestsAsync(_testData.Volunteer.Id);

//        // Assert
//        result.Should().HaveCount(2);
//        result[0].CreatedAt.Should().BeAfter(result[1].CreatedAt);
//    }

//    #endregion

//    #region UpdatePickupRequestStatusAsync Tests

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_OwnerAcceptsRequest_ShouldUpdateStatus()
//    {
//        // Act
//        var result = await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "accepted",
//            _testData.Owner.Id);

//        // Assert
//        result.Should().NotBeNull();
//        result.Status.Should().Be(PickupRequestStatus.Accepted);
//        result.UpdatedAt.Should().NotBeNull();

//        var requestInDb = await _context.PickupRequests.FindAsync(_testData.PickupRequest.Id);
//        requestInDb!.Status.Should().Be(PickupRequestStatus.Accepted);
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_OwnerRejectsRequest_ShouldUpdateStatus()
//    {
//        // Act
//        var result = await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "rejected",
//            _testData.Owner.Id);

//        // Assert
//        result.Status.Should().Be(PickupRequestStatus.Rejected);
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_MarkAsCompleted_ShouldCreateTransaction()
//    {
//        // Arrange
//        _testData.PickupRequest.Status = PickupRequestStatus.Accepted;
//        await _context.SaveChangesAsync();

//        // Act
//        var result = await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "completed",
//            _testData.Owner.Id);

//        // Assert
//        result.Status.Should().Be(PickupRequestStatus.Completed);
//        _mockTransactionService.Verify(
//            x => x.CreateTransactionAsync(_testData.PickupRequest.Id, _testData.Owner.Id),
//            Times.Once);
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_WhenUnauthorized_ShouldThrowUnauthorizedAccessException()
//    {
//        // Arrange
//        var unauthorizedUserId = "unauthorized-user-id";

//        // Act
//        Func<Task> act = async () => await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "accepted",
//            unauthorizedUserId);

//        // Assert
//        await act.Should().ThrowAsync<UnauthorizedAccessException>()
//            .WithMessage("*You do not have permission to update this pickup request*");
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_VolunteerTriesToAccept_ShouldThrowUnauthorizedAccessException()
//    {
//        // Act
//        Func<Task> act = async () => await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "accepted",
//            _testData.Volunteer.Id);

//        // Assert
//        await act.Should().ThrowAsync<UnauthorizedAccessException>()
//            .WithMessage("*Only the listing owner can accept or reject pickup requests*");
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_WhenAccepting_ShouldUpdateListingToClaimed()
//    {
//        // Act
//        await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "accepted",
//            _testData.Owner.Id);

//        // Assert
//        var listingInDb = await _context.BottleListings.FindAsync(_testData.Listing.Id);
//        listingInDb!.Status.Should().Be(ListingStatus.Claimed);
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_WhenAccepting_ShouldRejectOtherPendingRequests()
//    {
//        // Arrange
//        var newVolunteer = TestHelpers.CreateMockUser("new-volunteer-id", "newvolunteer@test.com", "newvolunteer");
//        _context.Users.Add(newVolunteer);
//        await _context.SaveChangesAsync();

//        var otherRequest = TestHelpers.CreateMockPickupRequest(
//            Guid.NewGuid(),
//            _testData.Listing.Id,
//            newVolunteer.Id);
//        _context.PickupRequests.Add(otherRequest);
//        await _context.SaveChangesAsync();

//        // Act
//        await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "accepted",
//            _testData.Owner.Id);

//        // Assert
//        var otherRequestInDb = await _context.PickupRequests.FindAsync(otherRequest.Id);
//        otherRequestInDb!.Status.Should().Be(PickupRequestStatus.Rejected);
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_WhenCompleting_ShouldUpdateListingToCompleted()
//    {
//        // Arrange
//        _testData.PickupRequest.Status = PickupRequestStatus.Accepted;
//        await _context.SaveChangesAsync();

//        // Act
//        await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            _testData.PickupRequest.Id,
//            "completed",
//            _testData.Owner.Id);

//        // Assert
//        var listingInDb = await _context.BottleListings.FindAsync(_testData.Listing.Id);
//        listingInDb!.Status.Should().Be(ListingStatus.Completed);
//    }

//    [Fact]
//    public async Task UpdatePickupRequestStatusAsync_WithNonExistentRequest_ShouldThrowInvalidOperationException()
//    {
//        // Arrange
//        var nonExistentRequestId = Guid.NewGuid();

//        // Act
//        Func<Task> act = async () => await _pickupRequestService.UpdatePickupRequestStatusAsync(
//            nonExistentRequestId,
//            "accepted",
//            _testData.Owner.Id);

//        // Assert
//        await act.Should().ThrowAsync<InvalidOperationException>()
//            .WithMessage("*Pickup request not found*");
//    }

//    #endregion
//}
