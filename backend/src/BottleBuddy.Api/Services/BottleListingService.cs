using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;
using BottleBuddy.Api.Data;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;

namespace BottleBuddy.Api.Services;

public class BottleListingService(
    ApplicationDbContext context,
    UserManager<ApplicationUser> userManager) : IBottleListingService
{
    public async Task<(IEnumerable<BottleListingResponseDto> Listings, PaginationMetadata Metadata)> GetListingsAsync(
        int page,
        int pageSize,
        string? status)
    {
        // Validate pagination parameters
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 50;

        var query = context.BottleListings.Include(l => l.User).AsQueryable();

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(l => l.Status == status);
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
                Status = l.Status,
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

        return (listings, metadata);
    }

    public async Task<BottleListingResponseDto> CreateListingAsync(string userId, CreateBottleListingRequest request)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
        {
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
            Status = "open",
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        context.BottleListings.Add(listing);

        await context.SaveChangesAsync();

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
            Status = listing.Status,
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
        var listing = await context.BottleListings.FindAsync(listingId);

        if (listing == null)
        {
            throw new KeyNotFoundException($"Listing with ID {listingId} not found.");
        }

        // Verify that the user owns this listing
        if (listing.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can only delete your own listings.");
        }

        context.BottleListings.Remove(listing);

        await context.SaveChangesAsync();
    }
}
