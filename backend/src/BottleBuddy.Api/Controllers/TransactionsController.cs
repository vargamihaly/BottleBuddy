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
public class TransactionsController(ITransactionService transactionService, ILogger<TransactionsController> logger) : ControllerBase
{

    /// <summary>
    /// Get all transactions for the current user
    /// </summary>
    [HttpGet("my-transactions")]
    public async Task<ActionResult<List<TransactionResponseDto>>> GetMyTransactions()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Transaction retrieval attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        logger.LogInformation("Retrieving transactions for user {UserId}", userId);
        var transactions = await transactionService.GetMyTransactionsAsync(userId);
        logger.LogInformation(
            "Retrieved {TransactionCount} transactions for user {UserId}",
            transactions.Count,
            userId);
        return Ok(transactions);
    }

    /// <summary>
    /// Get transaction by pickup request ID
    /// </summary>
    [HttpGet("pickup-request/{pickupRequestId}")]
    public async Task<ActionResult<TransactionResponseDto>> GetTransactionByPickupRequest(Guid pickupRequestId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning(
                "Pickup request transaction retrieval attempted without authenticated user for pickup request {PickupRequestId}",
                pickupRequestId);
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            logger.LogInformation(
                "Retrieving transaction for pickup request {PickupRequestId} by user {UserId}",
                pickupRequestId,
                userId);
            var transaction = await transactionService.GetTransactionByPickupRequestIdAsync(pickupRequestId, userId);
            if (transaction == null)
            {
                logger.LogInformation(
                    "No transaction found for pickup request {PickupRequestId} by user {UserId}",
                    pickupRequestId,
                    userId);
                return NotFound(new { error = "Transaction not found" });
            }

            logger.LogInformation(
                "Transaction {TransactionId} retrieved for pickup request {PickupRequestId} by user {UserId}",
                transaction.Id,
                pickupRequestId,
                userId);
            return Ok(transaction);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized transaction access attempt for pickup request {PickupRequestId}", pickupRequestId);
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Create a transaction (automatically called when pickup is completed)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> CreateTransaction([FromBody] CreateTransactionDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Transaction creation attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            logger.LogInformation(
                "User {UserId} creating transaction for pickup request {PickupRequestId}",
                userId,
                dto.PickupRequestId);
            var transaction = await transactionService.CreateTransactionAsync(dto.PickupRequestId, userId);
            logger.LogInformation(
                "Transaction {TransactionId} created for pickup request {PickupRequestId} by user {UserId}",
                transaction.Id,
                dto.PickupRequestId,
                userId);
            return CreatedAtAction(
                nameof(GetTransactionByPickupRequest),
                new { pickupRequestId = dto.PickupRequestId },
                transaction
            );
        }
        catch (InvalidOperationException ex)
        {
            logger.LogWarning(ex, "Invalid operation creating transaction for pickup request {PickupRequestId}", dto.PickupRequestId);
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogWarning(ex, "Unauthorized transaction creation attempt for pickup request {PickupRequestId}", dto.PickupRequestId);
            return Forbid(ex.Message);
        }
    }
}

public class CreateTransactionDto
{
    public Guid PickupRequestId { get; set; }
}
