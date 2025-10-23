namespace BottleBuddy.Api.Dtos;

public class StatisticsResponseDto
{
    public int TotalBottlesReturned { get; set; }
    public decimal TotalHufShared { get; set; }
    public int ActiveUsers { get; set; }
}