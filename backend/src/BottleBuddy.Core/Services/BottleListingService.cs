using BottleBuddy.Core.Dtos;
using BottleBuddy.Core.Enums;
using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Core.Services;

public class BottleListingService : IBottleListingService
{
    private readonly IBottleListingRepository _repository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<BottleListingService> _logger;

    public BottleListingService(
        IBottleListingRepository repository,
        UserManager<ApplicationUser> userManager,
        ILogger<BottleListingService> logger)
    {
        _repository = repository;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<(IEnumerable<BottleListingResponseDto> Listings, PaginationMetadata Metadata)> GetListingsAsync(
        int page,
        int pageSize,
        string? status)
    {
        _logger.LogInformation(
            "Listing retrieval requested for page {Page} with size {PageSize} and status {Status}",
            page,
            pageSize,
            status ?? "any");

        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1 || pageSize > 100)
        {
            pageSize = 50;
        }

        var query = _repository.Query().Include(l => l.User);

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ListingStatus>(status, true, out var statusEnum))
        {
            query = query.Where(l => l.Status == statusEnum);
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        var listings = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new BottleListingResponseDto
            {
                Id = l.Id,
                BottleCount = l.BottleCount,
                LocationAddress = l.LocationAddress,
                Title = l.Title,
                Description = l.Description,
                Latitude = l.Latitude,
                Longitude = l.Longitude,
                EstimatedRefund = l.EstimatedRefund,
                SplitPercentage = l.SplitPercentage,
                Status = l.Status.ToString().ToLower(),
                PickupDeadline = l.PickupDeadline,
                UserId = l.UserId,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt,
                CreatedByUserName = l.User != null ? l.User.UserName : null,
                CreatedByUserEmail = l.User != null ? l.User.Email : null
            })
            .ToListAsync();

        var metadata = new PaginationMetadata
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNext = page < totalPages,
            HasPrevious = page > 1
        };

        _logger.LogInformation(
            "Returning {ListingCount} listings for page {Page} of {TotalPages}",
            listings.Count,
            metadata.Page,
            metadata.TotalPages);

        return (listings, metadata);
    }

    public async Task<BottleListingResponseDto> CreateListingAsync(string userId, CreateBottleListingRequest request)
    {
        _logger.LogInformation(
            "Creating listing for user {UserId} with title {Title}",
            userId,
            request.Title ?? string.Empty);

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("User {UserId} not found while attempting to create listing", userId);
            throw new UnauthorizedAccessException("User not found.");
        }

        var listing = new BottleListing
        {
            Id = Guid.NewGuid(),
            BottleCount = request.BottleCount,
            LocationAddress = request.LocationAddress,
            Title = request.Title ?? string.Empty,
            Description = request.Description,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            EstimatedRefund = request.EstimatedRefund,
            PickupDeadline = request.PickupDeadline,
            SplitPercentage = request.SplitPercentage,
            Status = ListingStatus.Open,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(listing);
        await _repository.SaveChangesAsync();

        _logger.LogInformation(
            "Listing {ListingId} created for user {UserId}",
            listing.Id,
            userId);

        return new BottleListingResponseDto
        {
            Id = listing.Id,
            BottleCount = listing.BottleCount,
            LocationAddress = listing.LocationAddress,
            Title = listing.Title,
            Description = listing.Description,
            Latitude = listing.Latitude,
            Longitude = listing.Longitude,
            EstimatedRefund = listing.EstimatedRefund,
            SplitPercentage = listing.SplitPercentage,
            Status = listing.Status.ToString().ToLower(),
            PickupDeadline = listing.PickupDeadline,
            UserId = listing.UserId,
            CreatedAt = listing.CreatedAt,
            UpdatedAt = listing.UpdatedAt,
            CreatedByUserName = user.UserName,
            CreatedByUserEmail = user.Email
        };
    }

    public async Task DeleteListingAsync(string userId, Guid listingId)
    {
        _logger.LogInformation(
            "Deleting listing {ListingId} for user {UserId}",
            listingId,
            userId);

        var listing = await _repository.GetByIdAsync(listingId);

        if (listing == null)
        {
            _logger.LogWarning(
                "Listing {ListingId} not found while user {UserId} attempted delete",
                listingId,
                userId);
            throw new KeyNotFoundException($"Listing with ID {listingId} not found.");
        }

        if (listing.UserId != userId)
        {
            _logger.LogWarning(
                "User {UserId} attempted to delete listing {ListingId} owned by {OwnerId}",
                userId,
                listingId,
                listing.UserId);
            throw new UnauthorizedAccessException("You can only delete your own listings.");
        }

        _repository.Remove(listing);
        await _repository.SaveChangesAsync();

        _logger.LogInformation(
            "Listing {ListingId} deleted for user {UserId}",
            listingId,
            userId);
    }
}
