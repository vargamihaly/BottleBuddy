using BottleBuddy.Api.Dtos;

namespace BottleBuddy.Api.Services;

public interface IBottleListingService
{
    Task<(IEnumerable<BottleListingResponseDto> Listings, PaginationMetadata Metadata)> GetListingsAsync(
        int page,
        int pageSize,
        string? status);

    Task<BottleListingResponseDto> CreateListingAsync(string userId, CreateBottleListingRequest request);
}

public class PaginationMetadata
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrevious { get; set; }
}
