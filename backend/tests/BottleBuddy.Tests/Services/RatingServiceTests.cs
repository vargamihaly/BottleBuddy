using BottleBuddy.Application.Data;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Enums;
using BottleBuddy.Application.Models;
using BottleBuddy.Application.Services;
using BottleBuddy.Tests.Helpers;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace BottleBuddy.Tests.Services;

/// <summary>
/// Comprehensive tests for RatingService
/// </summary>
public class RatingServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<ILogger<RatingService>> _mockLogger;
    private readonly RatingService _ratingService;
    private readonly TestHelpers.TestDataSet _testData;
    private Transaction _testTransaction = null!;

    public RatingServiceTests()
    {
        _context = TestHelpers.CreateInMemoryDbContext();
        _mockLogger = new Mock<ILogger<RatingService>>();

        _ratingService = new RatingService(_context, _mockLogger.Object);

        _testData = TestHelpers.SeedTestData(_context);
        SeedTransactionData();
    }

    private void SeedTransactionData()
    {
        // Create a completed transaction for testing
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;

        _testTransaction = new Transaction
        {
            Id = Guid.NewGuid(),
            ListingId = _testData.Listing.Id,
            PickupRequestId = _testData.PickupRequest.Id,
            VolunteerAmount = 250m,
            OwnerAmount = 250m,
            TotalRefund = 500m,
            Status = TransactionStatus.Completed,
            CreatedAtUtc = DateTime.UtcNow,
            CompletedAtUtc = DateTime.UtcNow,
            Listing = _testData.Listing,
            PickupRequest = _testData.PickupRequest
        };

        _context.Transactions.Add(_testTransaction);
        _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    #region CreateRatingAsync Tests

    [Fact]
    public async Task CreateRatingAsync_WithValidData_ShouldCreateRating()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5,
            Comment = "Great volunteer!"
        };

        // Act
        var result = await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result.TransactionId.Should().Be(_testTransaction.Id);
        result.RaterId.Should().Be(_testData.Owner.Id);
        result.RatedUserId.Should().Be(_testData.Volunteer.Id);
        result.Value.Should().Be(5);
        result.Comment.Should().Be("Great volunteer!");
        result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

        var ratingInDb = await _context.Ratings.FindAsync(result.Id);
        ratingInDb.Should().NotBeNull();
        ratingInDb!.Value.Should().Be(5);
    }

    [Fact]
    public async Task CreateRatingAsync_WithoutComment_ShouldCreateRating()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 4
        };

        // Act
        var result = await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result.Value.Should().Be(4);
        result.Comment.Should().BeNullOrEmpty();
    }

    [Fact]
    public async Task CreateRatingAsync_WithStarsLessThanOne_ShouldThrowArgumentException()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 0
        };

        // Act
        Func<Task> act = async () => await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Rating value must be between 1 and 5*");
    }

    [Fact]
    public async Task CreateRatingAsync_WithStarsGreaterThanFive_ShouldThrowArgumentException()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 6
        };

        // Act
        Func<Task> act = async () => await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Rating value must be between 1 and 5*");
    }

    [Fact]
    public async Task CreateRatingAsync_WithNonExistentTransaction_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = Guid.NewGuid(),
            Value = 5
        };

        // Act
        Func<Task> act = async () => await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Transaction not found*");
    }

    [Fact]
    public async Task CreateRatingAsync_WhenUserNotInTransaction_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5
        };

        var unauthorizedUserId = "unauthorized-user-id";

        // Act
        Func<Task> act = async () => await _ratingService.CreateRatingAsync(dto, unauthorizedUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*You can only rate transactions you were part of*");
    }

    [Fact]
    public async Task CreateRatingAsync_WithDuplicateRating_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5
        };

        await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Act - Try to create another rating
        Func<Task> act = async () => await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*You have already rated this transaction*");
    }

    [Fact]
    public async Task CreateRatingAsync_ShouldSetCreatedAt()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5,
            Comment = "Great work!"
        };

        // Act
        var result = await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        result.Value.Should().Be(5);
        result.Comment.Should().Be("Great work!");
    }

    [Fact]
    public async Task CreateRatingAsync_WithMultipleRatings_ShouldCreateBothRatings()
    {
        // Arrange - Create first rating
        var dto1 = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5
        };
        var rating1 = await _ratingService.CreateRatingAsync(dto1, _testData.Owner.Id);

        // Create another transaction and rating
        var newListing = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), "another-owner-id", "New Listing");
        newListing.Owner = TestHelpers.CreateMockUser("another-owner-id", "anotherowner@test.com", "anotherowner");
        _context.Users.Add(newListing.Owner);
        _context.BottleListings.Add(newListing);

        var newPickupRequest = TestHelpers.CreateMockPickupRequest(
            Guid.NewGuid(),
            newListing.Id,
            _testData.Volunteer.Id,
            PickupRequestStatus.Completed);
        newPickupRequest.Listing = newListing;
        _context.PickupRequests.Add(newPickupRequest);

        var newTransaction = new Transaction
        {
            Id = Guid.NewGuid(),
            ListingId = newListing.Id,
            PickupRequestId = newPickupRequest.Id,
            VolunteerAmount = 250m,
            OwnerAmount = 250m,
            TotalRefund = 500m,
            Status = TransactionStatus.Completed,
            CreatedAtUtc = DateTime.UtcNow,
            CompletedAtUtc = DateTime.UtcNow,
            Listing = newListing,
            PickupRequest = newPickupRequest
        };
        _context.Transactions.Add(newTransaction);
        await _context.SaveChangesAsync();

        var dto2 = new CreateRatingDto
        {
            TransactionId = newTransaction.Id,
            Value = 3
        };

        // Act
        var rating2 = await _ratingService.CreateRatingAsync(dto2, newListing.Owner.Id);

        // Assert
        rating1.Value.Should().Be(5);
        rating2.Value.Should().Be(3);
        rating1.RatedUserId.Should().Be(_testData.Volunteer.Id);
        rating2.RatedUserId.Should().Be(_testData.Volunteer.Id);

        // Verify both ratings exist in database
        var ratingsInDb = await _context.Ratings
            .Where(r => r.RatedUserId == _testData.Volunteer.Id)
            .ToListAsync();
        ratingsInDb.Should().HaveCount(2);
    }

    [Fact]
    public async Task CreateRatingAsync_ShouldSetCreatedAtUtcCorrectly()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5
        };

        var beforeCreation = DateTime.UtcNow;

        // Act
        var result = await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        var afterCreation = DateTime.UtcNow;

        // Assert
        result.CreatedAt.Should().BeOnOrAfter(beforeCreation);
        result.CreatedAt.Should().BeOnOrBefore(afterCreation);
    }

    [Fact]
    public async Task CreateRatingAsync_AsVolunteer_ShouldRateOwner()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 4,
            Comment = "Good owner!"
        };

        // Act
        var result = await _ratingService.CreateRatingAsync(dto, _testData.Volunteer.Id);

        // Assert
        result.RaterId.Should().Be(_testData.Volunteer.Id);
        result.RatedUserId.Should().Be(_testData.Owner.Id);
        result.Value.Should().Be(4);
        result.Comment.Should().Be("Good owner!");

        // Verify rating exists in database
        var ratingInDb = await _context.Ratings.FindAsync(result.Id);
        ratingInDb.Should().NotBeNull();
        ratingInDb!.RatedUserId.Should().Be(_testData.Owner.Id);
    }

    #endregion

    #region GetRatingsForUserAsync Tests

    [Fact]
    public async Task GetRatingsForUserAsync_ShouldReturnAllRatingsReceivedByUser()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5,
            Comment = "Excellent!"
        };
        await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Act
        var result = await _ratingService.GetRatingsForUserAsync(_testData.Volunteer.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
        result[0].RatedUserId.Should().Be(_testData.Volunteer.Id);
        result[0].RaterId.Should().Be(_testData.Owner.Id);
    }

    [Fact]
    public async Task GetRatingsForUserAsync_ShouldOrderByCreatedAtUtcDescending()
    {
        // Arrange - Create first rating
        var dto1 = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5
        };
        var rating1 = await _ratingService.CreateRatingAsync(dto1, _testData.Owner.Id);

        // Create another transaction and rating with later timestamp
        var newListing = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), "another-owner-id", "New Listing");
        newListing.Owner = TestHelpers.CreateMockUser("another-owner-id", "anotherowner@test.com", "anotherowner");
        _context.Users.Add(newListing.Owner);
        _context.BottleListings.Add(newListing);

        var newPickupRequest = TestHelpers.CreateMockPickupRequest(
            Guid.NewGuid(),
            newListing.Id,
            _testData.Volunteer.Id,
            PickupRequestStatus.Completed);
        newPickupRequest.Listing = newListing;
        _context.PickupRequests.Add(newPickupRequest);

        var newTransaction = new Transaction
        {
            Id = Guid.NewGuid(),
            ListingId = newListing.Id,
            PickupRequestId = newPickupRequest.Id,
            VolunteerAmount = 250m,
            OwnerAmount = 250m,
            TotalRefund = 500m,
            Status = TransactionStatus.Completed,
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(1),
            CompletedAtUtc = DateTime.UtcNow.AddMinutes(1),
            Listing = newListing,
            PickupRequest = newPickupRequest
        };
        _context.Transactions.Add(newTransaction);
        await _context.SaveChangesAsync();

        // Add small delay to ensure different timestamps
        await Task.Delay(10);

        var dto2 = new CreateRatingDto
        {
            TransactionId = newTransaction.Id,
            Value = 4
        };
        var rating2 = await _ratingService.CreateRatingAsync(dto2, newListing.Owner.Id);

        // Act
        var result = await _ratingService.GetRatingsForUserAsync(_testData.Volunteer.Id);

        // Assert
        result.Should().HaveCount(2);
        result[0].CreatedAt.Should().BeOnOrAfter(result[1].CreatedAt);
    }

    [Fact]
    public async Task GetRatingsForUserAsync_WithNoRatings_ShouldReturnEmptyList()
    {
        // Arrange
        var newUser = TestHelpers.CreateMockUser("new-user-id", "newuser@test.com", "newuser");
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // Act
        var result = await _ratingService.GetRatingsForUserAsync(newUser.Id);

        // Assert
        result.Should().BeEmpty();
    }

    #endregion

    #region GetMyRatingForTransactionAsync Tests

    [Fact]
    public async Task GetMyRatingForTransactionAsync_WithExistingRating_ShouldReturnRating()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 5,
            Comment = "Great!"
        };
        var createdRating = await _ratingService.CreateRatingAsync(dto, _testData.Owner.Id);

        // Act
        var result = await _ratingService.GetMyRatingForTransactionAsync(
            _testTransaction.Id,
            _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(createdRating.Id);
        result.TransactionId.Should().Be(_testTransaction.Id);
        result.RaterId.Should().Be(_testData.Owner.Id);
    }

    [Fact]
    public async Task GetMyRatingForTransactionAsync_WithNoRating_ShouldReturnNull()
    {
        // Act
        var result = await _ratingService.GetMyRatingForTransactionAsync(
            _testTransaction.Id,
            _testData.Owner.Id);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetMyRatingForTransactionAsync_AsVolunteer_ShouldReturnVolunteerRating()
    {
        // Arrange
        var dto = new CreateRatingDto
        {
            TransactionId = _testTransaction.Id,
            Value = 4
        };
        await _ratingService.CreateRatingAsync(dto, _testData.Volunteer.Id);

        // Act
        var result = await _ratingService.GetMyRatingForTransactionAsync(
            _testTransaction.Id,
            _testData.Volunteer.Id);

        // Assert
        result.Should().NotBeNull();
        result!.RaterId.Should().Be(_testData.Volunteer.Id);
        result.RatedUserId.Should().Be(_testData.Owner.Id);
    }

    #endregion
}
