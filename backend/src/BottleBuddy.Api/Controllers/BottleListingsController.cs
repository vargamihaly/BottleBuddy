using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Diagnostics;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BottleListingsController(IBottleListingService bottleListingService, ActivitySource activitySource) : ControllerBase
{
    private readonly IBottleListingService _bottleListingService = bottleListingService;
    private readonly ActivitySource _activitySource = activitySource;

    /// <summary>
    /// Get paginated list of bottle listings
    /// </summary>
    /// <param name="page">Page number (default: 1)</param>
    /// <param name="pageSize">Items per page (default: 50, max: 100)</param>
    /// <param name="status">Filter by status (optional)</param>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetListings(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? status = null)
    {
        using var activity = _activitySource.StartActivity("BottleListingsController.GetListings");
        activity?.SetTag("pagination.page", page);
        activity?.SetTag("pagination.pageSize", pageSize);
        activity?.SetTag("filter.status", status ?? "all");

        activity?.AddEvent(new ActivityEvent("Fetching bottle listings"));
        var (listings, metadata) = await _bottleListingService.GetListingsAsync(page, pageSize, status);

        activity?.SetTag("result.count", listings.Count());
        activity?.SetTag("result.totalCount", metadata.TotalCount);
        activity?.AddEvent(new ActivityEvent("Listings fetched successfully"));

        return Ok(new
        {
            data = listings,
            pagination = metadata
        });
    }

    /// <summary>
    /// Create a new bottle listing
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(BottleListingResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateListing([FromBody] CreateBottleListingRequest request)
    {
        using var activity = _activitySource.StartActivity("BottleListingsController.CreateListing");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            activity?.AddEvent(new ActivityEvent("Unauthorized - no user ID"));
            activity?.SetStatus(ActivityStatusCode.Error, "No user ID found");
            return Unauthorized();
        }

        activity?.SetTag("listing.userId", userId);
        activity?.SetTag("listing.bottleCount", request.BottleCount);
        activity?.SetTag("listing.estimatedRefund", request.EstimatedRefund.ToString());
        activity?.SetTag("listing.location", $"{request.Latitude},{request.Longitude}");

        try
        {
            activity?.AddEvent(new ActivityEvent("Creating new bottle listing"));
            var listing = await _bottleListingService.CreateListingAsync(userId, request);
            activity?.SetTag("listing.id", listing.Id);
            activity?.AddEvent(new ActivityEvent("Bottle listing created successfully"));
            return CreatedAtAction(nameof(GetListings), new { id = listing.Id }, listing);
        }
        catch (UnauthorizedAccessException ex)
        {
            activity?.AddEvent(new ActivityEvent("Listing creation failed - unauthorized"));
            activity?.SetTag("error.message", ex.Message);
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            return Unauthorized(new { error = ex.Message });
        }
    }
}
