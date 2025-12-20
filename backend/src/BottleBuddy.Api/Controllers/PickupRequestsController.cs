using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Services;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PickupRequestsController(
    PickupRequestService pickupRequestService,
    ILogger<PickupRequestsController> logger,
    IWebHostEnvironment environment)
    : ControllerBase
{
    // POST: api/pickuprequests
    [HttpPost]
    public async Task<ActionResult<PickupRequestResponseDto>> CreatePickupRequest([FromBody] CreatePickupRequestDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                logger.LogWarning("Pickup request creation attempted without authenticated user");
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequest = await pickupRequestService.CreatePickupRequestAsync(dto, userId);

            return CreatedAtAction(nameof(CreatePickupRequest), new { id = pickupRequest.Id }, pickupRequest);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Validation failed while creating pickup request for listing {ListingId}", dto.ListingId);
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error while creating pickup request for listing {ListingId}", dto.ListingId);

            var errorResponse = new { error = "An error occurred while creating the pickup request" };
            return environment.IsDevelopment() ? 
                StatusCode(500, new { errorResponse.error, details = ex.Message }) : 
                StatusCode(500, errorResponse);
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
                logger.LogWarning("Listing pickup requests retrieval attempted without authenticated user for listing {ListingId}", listingId);
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequests = await pickupRequestService.GetPickupRequestsForListingAsync(listingId, userId);

            return Ok(pickupRequests);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized access retrieving pickup requests for listing {ListingId}", listingId);

            return StatusCode(403, new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error retrieving pickup requests for listing {ListingId}", listingId);

            // SECURITY: Only return detailed error information in development
            var errorResponse = new { error = "An error occurred while retrieving pickup requests" };
            if (environment.IsDevelopment())
            {
                return StatusCode(500, new { errorResponse.error, details = ex.Message });
            }
            return StatusCode(500, errorResponse);
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
                logger.LogWarning("Pickup requests retrieval attempted without authenticated user");
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequests = await pickupRequestService.GetMyPickupRequestsAsync(userId);

            return Ok(pickupRequests);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error retrieving pickup requests for volunteer {VolunteerId}", User.FindFirstValue(ClaimTypes.NameIdentifier));

            // SECURITY: Only return detailed error information in development
            var errorResponse = new { error = "An error occurred while retrieving your pickup requests" };
            if (environment.IsDevelopment())
            {
                return StatusCode(500, new { errorResponse.error, details = ex.Message });
            }
            return StatusCode(500, errorResponse);
        }
    }

    // PATCH: api/pickuprequests/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<PickupRequestResponseDto>> UpdatePickupRequestStatus(Guid id, [FromBody] UpdatePickupRequestStatusDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                logger.LogWarning("Pickup request status update attempted without authenticated user for request {PickupRequestId}", id);
                
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequest = await pickupRequestService.UpdatePickupRequestStatusAsync(id, dto.Status, userId);

            return Ok(pickupRequest);
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid state transition for pickup request {PickupRequestId}", id);
            
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized status update attempt for pickup request {PickupRequestId}", id);

            return StatusCode(403, new { error = ex.Message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unexpected error updating pickup request {PickupRequestId}", id);

            var errorResponse = new { error = "An error occurred while updating the pickup request" };
            return environment.IsDevelopment() ? 
                StatusCode(500, new { errorResponse.error, details = ex.Message }) : 
                StatusCode(500, errorResponse);
        }
    }
}