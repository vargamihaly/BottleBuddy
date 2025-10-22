using Microsoft.EntityFrameworkCore;
using BottleBuddy.Api.Data;
using BottleBuddy.Api.Models;
using BottleBuddy.Api.Dtos;

namespace BottleBuddy.Api.Services;

public class PickupRequestService
{
    private readonly ApplicationDbContext _context;

    public PickupRequestService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PickupRequestResponseDto> CreatePickupRequestAsync(CreatePickupRequestDto dto, string volunteerId)
    {
        // Check if listing exists and is open
        var listing = await _context.BottleListings
            .FirstOrDefaultAsync(l => l.Id == dto.ListingId);

        if (listing == null)
        {
            throw new InvalidOperationException("Listing not found");
        }

        if (listing.Status != "open")
        {
            throw new InvalidOperationException("Listing is no longer available");
        }

        // Check if user is trying to pick up their own listing
        if (listing.UserId == volunteerId)
        {
            throw new InvalidOperationException("You cannot pick up your own listing");
        }

        // Check if user already has a pending or accepted pickup request for this listing
        var existingRequest = await _context.PickupRequests
            .FirstOrDefaultAsync(pr => pr.ListingId == dto.ListingId
                                    && pr.VolunteerId == volunteerId
                                    && (pr.Status == "pending" || pr.Status == "accepted"));

        if (existingRequest != null)
        {
            throw new InvalidOperationException("You already have an active pickup request for this listing");
        }

        // Create the pickup request
        var pickupRequest = new PickupRequest
        {
            Id = Guid.NewGuid(),
            ListingId = dto.ListingId,
            VolunteerId = volunteerId,
            Message = dto.Message,
            PickupTime = dto.PickupTime,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.PickupRequests.Add(pickupRequest);
        await _context.SaveChangesAsync();

        // Load volunteer info for response
        var volunteer = await _context.Users.FindAsync(volunteerId);

        return new PickupRequestResponseDto
        {
            Id = pickupRequest.Id,
            ListingId = pickupRequest.ListingId,
            VolunteerId = pickupRequest.VolunteerId,
            VolunteerName = volunteer?.UserName,
            VolunteerEmail = volunteer?.Email,
            Message = pickupRequest.Message,
            PickupTime = pickupRequest.PickupTime,
            Status = pickupRequest.Status,
            CreatedAt = pickupRequest.CreatedAt,
            UpdatedAt = pickupRequest.UpdatedAt
        };
    }

    public async Task<List<PickupRequestResponseDto>> GetPickupRequestsForListingAsync(Guid listingId, string userId)
    {
        // Verify that the user owns this listing
        var listing = await _context.BottleListings
            .FirstOrDefaultAsync(l => l.Id == listingId && l.UserId == userId);

        if (listing == null)
        {
            throw new UnauthorizedAccessException("You do not have access to this listing");
        }

        var pickupRequests = await _context.PickupRequests
            .Include(pr => pr.Volunteer)
            .Where(pr => pr.ListingId == listingId)
            .OrderByDescending(pr => pr.CreatedAt)
            .Select(pr => new PickupRequestResponseDto
            {
                Id = pr.Id,
                ListingId = pr.ListingId,
                VolunteerId = pr.VolunteerId,
                VolunteerName = pr.Volunteer != null ? pr.Volunteer.UserName : null,
                VolunteerEmail = pr.Volunteer != null ? pr.Volunteer.Email : null,
                Message = pr.Message,
                PickupTime = pr.PickupTime,
                Status = pr.Status,
                CreatedAt = pr.CreatedAt,
                UpdatedAt = pr.UpdatedAt
            })
            .ToListAsync();

        return pickupRequests;
    }

    public async Task<List<PickupRequestResponseDto>> GetMyPickupRequestsAsync(string volunteerId)
    {
        var pickupRequests = await _context.PickupRequests
            .Include(pr => pr.Listing)
            .Where(pr => pr.VolunteerId == volunteerId)
            .OrderByDescending(pr => pr.CreatedAt)
            .Select(pr => new PickupRequestResponseDto
            {
                Id = pr.Id,
                ListingId = pr.ListingId,
                VolunteerId = pr.VolunteerId,
                Message = pr.Message,
                PickupTime = pr.PickupTime,
                Status = pr.Status,
                CreatedAt = pr.CreatedAt,
                UpdatedAt = pr.UpdatedAt
            })
            .ToListAsync();

        return pickupRequests;
    }

    public async Task<PickupRequestResponseDto> UpdatePickupRequestStatusAsync(Guid requestId, string status, string userId)
    {
        var pickupRequest = await _context.PickupRequests
            .Include(pr => pr.Listing)
            .Include(pr => pr.Volunteer)
            .FirstOrDefaultAsync(pr => pr.Id == requestId);

        if (pickupRequest == null)
        {
            throw new InvalidOperationException("Pickup request not found");
        }

        // Only the listing owner can accept/reject requests
        if (pickupRequest.Listing?.UserId != userId)
        {
            throw new UnauthorizedAccessException("You do not have permission to update this pickup request");
        }

        pickupRequest.Status = status;
        pickupRequest.UpdatedAt = DateTime.UtcNow;

        // If accepting this request, update the listing status to claimed
        if (status == "accepted" && pickupRequest.Listing != null)
        {
            pickupRequest.Listing.Status = "claimed";

            // Reject all other pending requests for this listing
            var otherRequests = await _context.PickupRequests
                .Where(pr => pr.ListingId == pickupRequest.ListingId
                          && pr.Id != requestId
                          && pr.Status == "pending")
                .ToListAsync();

            foreach (var request in otherRequests)
            {
                request.Status = "rejected";
                request.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();

        return new PickupRequestResponseDto
        {
            Id = pickupRequest.Id,
            ListingId = pickupRequest.ListingId,
            VolunteerId = pickupRequest.VolunteerId,
            VolunteerName = pickupRequest.Volunteer?.UserName,
            VolunteerEmail = pickupRequest.Volunteer?.Email,
            Message = pickupRequest.Message,
            PickupTime = pickupRequest.PickupTime,
            Status = pickupRequest.Status,
            CreatedAt = pickupRequest.CreatedAt,
            UpdatedAt = pickupRequest.UpdatedAt
        };
    }
}
