using BottleBuddy.Api.Dtos;

namespace BottleBuddy.Api.Services;

public interface IRatingService
{
    Task<RatingResponseDto> CreateRatingAsync(CreateRatingDto dto, string raterId);
    Task<List<RatingResponseDto>> GetRatingsForUserAsync(string userId);
    Task<RatingResponseDto?> GetMyRatingForTransactionAsync(Guid transactionId, string raterId);
}
