using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingsController : ControllerBase
{
    private readonly IRatingService _ratingService;
    private readonly ILogger<RatingsController> _logger;

    public RatingsController(IRatingService ratingService, ILogger<RatingsController> logger)
    {
        _ratingService = ratingService;
        _logger = logger;
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
            _logger.LogWarning("Rating creation attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            _logger.LogInformation(
                "User {UserId} creating rating for transaction {TransactionId}",
                userId,
                dto.TransactionId);
            var rating = await _ratingService.CreateRatingAsync(dto, userId);
            _logger.LogInformation(
                "Rating {RatingId} created for transaction {TransactionId} by user {UserId}",
                rating.Id,
                dto.TransactionId,
                userId);
            return CreatedAtAction(
                nameof(GetMyRatingForTransaction),
                new { transactionId = dto.TransactionId },
                rating
            );
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error creating rating for transaction {TransactionId}", dto.TransactionId);
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation creating rating for transaction {TransactionId}", dto.TransactionId);
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized rating attempt for transaction {TransactionId}", dto.TransactionId);
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Get all ratings for a specific user
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<RatingResponseDto>>> GetRatingsForUser(string userId)
    {
        _logger.LogInformation("Retrieving ratings for user {RatedUserId}", userId);
        var ratings = await _ratingService.GetRatingsForUserAsync(userId);
        _logger.LogInformation(
            "Retrieved {RatingCount} ratings for user {RatedUserId}",
            ratings.Count,
            userId);
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
            _logger.LogWarning(
                "Attempt to retrieve rating for transaction {TransactionId} without authenticated user",
                transactionId);
            return Unauthorized(new { error = "User not authenticated" });
        }

        _logger.LogInformation(
            "Retrieving rating for transaction {TransactionId} by user {UserId}",
            transactionId,
            userId);
        var rating = await _ratingService.GetMyRatingForTransactionAsync(transactionId, userId);
        if (rating == null)
        {
            _logger.LogInformation(
                "No rating found for transaction {TransactionId} by user {UserId}",
                transactionId,
                userId);
            return NotFound(new { error = "Rating not found" });
        }

        _logger.LogInformation(
            "Rating {RatingId} retrieved for transaction {TransactionId} by user {UserId}",
            rating.Id,
            transactionId,
            userId);
        return Ok(rating);
    }
}
