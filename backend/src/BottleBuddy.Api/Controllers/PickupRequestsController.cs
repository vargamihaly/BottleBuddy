using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PickupRequestsController : ControllerBase
{
    private readonly PickupRequestService _pickupRequestService;

    public PickupRequestsController(PickupRequestService pickupRequestService)
    {
        _pickupRequestService = pickupRequestService;
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
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequest = await _pickupRequestService.CreatePickupRequestAsync(dto, userId);
            return CreatedAtAction(nameof(CreatePickupRequest), new { id = pickupRequest.Id }, pickupRequest);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
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
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequests = await _pickupRequestService.GetPickupRequestsForListingAsync(listingId, userId);
            return Ok(pickupRequests);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
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
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequests = await _pickupRequestService.GetMyPickupRequestsAsync(userId);
            return Ok(pickupRequests);
        }
        catch (Exception ex)
        {
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
                return Unauthorized(new { error = "User not authenticated" });
            }

            var pickupRequest = await _pickupRequestService.UpdatePickupRequestStatusAsync(id, dto.Status, userId);
            return Ok(pickupRequest);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while updating the pickup request", details = ex.Message });
        }
    }
}
