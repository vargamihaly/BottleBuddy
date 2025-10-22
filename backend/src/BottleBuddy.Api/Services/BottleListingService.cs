using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;
using BottleBuddy.Api.Data;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;

namespace BottleBuddy.Api.Services;

public class BottleListingService(
    ApplicationDbContext context,
    UserManager<ApplicationUser> userManager,
    ActivitySource activitySource) : IBottleListingService
{
    private readonly ApplicationDbContext _context = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ActivitySource _activitySource = activitySource;

    public async Task<(IEnumerable<BottleListingResponseDto> Listings, PaginationMetadata Metadata)> GetListingsAsync(
        int page,
        int pageSize,
        string? status)
    {
        using var activity = _activitySource.StartActivity("BottleListingService.GetListingsAsync");
        activity?.SetTag("service.operation", "listings.query");

        // Validate pagination parameters
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 50;

        activity?.SetTag("query.page", page);
        activity?.SetTag("query.pageSize", pageSize);
        activity?.SetTag("query.statusFilter", status ?? "none");

        activity?.AddEvent(new ActivityEvent("Building query"));
        var query = _context.BottleListings.Include(l => l.User).AsQueryable();

        // Filter by status if provided
        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(l => l.Status == status);
            activity?.AddEvent(new ActivityEvent($"Applied status filter: {status}"));
        }

        activity?.AddEvent(new ActivityEvent("Counting total records"));
        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        activity?.SetTag("query.totalCount", totalCount);
        activity?.SetTag("query.totalPages", totalPages);

        activity?.AddEvent(new ActivityEvent("Fetching listings from database"));
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
                Status = l.Status,
                PickupDeadline = l.PickupDeadline,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt,
                CreatedByUserName = l.User != null ? l.User.UserName : null,
                CreatedByUserEmail = l.User != null ? l.User.Email : null
            })
            .ToListAsync();

        activity?.SetTag("query.returnedCount", listings.Count());
        activity?.AddEvent(new ActivityEvent($"Retrieved {listings.Count()} listings"));

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
        using var activity = _activitySource.StartActivity("BottleListingService.CreateListingAsync");
        activity?.SetTag("service.operation", "listing.create");
        activity?.SetTag("listing.userId", userId);

        activity?.AddEvent(new ActivityEvent("Validating user"));
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            activity?.AddEvent(new ActivityEvent("User not found"));
            activity?.SetStatus(ActivityStatusCode.Error, "User not found");
            throw new UnauthorizedAccessException("User not found.");
        }

        var listingId = Guid.NewGuid();
        activity?.SetTag("listing.id", listingId.ToString());
        activity?.SetTag("listing.bottleCount", request.BottleCount);
        activity?.SetTag("listing.location", request.LocationAddress);

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

        activity?.AddEvent(new ActivityEvent("Adding listing to database"));
        _context.BottleListings.Add(listing);

        activity?.AddEvent(new ActivityEvent("Saving changes to database"));
        await _context.SaveChangesAsync();

        activity?.AddEvent(new ActivityEvent("Listing created successfully"));

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
            Status = listing.Status,
            PickupDeadline = listing.PickupDeadline,
            CreatedAt = listing.CreatedAt,
            UpdatedAt = listing.UpdatedAt,
            CreatedByUserName = user.UserName,
            CreatedByUserEmail = user.Email
        };
    }
}
