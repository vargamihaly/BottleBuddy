using Microsoft.EntityFrameworkCore;
using BottleBuddy.Api.Data;
using BottleBuddy.Api.Models;
using BottleBuddy.Api.Dtos;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace BottleBuddy.Api.Services;

public class PickupRequestService
{
    private readonly ApplicationDbContext _context;
    private readonly ITransactionService _transactionService;
    private readonly ILogger<PickupRequestService> _logger;

    public PickupRequestService(
        ApplicationDbContext context,
        ITransactionService transactionService,
        ILogger<PickupRequestService> logger)
    {
        _context = context;
        _transactionService = transactionService;
        _logger = logger;
    }

    public async Task<PickupRequestResponseDto> CreatePickupRequestAsync(CreatePickupRequestDto dto, string volunteerId)
    {
        _logger.LogInformation(
            "Volunteer {VolunteerId} creating pickup request for listing {ListingId}",
            volunteerId,
            dto.ListingId);

        // Check if listing exists and is open
        var listing = await _context.BottleListings
            .FirstOrDefaultAsync(l => l.Id == dto.ListingId);

        if (listing == null)
        {
            _logger.LogWarning(
                "Pickup request creation failed: listing {ListingId} not found for volunteer {VolunteerId}",
                dto.ListingId,
                volunteerId);
            throw new InvalidOperationException("Listing not found");
        }

        if (listing.Status != "open")
        {
            _logger.LogWarning(
                "Pickup request creation failed: listing {ListingId} status {Status} not open",
                dto.ListingId,
                listing.Status);
            throw new InvalidOperationException("Listing is no longer available");
        }

        // Check if user is trying to pick up their own listing
        if (listing.UserId == volunteerId)
        {
            _logger.LogWarning(
                "Pickup request creation failed: volunteer {VolunteerId} attempted to pick up own listing {ListingId}",
                volunteerId,
                dto.ListingId);
            throw new InvalidOperationException("You cannot pick up your own listing");
        }

        // Check if user already has a pending or accepted pickup request for this listing
        var existingRequest = await _context.PickupRequests
            .FirstOrDefaultAsync(pr => pr.ListingId == dto.ListingId
                                    && pr.VolunteerId == volunteerId
                                    && (pr.Status == "pending" || pr.Status == "accepted"));

        if (existingRequest != null)
        {
            _logger.LogWarning(
                "Pickup request creation failed: volunteer {VolunteerId} already has active request {PickupRequestId} for listing {ListingId}",
                volunteerId,
                existingRequest.Id,
                dto.ListingId);
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

        _logger.LogInformation(
            "Pickup request {PickupRequestId} created for listing {ListingId} by volunteer {VolunteerId}",
            pickupRequest.Id,
            pickupRequest.ListingId,
            volunteerId);

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
        _logger.LogInformation(
            "User {UserId} retrieving pickup requests for listing {ListingId}",
            userId,
            listingId);

        // Verify that the user owns this listing
        var listing = await _context.BottleListings
            .FirstOrDefaultAsync(l => l.Id == listingId && l.UserId == userId);

        if (listing == null)
        {
            _logger.LogWarning(
                "User {UserId} attempted to access pickup requests for listing {ListingId} they do not own",
                userId,
                listingId);
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

        _logger.LogInformation(
            "User {UserId} retrieved {PickupRequestCount} pickup requests for listing {ListingId}",
            userId,
            pickupRequests.Count,
            listingId);

        return pickupRequests;
    }

    public async Task<List<PickupRequestResponseDto>> GetMyPickupRequestsAsync(string volunteerId)
    {
        _logger.LogInformation(
            "Retrieving pickup requests for volunteer {VolunteerId}",
            volunteerId);

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

        _logger.LogInformation(
            "Retrieved {PickupRequestCount} pickup requests for volunteer {VolunteerId}",
            pickupRequests.Count,
            volunteerId);

        return pickupRequests;
    }

    public async Task<PickupRequestResponseDto> UpdatePickupRequestStatusAsync(Guid requestId, string status, string userId)
    {
        _logger.LogInformation(
            "User {UserId} updating pickup request {PickupRequestId} to status {Status}",
            userId,
            requestId,
            status);

        var pickupRequest = await _context.PickupRequests
            .Include(pr => pr.Listing)
            .Include(pr => pr.Volunteer)
            .FirstOrDefaultAsync(pr => pr.Id == requestId);

        if (pickupRequest == null)
        {
            _logger.LogWarning(
                "Pickup request {PickupRequestId} not found while user {UserId} attempted status update",
                requestId,
                userId);
            throw new InvalidOperationException("Pickup request not found");
        }

        // Only the listing owner can accept/reject requests
        // Both the listing owner and volunteer can mark as completed
        var isOwner = pickupRequest.Listing?.UserId == userId;
        var isVolunteer = pickupRequest.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            _logger.LogWarning(
                "User {UserId} attempted unauthorized update of pickup request {PickupRequestId}",
                userId,
                requestId);
            throw new UnauthorizedAccessException("You do not have permission to update this pickup request");
        }

        // Only owner can accept/reject, both can complete
        if ((status == "accepted" || status == "rejected") && !isOwner)
        {
            _logger.LogWarning(
                "Volunteer {UserId} attempted to set status {Status} on pickup request {PickupRequestId}",
                userId,
                status,
                requestId);
            throw new UnauthorizedAccessException("Only the listing owner can accept or reject pickup requests");
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

        // If marking this request as completed, update the listing status to completed
        if (status == "completed" && pickupRequest.Listing != null)
        {
            pickupRequest.Listing.Status = "completed";
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Pickup request {PickupRequestId} updated to status {Status} by user {UserId}",
            pickupRequest.Id,
            pickupRequest.Status,
            userId);

        // If completed, automatically create a transaction
        if (status == "completed")
        {
            try
            {
                await _transactionService.CreateTransactionAsync(requestId, userId);
                _logger.LogInformation(
                    "Transaction creation triggered for completed pickup request {PickupRequestId}",
                    requestId);
            }
            catch (Exception ex)
            {
                // Transaction might already exist or fail for other reasons
                // Don't fail the status update if transaction creation fails
                _logger.LogWarning(
                    ex,
                    "Failed to automatically create transaction for completed pickup request {PickupRequestId}",
                    requestId);
            }
        }

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
