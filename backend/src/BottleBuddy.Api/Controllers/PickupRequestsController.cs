using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PickupRequestsController : ControllerBase
{
    private readonly PickupRequestService _pickupRequestService;
    private readonly ILogger<PickupRequestsController> _logger;

    public PickupRequestsController(PickupRequestService pickupRequestService, ILogger<PickupRequestsController> logger)
    {
        _pickupRequestService = pickupRequestService;
        _logger = logger;
    }

    // POST: api/pickuprequests
    [HttpPost]
    public async Task<ActionResult<PickupRequestResponseDto>> CreatePickupRequest([FromBody] CreatePickupRequestDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("Pickup request creation attempted without authenticated user");
                return Unauthorized(new { error = "User not authenticated" });
            }

            _logger.LogInformation(
                "Creating pickup request for listing {ListingId} by volunteer {VolunteerId}",
                dto.ListingId,
                userId);
            var pickupRequest = await _pickupRequestService.CreatePickupRequestAsync(dto, userId);
            _logger.LogInformation(
                "Pickup request {PickupRequestId} created for listing {ListingId} by volunteer {VolunteerId}",
                pickupRequest.Id,
                dto.ListingId,
                userId);
            return CreatedAtAction(nameof(CreatePickupRequest), new { id = pickupRequest.Id }, pickupRequest);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Validation failed while creating pickup request for listing {ListingId}", dto.ListingId);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error while creating pickup request for listing {ListingId}", dto.ListingId);
            return StatusCode(500, new { error = "An error occurred while creating the pickup request", details = ex.Message });
        }
    }

    // GET: api/pickuprequests/listing/{listingId}
    [HttpGet("listing/{listingId}")]
    public async Task<ActionResult<List<PickupRequestResponseDto>>> GetPickupRequestsForListing(Guid listingId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning(
                    "Listing pickup requests retrieval attempted without authenticated user for listing {ListingId}",
                    listingId);
                return Unauthorized(new { error = "User not authenticated" });
            }

            _logger.LogInformation(
                "Retrieving pickup requests for listing {ListingId} by user {UserId}",
                listingId,
                userId);
            var pickupRequests = await _pickupRequestService.GetPickupRequestsForListingAsync(listingId, userId);
            _logger.LogInformation(
                "Retrieved {PickupRequestCount} pickup requests for listing {ListingId} by user {UserId}",
                pickupRequests.Count,
                listingId,
                userId);
            return Ok(pickupRequests);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access retrieving pickup requests for listing {ListingId}", listingId);
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error retrieving pickup requests for listing {ListingId}", listingId);
            return StatusCode(500, new { error = "An error occurred while retrieving pickup requests", details = ex.Message });
        }
    }

    // GET: api/pickuprequests/my-requests
    [HttpGet("my-requests")]
    public async Task<ActionResult<List<PickupRequestResponseDto>>> GetMyPickupRequests()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("Pickup requests retrieval attempted without authenticated user");
                return Unauthorized(new { error = "User not authenticated" });
            }

            _logger.LogInformation(
                "Retrieving pickup requests for volunteer {VolunteerId}",
                userId);
            var pickupRequests = await _pickupRequestService.GetMyPickupRequestsAsync(userId);
            _logger.LogInformation(
                "Retrieved {PickupRequestCount} pickup requests for volunteer {VolunteerId}",
                pickupRequests.Count,
                userId);
            return Ok(pickupRequests);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error retrieving pickup requests for volunteer {VolunteerId}", User.FindFirstValue(ClaimTypes.NameIdentifier));
            return StatusCode(500, new { error = "An error occurred while retrieving your pickup requests", details = ex.Message });
        }
    }

    // PATCH: api/pickuprequests/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<PickupRequestResponseDto>> UpdatePickupRequestStatus(
        Guid id,
        [FromBody] UpdatePickupRequestStatusDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning(
                    "Pickup request status update attempted without authenticated user for request {PickupRequestId}",
                    id);
                return Unauthorized(new { error = "User not authenticated" });
            }

            _logger.LogInformation(
                "Updating pickup request {PickupRequestId} to status {Status} by user {UserId}",
                id,
                dto.Status,
                userId);
            var pickupRequest = await _pickupRequestService.UpdatePickupRequestStatusAsync(id, dto.Status, userId);
            _logger.LogInformation(
                "Pickup request {PickupRequestId} updated to status {Status} by user {UserId}",
                id,
                pickupRequest.Status,
                userId);
            return Ok(pickupRequest);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid state transition for pickup request {PickupRequestId}", id);
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized status update attempt for pickup request {PickupRequestId}", id);
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error updating pickup request {PickupRequestId}", id);
            return StatusCode(500, new { error = "An error occurred while updating the pickup request", details = ex.Message });
        }
    }
}
