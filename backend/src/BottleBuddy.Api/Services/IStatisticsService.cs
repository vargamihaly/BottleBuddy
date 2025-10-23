using BottleBuddy.Api.Dtos;

namespace BottleBuddy.Api.Services;

public interface IStatisticsService
{
    Task<StatisticsResponseDto> GetStatisticsAsync();
}