using Microsoft.AspNetCore.Mvc;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Services;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController(
    IStatisticsService statisticsService,
    ILogger<StatisticsController> logger) : ControllerBase
{
    /// <summary>
    /// Get platform statistics
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(StatisticsResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetStatistics()
    {
        logger.LogInformation("Statistics endpoint accessed");

        try
        {
            var statistics = await statisticsService.GetStatisticsAsync();

            logger.LogInformation("Statistics retrieved successfully");

            return Ok(statistics);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving statistics");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Failed to retrieve statistics" });
        }
    }
}