using BottleBuddy.Application.Dtos;

namespace BottleBuddy.Application.Services;

public interface ITransactionService
{
    Task<TransactionResponseDto> CreateTransactionAsync(Guid pickupRequestId, string userId);
    Task<TransactionResponseDto?> GetTransactionByPickupRequestIdAsync(Guid pickupRequestId, string userId);
    Task<List<TransactionResponseDto>> GetTransactionsForUserAsync(string userId);
}
