using BottleBuddy.Application.Dtos;

namespace BottleBuddy.Application.Services;

public interface IStatisticsService
{
    Task<StatisticsResponseDto> GetStatisticsAsync();
}