using BottleBuddy.Application.Data;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Enums;
using BottleBuddy.Application.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Application.Services;

public class BottleListingService(
    ApplicationDbContext context,
    UserManager<User> userManager,
    ILogger<BottleListingService> logger) : IBottleListingService
{
    public async Task<(IEnumerable<BottleListingResponseDto> Listings, PaginationMetadata Metadata)> GetListingsAsync(
        int page,
        int pageSize,
        string? status)
    {
        logger.LogInformation(
            "Listing retrieval requested for page {Page} with size {PageSize} and status {Status}",
            page,
            pageSize,
            status ?? "any");

        // Validate pagination parameters
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 50;

        var query = context.BottleListings.Include(l => l.Owner).AsQueryable();

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status))
        {
            // Parse status string to enum
            if (Enum.TryParse<ListingStatus>(status, true, out var statusEnum))
            {
                query = query.Where(l => l.Status == statusEnum);
            }
        }

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
     
        var listings = await query
            .OrderByDescending(l => l.CreatedAtUtc)
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
                UserId = l.OwnerId,
                CreatedAt = l.CreatedAtUtc,
                UpdatedAt = l.UpdatedAtUtc,
                CreatedByUserName = l.Owner != null ? l.Owner.UserName : null,
                CreatedByUserEmail = l.Owner != null ? l.Owner.Email : null
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

        logger.LogInformation(
            "Returning {ListingCount} listings for page {Page} of {TotalPages}",
            listings.Count,
            metadata.Page,
            metadata.TotalPages);

        return (listings, metadata);
    }

    public async Task<BottleListingResponseDto> CreateListingAsync(string userId, CreateBottleListingRequest request)
    {
        logger.LogInformation(
            "Creating listing for user {UserId} with title {Title}",
            userId,
            request.Title ?? string.Empty);

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
            logger.LogWarning("User {UserId} not found while attempting to create listing", userId);
            throw new UnauthorizedAccessException("User not found.");
        }

        var listingId = Guid.NewGuid();

        var listing = new BottleListing
        {
            Id = listingId,
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
            OwnerId = userId,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.BottleListings.Add(listing);

        await context.SaveChangesAsync();

        logger.LogInformation(
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
            UserId = listing.OwnerId,
            CreatedAt = listing.CreatedAtUtc,
            UpdatedAt = listing.UpdatedAtUtc,
            CreatedByUserName = user.UserName,
            CreatedByUserEmail = user.Email
        };
    }

    public async Task DeleteListingAsync(string userId, Guid listingId)
    {
        logger.LogInformation(
            "Deleting listing {ListingId} for user {UserId}",
            listingId,
            userId);

        var listing = await context.BottleListings.FindAsync(listingId);

        if (listing == null)
        {
            logger.LogWarning(
                "Listing {ListingId} not found while user {UserId} attempted delete",
                listingId,
                userId);
            throw new KeyNotFoundException($"Listing with ID {listingId} not found.");
        }

        // Verify that the user owns this listing
        if (listing.OwnerId != userId)
        {
            logger.LogWarning(
                "User {UserId} attempted to delete listing {ListingId} owned by {OwnerId}",
                userId,
                listingId,
                listing.OwnerId);
            throw new UnauthorizedAccessException("You can only delete your own listings.");
        }

        context.BottleListings.Remove(listing);

        await context.SaveChangesAsync();

        logger.LogInformation(
            "Listing {ListingId} deleted for user {UserId}",
            listingId,
            userId);
    }
}
