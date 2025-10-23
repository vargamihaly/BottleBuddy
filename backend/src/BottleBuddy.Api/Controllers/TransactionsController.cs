using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionsController(ITransactionService transactionService) : ControllerBase
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
            return Unauthorized(new { error = "User not authenticated" });
        }

        var transactions = await transactionService.GetMyTransactionsAsync(userId);
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
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            var transaction = await transactionService.GetTransactionByPickupRequestIdAsync(pickupRequestId, userId);
            if (transaction == null)
            {
                return NotFound(new { error = "Transaction not found" });
            }

            return Ok(transaction);
        }
        catch (UnauthorizedAccessException ex)
        {
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
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            var transaction = await transactionService.CreateTransactionAsync(dto.PickupRequestId, userId);
            return CreatedAtAction(
                nameof(GetTransactionByPickupRequest),
                new { pickupRequestId = dto.PickupRequestId },
                transaction
            );
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
}

public class CreateTransactionDto
{
    public Guid PickupRequestId { get; set; }
}
