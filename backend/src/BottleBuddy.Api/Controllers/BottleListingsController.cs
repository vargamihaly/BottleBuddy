using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Core.Dtos;
using BottleBuddy.Core.Services;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BottleListingsController(
    IBottleListingService bottleListingService,
    ILogger<BottleListingsController> logger) : ControllerBase
{
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
        logger.LogInformation(
            "Fetching bottle listings for page {Page} with size {PageSize} and status {Status}",
            page,
            pageSize,
            status ?? "any");

        var (listings, metadata) = await bottleListingService.GetListingsAsync(page, pageSize, status);

        logger.LogInformation(
            "Retrieved {ListingCount} listings for page {Page}",
            listings.Count(),
            metadata.Page);

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
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Create listing attempted without authenticated user");
            return Unauthorized();
        }

        try
        {
            logger.LogInformation("Creating bottle listing for user {UserId}", userId);
            var listing = await bottleListingService.CreateListingAsync(userId, request);
            logger.LogInformation("Bottle listing {ListingId} created for user {UserId}", listing.Id, userId);
            return CreatedAtAction(nameof(GetListings), new { id = listing.Id }, listing);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized attempt to create listing for user {UserId}", userId);
            return Unauthorized(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Delete a bottle listing
    /// </summary>
    /// <param name="id">The ID of the listing to delete</param>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteListing(Guid id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Delete listing attempted without authenticated user");
            return Unauthorized();
        }

        try
        {
            logger.LogInformation("Deleting bottle listing {ListingId} for user {UserId}", id, userId);
            await bottleListingService.DeleteListingAsync(userId, id);
            logger.LogInformation("Bottle listing {ListingId} deleted for user {UserId}", id, userId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            logger.LogWarning(ex, "Bottle listing {ListingId} not found for user {UserId}", id, userId);
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "User {UserId} forbidden from deleting listing {ListingId}", userId, id);
            return Forbid();
        }
    }
}
