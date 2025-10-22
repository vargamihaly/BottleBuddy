using BottleBuddy.Api.Dtos;

namespace BottleBuddy.Api.Services;

public interface ITransactionService
{
    Task<TransactionResponseDto> CreateTransactionAsync(Guid pickupRequestId, string userId);
    Task<TransactionResponseDto?> GetTransactionByPickupRequestIdAsync(Guid pickupRequestId, string userId);
    Task<List<TransactionResponseDto>> GetMyTransactionsAsync(string userId);
}
