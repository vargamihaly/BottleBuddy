using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingsController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    /// <summary>
    /// Create a rating for a completed transaction
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<RatingResponseDto>> CreateRating([FromBody] CreateRatingDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            var rating = await _ratingService.CreateRatingAsync(dto, userId);
            return CreatedAtAction(
                nameof(GetMyRatingForTransaction),
                new { transactionId = dto.TransactionId },
                rating
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Get all ratings for a specific user
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<RatingResponseDto>>> GetRatingsForUser(string userId)
    {
        var ratings = await _ratingService.GetRatingsForUserAsync(userId);
        return Ok(ratings);
    }

    /// <summary>
    /// Get my rating for a specific transaction
    /// </summary>
    [HttpGet("transaction/{transactionId}")]
    public async Task<ActionResult<RatingResponseDto>> GetMyRatingForTransaction(Guid transactionId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { error = "User not authenticated" });
        }

        var rating = await _ratingService.GetMyRatingForTransactionAsync(transactionId, userId);
        if (rating == null)
        {
            return NotFound(new { error = "Rating not found" });
        }

        return Ok(rating);
    }
}
