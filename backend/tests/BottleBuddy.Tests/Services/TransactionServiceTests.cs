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
/// Comprehensive tests for TransactionService
/// </summary>
public class TransactionServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<ILogger<TransactionService>> _mockLogger;
    private readonly TransactionService _transactionService;
    private readonly TestHelpers.TestDataSet _testData;

    public TransactionServiceTests()
    {
        _context = TestHelpers.CreateInMemoryDbContext();
        _mockLogger = new Mock<ILogger<TransactionService>>();

        _transactionService = new TransactionService(_context, _mockLogger.Object);

        _testData = TestHelpers.SeedTestData(_context);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    #region CreateTransactionAsync Tests

    [Fact]
    public async Task CreateTransactionAsync_WithCompletedPickup_ShouldCreateTransaction()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        _testData.Listing.EstimatedRefund = 500m; // 50 HUF per bottle × 10 bottles
        _testData.Listing.SplitPercentage = 50m;
        await _context.SaveChangesAsync();

        // Act
        var result = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result.PickupRequestId.Should().Be(_testData.PickupRequest.Id);
        result.ListingId.Should().Be(_testData.Listing.Id);
        result.TotalRefund.Should().Be(500m);
        result.OwnerAmount.Should().Be(250m); // 50% of 500
        result.VolunteerAmount.Should().Be(250m); // 50% of 500
        result.Status.Should().Be(TransactionStatus.Completed);
        result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));

        var transactionInDb = await _context.Transactions
            .FirstOrDefaultAsync(t => t.PickupRequestId == _testData.PickupRequest.Id);
        transactionInDb.Should().NotBeNull();
        transactionInDb!.Status.Should().Be(TransactionStatus.Completed);
    }

    [Fact]
    public async Task CreateTransactionAsync_ShouldCalculateRefundAmountsCorrectly()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        _testData.Listing.BottleCount = 20;
        _testData.Listing.EstimatedRefund = 1000m; // 50 HUF per bottle × 20 bottles
        _testData.Listing.SplitPercentage = 60m; // 60% to owner, 40% to volunteer
        await _context.SaveChangesAsync();

        // Act
        var result = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        result.TotalRefund.Should().Be(1000m);
        result.OwnerAmount.Should().Be(600m); // 60% of 1000
        result.VolunteerAmount.Should().Be(400m); // 40% of 1000
    }

    [Fact]
    public async Task CreateTransactionAsync_ShouldSetAllRequiredFields()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        // Act
        var result = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id);

        // Assert
        result.Id.Should().NotBeEmpty();
        result.PickupRequestId.Should().Be(_testData.PickupRequest.Id);
        result.ListingId.Should().Be(_testData.Listing.Id);
        result.VolunteerName.Should().Be(_testData.Volunteer.UserName);
        result.OwnerName.Should().Be(_testData.Owner.UserName);
        result.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
        result.CompletedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
    }

    [Fact]
    public async Task CreateTransactionAsync_WithNotCompletedPickup_ShouldThrowInvalidOperationException()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Accepted;
        await _context.SaveChangesAsync();

        // Act
        Func<Task> act = async () => await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Pickup request must be completed before creating a transaction*");
    }

    [Fact]
    public async Task CreateTransactionAsync_WithExistingTransaction_ShouldReturnExistingTransaction()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        var firstTransaction = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Act
        var secondTransaction = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        secondTransaction.Id.Should().Be(firstTransaction.Id);

        var transactionsInDb = await _context.Transactions
            .Where(t => t.PickupRequestId == _testData.PickupRequest.Id)
            .ToListAsync();
        transactionsInDb.Should().HaveCount(1);
    }

    [Fact]
    public async Task CreateTransactionAsync_WithNonExistentPickupRequest_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var nonExistentPickupRequestId = Guid.NewGuid();

        // Act
        Func<Task> act = async () => await _transactionService.CreateTransactionAsync(
            nonExistentPickupRequestId,
            _testData.Owner.Id);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Pickup request not found*");
    }

    [Fact]
    public async Task CreateTransactionAsync_WhenUserNotInTransaction_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        var unauthorizedUserId = "unauthorized-user-id";

        // Act
        Func<Task> act = async () => await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            unauthorizedUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*You are not authorized to create a transaction for this pickup request*");
    }

    [Fact]
    public async Task CreateTransactionAsync_ShouldSetCreatedAtUtcToCurrentTime()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        var beforeCreation = DateTime.UtcNow;

        // Act
        var result = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        var afterCreation = DateTime.UtcNow;

        // Assert
        result.CreatedAt.Should().BeOnOrAfter(beforeCreation);
        result.CreatedAt.Should().BeOnOrBefore(afterCreation);
    }

    #endregion

    #region GetTransactionsForUserAsync Tests

    [Fact]
    public async Task GetTransactionsForUserAsync_ShouldReturnVolunteerTransactions()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id);

        // Act
        var result = await _transactionService.GetTransactionsForUserAsync(_testData.Volunteer.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
        result[0].VolunteerName.Should().Be(_testData.Volunteer.UserName);
    }

    [Fact]
    public async Task GetTransactionsForUserAsync_ShouldReturnOwnerTransactions()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Act
        var result = await _transactionService.GetTransactionsForUserAsync(_testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
        result[0].OwnerName.Should().Be(_testData.Owner.UserName);
    }

    [Fact]
    public async Task GetTransactionsForUserAsync_ShouldIncludeBothVolunteerAndOwnerTransactions()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Create another listing and transaction where owner is volunteer
        var newListing = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), _testData.Volunteer.Id, "New Listing");
        _context.BottleListings.Add(newListing);

        var newPickupRequest = TestHelpers.CreateMockPickupRequest(
            Guid.NewGuid(),
            newListing.Id,
            _testData.Owner.Id,
            PickupRequestStatus.Completed);
        newPickupRequest.Listing = newListing;
        _context.PickupRequests.Add(newPickupRequest);
        await _context.SaveChangesAsync();

        await _transactionService.CreateTransactionAsync(newPickupRequest.Id, _testData.Owner.Id);

        // Act
        var result = await _transactionService.GetTransactionsForUserAsync(_testData.Owner.Id);

        // Assert
        result.Should().HaveCount(2); // One as owner, one as volunteer
    }

    [Fact]
    public async Task GetTransactionsForUserAsync_ShouldOrderByCreatedAtUtcDescending()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        var transaction1 = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Create another transaction
        var newListing = TestHelpers.CreateMockBottleListing(Guid.NewGuid(), _testData.Owner.Id, "New Listing");
        _context.BottleListings.Add(newListing);

        var newPickupRequest = TestHelpers.CreateMockPickupRequest(
            Guid.NewGuid(),
            newListing.Id,
            _testData.Volunteer.Id,
            PickupRequestStatus.Completed);
        newPickupRequest.Listing = newListing;
        newPickupRequest.CreatedAtUtc = DateTime.UtcNow.AddMinutes(1);
        _context.PickupRequests.Add(newPickupRequest);
        await _context.SaveChangesAsync();

        var transaction2 = await _transactionService.CreateTransactionAsync(
            newPickupRequest.Id,
            _testData.Owner.Id);

        // Act
        var result = await _transactionService.GetTransactionsForUserAsync(_testData.Owner.Id);

        // Assert
        result.Should().HaveCount(2);
        result[0].CreatedAt.Should().BeOnOrAfter(result[1].CreatedAt);
    }

    [Fact]
    public async Task GetTransactionsForUserAsync_WithNoTransactions_ShouldReturnEmptyList()
    {
        // Arrange
        var newUser = TestHelpers.CreateMockUser("new-user-id", "newuser@test.com", "newuser");
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // Act
        var result = await _transactionService.GetTransactionsForUserAsync(newUser.Id);

        // Assert
        result.Should().BeEmpty();
    }

    #endregion

    #region GetTransactionByPickupRequestIdAsync Tests

    [Fact]
    public async Task GetTransactionByPickupRequestIdAsync_WithExistingTransaction_ShouldReturnTransaction()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        var createdTransaction = await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Act
        var result = await _transactionService.GetTransactionByPickupRequestIdAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(createdTransaction.Id);
        result.PickupRequestId.Should().Be(_testData.PickupRequest.Id);
    }

    [Fact]
    public async Task GetTransactionByPickupRequestIdAsync_AsVolunteer_ShouldReturnTransaction()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Act
        var result = await _transactionService.GetTransactionByPickupRequestIdAsync(
            _testData.PickupRequest.Id,
            _testData.Volunteer.Id);

        // Assert
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task GetTransactionByPickupRequestIdAsync_WithNoTransaction_ShouldReturnNull()
    {
        // Act
        var result = await _transactionService.GetTransactionByPickupRequestIdAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetTransactionByPickupRequestIdAsync_WhenUserNotParticipant_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        _testData.PickupRequest.Status = PickupRequestStatus.Completed;
        await _context.SaveChangesAsync();

        await _transactionService.CreateTransactionAsync(
            _testData.PickupRequest.Id,
            _testData.Owner.Id);

        var unauthorizedUserId = "unauthorized-user-id";

        // Act
        Func<Task> act = async () => await _transactionService.GetTransactionByPickupRequestIdAsync(
            _testData.PickupRequest.Id,
            unauthorizedUserId);

        // Assert
        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("*You are not authorized to view this transaction*");
    }

    #endregion
}
