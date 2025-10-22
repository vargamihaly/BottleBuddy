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
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;
    private readonly ILogger<TransactionsController> _logger;

    public TransactionsController(ITransactionService transactionService, ILogger<TransactionsController> logger)
    {
        _transactionService = transactionService;
        _logger = logger;
    }

    /// <summary>
    /// Get all transactions for the current user
    /// </summary>
    [HttpGet("my-transactions")]
    public async Task<ActionResult<List<TransactionResponseDto>>> GetMyTransactions()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Transaction retrieval attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        _logger.LogInformation("Retrieving transactions for user {UserId}", userId);
        var transactions = await _transactionService.GetMyTransactionsAsync(userId);
        _logger.LogInformation(
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
            _logger.LogWarning(
                "Pickup request transaction retrieval attempted without authenticated user for pickup request {PickupRequestId}",
                pickupRequestId);
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            _logger.LogInformation(
                "Retrieving transaction for pickup request {PickupRequestId} by user {UserId}",
                pickupRequestId,
                userId);
            var transaction = await _transactionService.GetTransactionByPickupRequestIdAsync(pickupRequestId, userId);
            if (transaction == null)
            {
                _logger.LogInformation(
                    "No transaction found for pickup request {PickupRequestId} by user {UserId}",
                    pickupRequestId,
                    userId);
                return NotFound(new { error = "Transaction not found" });
            }

            _logger.LogInformation(
                "Transaction {TransactionId} retrieved for pickup request {PickupRequestId} by user {UserId}",
                transaction.Id,
                pickupRequestId,
                userId);
            return Ok(transaction);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized transaction access attempt for pickup request {PickupRequestId}", pickupRequestId);
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
            _logger.LogWarning("Transaction creation attempted without authenticated user");
            return Unauthorized(new { error = "User not authenticated" });
        }

        try
        {
            _logger.LogInformation(
                "User {UserId} creating transaction for pickup request {PickupRequestId}",
                userId,
                dto.PickupRequestId);
            var transaction = await _transactionService.CreateTransactionAsync(dto.PickupRequestId, userId);
            _logger.LogInformation(
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
            _logger.LogWarning(ex, "Invalid operation creating transaction for pickup request {PickupRequestId}", dto.PickupRequestId);
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized transaction creation attempt for pickup request {PickupRequestId}", dto.PickupRequestId);
            return Forbid(ex.Message);
        }
    }
}

public class CreateTransactionDto
{
    public Guid PickupRequestId { get; set; }
}
