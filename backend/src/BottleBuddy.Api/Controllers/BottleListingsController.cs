using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BottleListingsController(IBottleListingService bottleListingService) : ControllerBase
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
        var (listings, metadata) = await bottleListingService.GetListingsAsync(page, pageSize, status);

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
            return Unauthorized();
        }

        try
        {
            var listing = await bottleListingService.CreateListingAsync(userId, request);
            return CreatedAtAction(nameof(GetListings), new { id = listing.Id }, listing);
        }
        catch (UnauthorizedAccessException ex)
        {
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
            return Unauthorized();
        }

        try
        {
            await bottleListingService.DeleteListingAsync(userId, id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
    }
}
