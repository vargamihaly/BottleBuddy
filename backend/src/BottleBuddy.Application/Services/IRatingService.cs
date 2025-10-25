using BottleBuddy.Application.Dtos;

namespace BottleBuddy.Application.Services;

public interface IRatingService
{
    Task<RatingResponseDto> CreateRatingAsync(CreateRatingDto dto, string raterId);
    Task<List<RatingResponseDto>> GetRatingsForUserAsync(string userId);
    Task<RatingResponseDto?> GetMyRatingForTransactionAsync(Guid transactionId, string raterId);
}
