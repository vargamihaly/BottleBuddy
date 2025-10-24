using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using BottleBuddy.Api.Data;
using BottleBuddy.Api.Dtos;
using BottleBuddy.Api.Models;
using BottleBuddy.Api.Enums;

namespace BottleBuddy.Api.Services;

public class StatisticsService(
    ApplicationDbContext context,
    UserManager<User> userManager,
    ILogger<StatisticsService> logger) : IStatisticsService
{
    public async Task<StatisticsResponseDto> GetStatisticsAsync()
    {
        logger.LogInformation("Calculating platform statistics");

        try
        {
            // Calculate total bottles returned from completed listings
            var totalBottlesReturned = await context.BottleListings
                .Where(l => l.Status == ListingStatus.Completed)
                .SumAsync(l => l.BottleCount);

            // Calculate total HUF shared from completed transactions
            var totalHufShared = await context.Transactions
                .Where(t => t.Status == TransactionStatus.Completed)
                .SumAsync(t => t.TotalRefund);

            // Count total registered users
            var activeUsers = await userManager.Users.CountAsync();

            logger.LogInformation(
                "Statistics calculated: Bottles={BottleCount}, HUF={HufShared}, Users={UserCount}",
                totalBottlesReturned,
                totalHufShared,
                activeUsers);

            return new StatisticsResponseDto
            {
                TotalBottlesReturned = totalBottlesReturned,
                TotalHufShared = totalHufShared,
                ActiveUsers = activeUsers
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error calculating statistics");
            throw;
        }
    }
}