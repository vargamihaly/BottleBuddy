using BottleBuddy.Core.Dtos;
using BottleBuddy.Core.Enums;
using BottleBuddy.Core.Interfaces.Repositories;
using BottleBuddy.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Core.Services;

public class PickupRequestService
{
    private readonly IBottleListingRepository _listingRepository;
    private readonly IPickupRequestRepository _pickupRequestRepository;
    private readonly ITransactionService _transactionService;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<PickupRequestService> _logger;

    public PickupRequestService(
        IBottleListingRepository listingRepository,
        IPickupRequestRepository pickupRequestRepository,
        ITransactionService transactionService,
        UserManager<ApplicationUser> userManager,
        ILogger<PickupRequestService> logger)
    {
        _listingRepository = listingRepository;
        _pickupRequestRepository = pickupRequestRepository;
        _transactionService = transactionService;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<PickupRequestResponseDto> CreatePickupRequestAsync(CreatePickupRequestDto dto, string volunteerId)
    {
        _logger.LogInformation(
            "Volunteer {VolunteerId} creating pickup request for listing {ListingId}",
            volunteerId,
            dto.ListingId);

        var listing = await _listingRepository.GetByIdAsync(dto.ListingId);

        if (listing == null)
        {
            _logger.LogWarning(
                "Pickup request creation failed: listing {ListingId} not found for volunteer {VolunteerId}",
                dto.ListingId,
                volunteerId);
            throw new InvalidOperationException("Listing not found");
        }

        if (listing.Status != ListingStatus.Open)
        {
            _logger.LogWarning(
                "Pickup request creation failed: listing {ListingId} status {Status} not open",
                dto.ListingId,
                listing.Status);
            throw new InvalidOperationException("Listing is no longer available");
        }

        if (listing.UserId == volunteerId)
        {
            _logger.LogWarning(
                "Pickup request creation failed: volunteer {VolunteerId} attempted to pick up own listing {ListingId}",
                volunteerId,
                dto.ListingId);
            throw new InvalidOperationException("You cannot pick up your own listing");
        }

        var existingRequest = await _pickupRequestRepository.GetActiveRequestForListingAsync(dto.ListingId, volunteerId);

        if (existingRequest != null)
        {
            _logger.LogWarning(
                "Pickup request creation failed: volunteer {VolunteerId} already has active request {PickupRequestId} for listing {ListingId}",
                volunteerId,
                existingRequest.Id,
                dto.ListingId);
            throw new InvalidOperationException("You already have an active pickup request for this listing");
        }

        var pickupRequest = new PickupRequest
        {
            Id = Guid.NewGuid(),
            ListingId = dto.ListingId,
            VolunteerId = volunteerId,
            Message = dto.Message,
            PickupTime = dto.PickupTime,
            Status = PickupRequestStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _pickupRequestRepository.AddAsync(pickupRequest);
        await _pickupRequestRepository.SaveChangesAsync();

        var volunteer = await _userManager.FindByIdAsync(volunteerId);

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

        var listing = await _listingRepository.Query()
            .FirstOrDefaultAsync(l => l.Id == listingId && l.UserId == userId);

        if (listing == null)
        {
            _logger.LogWarning(
                "User {UserId} attempted to access pickup requests for listing {ListingId} they do not own",
                userId,
                listingId);
            throw new UnauthorizedAccessException("You do not have access to this listing");
        }

        var pickupRequests = await _pickupRequestRepository.Query()
            .Where(pr => pr.ListingId == listingId)
            .Include(pr => pr.Volunteer)
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

        var pickupRequests = await _pickupRequestRepository.Query()
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

        var pickupRequest = await _pickupRequestRepository.GetByIdWithDetailsAsync(requestId);

        if (pickupRequest == null)
        {
            _logger.LogWarning(
                "Pickup request {PickupRequestId} not found while user {UserId} attempted status update",
                requestId,
                userId);
            throw new InvalidOperationException("Pickup request not found");
        }

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

        Enum.TryParse<PickupRequestStatus>(status, true, out var statusEnum);

        if (statusEnum is PickupRequestStatus.Accepted or PickupRequestStatus.Rejected && !isOwner)
        {
            _logger.LogWarning(
                "Volunteer {UserId} attempted to set status {Status} on pickup request {PickupRequestId}",
                userId,
                status,
                requestId);
            throw new UnauthorizedAccessException("Only the listing owner can accept or reject pickup requests");
        }

        pickupRequest.Status = statusEnum;
        pickupRequest.UpdatedAt = DateTime.UtcNow;

        if (statusEnum == PickupRequestStatus.Accepted && pickupRequest.Listing != null)
        {
            pickupRequest.Listing.Status = ListingStatus.Claimed;

            var otherRequests = await _pickupRequestRepository.GetPendingRequestsForListingAsync(
                pickupRequest.ListingId,
                requestId);

            foreach (var request in otherRequests)
            {
                request.Status = PickupRequestStatus.Rejected;
                request.UpdatedAt = DateTime.UtcNow;
            }
        }

        if (statusEnum == PickupRequestStatus.Completed && pickupRequest.Listing != null)
        {
            pickupRequest.Listing.Status = ListingStatus.Completed;
        }

        await _pickupRequestRepository.SaveChangesAsync();

        _logger.LogInformation(
            "Pickup request {PickupRequestId} updated to status {Status} by user {UserId}",
            pickupRequest.Id,
            pickupRequest.Status,
            userId);

        if (statusEnum == PickupRequestStatus.Completed)
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
