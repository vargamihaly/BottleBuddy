using BottleBuddy.Application.Data;
using BottleBuddy.Application.Dtos;
using BottleBuddy.Application.Enums;
using BottleBuddy.Application.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Application.Services;

public class PickupRequestService(
    ApplicationDbContext context,
    ITransactionService transactionService,
    IUserActivityService userActivityService,
    IEmailService emailService,
    IUserSettingsService settingsService,
    ILogger<PickupRequestService> logger)
{
    public async Task<PickupRequestResponseDto> CreatePickupRequestAsync(CreatePickupRequestDto dto, string volunteerId)
    {
        logger.LogInformation(
            "Volunteer {VolunteerId} creating pickup request for listing {ListingId}",
            volunteerId,
            dto.ListingId);

        // Check if listing exists and is open
        var listing = await context.BottleListings
            .FirstOrDefaultAsync(l => l.Id == dto.ListingId);

        if (listing == null)
        {
            logger.LogWarning(
                "Pickup request creation failed: listing {ListingId} not found for volunteer {VolunteerId}",
                dto.ListingId,
                volunteerId);
            throw new InvalidOperationException("Listing not found");
        }

        if (listing.Status != ListingStatus.Open)
        {
            logger.LogWarning(
                "Pickup request creation failed: listing {ListingId} status {Status} not open",
                dto.ListingId,
                listing.Status);
            throw new InvalidOperationException("Listing is no longer available");
        }

        // Check if user is trying to pick up their own listing
        if (listing.OwnerId == volunteerId)
        {
            logger.LogWarning(
                "Pickup request creation failed: volunteer {VolunteerId} attempted to pick up own listing {ListingId}",
                volunteerId,
                dto.ListingId);
            throw new InvalidOperationException("You cannot pick up your own listing");
        }

        // Check if user already has a pending or accepted pickup request for this listing
        var existingRequest = await context.PickupRequests
            .FirstOrDefaultAsync(pr => pr.ListingId == dto.ListingId
                                    && pr.VolunteerId == volunteerId
                                    && (pr.Status == PickupRequestStatus.Pending || pr.Status == PickupRequestStatus.Accepted));

        if (existingRequest != null)
        {
            logger.LogWarning(
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
            Status = PickupRequestStatus.Pending,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.PickupRequests.Add(pickupRequest);
        await context.SaveChangesAsync();

        // Load volunteer info for response
        var volunteer = await context.Users.FindAsync(volunteerId);

        // Create activity for volunteer
        await userActivityService.CreateActivityAsync(new ActivityCreationData
        {
            Type = UserActivityType.PickupRequestCreated,
            UserId = volunteerId,
            ListingId = listing.Id,
            PickupRequestId = pickupRequest.Id,
            TemplateData = new Dictionary<string, object>
            {
                { "bottleCount", listing.BottleCount },
                { "locationAddress", listing.LocationAddress }
            }
        });

        // Create activity for listing owner
        await userActivityService.CreateActivityAsync(new ActivityCreationData
        {
            Type = UserActivityType.PickupRequestReceived,
            UserId = listing.OwnerId,
            ListingId = listing.Id,
            PickupRequestId = pickupRequest.Id,
            TemplateData = new Dictionary<string, object>
            {
                { "volunteerName", volunteer?.UserName ?? "A volunteer" },
                { "bottleCount", listing.BottleCount },
                { "locationAddress", listing.LocationAddress }
            }
        });

// Send email notification to owner
        try
        {
            var settings = await settingsService.GetOrCreateSettingsAsync(listing.OwnerId);
            if (settings.NotificationSettings.EmailNotificationsEnabled && settings.NotificationSettings.PickupRequestReceivedEmail)
            {
                await emailService.SendPickupRequestReceivedEmailAsync(
                    listing.OwnerId,
                    volunteer?.UserName ?? "A volunteer",
                    listing.BottleCount,
                    listing.LocationAddress,
                    listing.Id,
                    pickupRequest.Id);
                logger.LogInformation(
                    "Email sent for PickupRequestReceived to user {UserId}",
                    listing.OwnerId);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(
                ex,
                "Failed to send PickupRequestReceived email to user {UserId}",
                listing.OwnerId);
            // Don't rethrow - email failure shouldn't break the flow
        }

        logger.LogInformation(
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
            CreatedAt = pickupRequest.CreatedAtUtc,
            UpdatedAt = pickupRequest.UpdatedAtUtc
        };
    }

    public async Task<List<PickupRequestResponseDto>> GetPickupRequestsForListingAsync(Guid listingId, string userId)
    {
        logger.LogInformation(
            "User {UserId} retrieving pickup requests for listing {ListingId}",
            userId,
            listingId);

        // Verify that the user owns this listing
        var listing = await context.BottleListings
            .FirstOrDefaultAsync(l => l.Id == listingId && l.OwnerId == userId);

        if (listing == null)
        {
            logger.LogWarning(
                "User {UserId} attempted to access pickup requests for listing {ListingId} they do not own",
                userId,
                listingId);
            throw new UnauthorizedAccessException("You do not have access to this listing");
        }

        var pickupRequests = await context.PickupRequests
            .Include(pr => pr.Volunteer)
            .Where(pr => pr.ListingId == listingId)
            .OrderByDescending(pr => pr.CreatedAtUtc)
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
                CreatedAt = pr.CreatedAtUtc,
                UpdatedAt = pr.UpdatedAtUtc
            })
            .ToListAsync();

        logger.LogInformation(
            "User {UserId} retrieved {PickupRequestCount} pickup requests for listing {ListingId}",
            userId,
            pickupRequests.Count,
            listingId);

        return pickupRequests;
    }

    public async Task<List<PickupRequestResponseDto>> GetMyPickupRequestsAsync(string volunteerId)
    {
        logger.LogInformation(
            "Retrieving pickup requests for volunteer {VolunteerId}",
            volunteerId);

        var pickupRequests = await context.PickupRequests
            .Include(pr => pr.Listing)
            .Where(pr => pr.VolunteerId == volunteerId)
            .OrderByDescending(pr => pr.CreatedAtUtc)
            .Select(pr => new PickupRequestResponseDto
            {
                Id = pr.Id,
                ListingId = pr.ListingId,
                VolunteerId = pr.VolunteerId,
                Message = pr.Message,
                PickupTime = pr.PickupTime,
                Status = pr.Status,
                CreatedAt = pr.CreatedAtUtc,
                UpdatedAt = pr.UpdatedAtUtc
            })
            .ToListAsync();

        logger.LogInformation(
            "Retrieved {PickupRequestCount} pickup requests for volunteer {VolunteerId}",
            pickupRequests.Count,
            volunteerId);

        return pickupRequests;
    }

    public async Task<PickupRequestResponseDto> UpdatePickupRequestStatusAsync(Guid requestId, string status, string userId)
    {
        logger.LogInformation(
            "User {UserId} updating pickup request {PickupRequestId} to status {Status}",
            userId,
            requestId,
            status);

        var pickupRequest = await context.PickupRequests
            .Include(pr => pr.Listing)
            .Include(pr => pr.Volunteer)
            .FirstOrDefaultAsync(pr => pr.Id == requestId);

        if (pickupRequest == null)
        {
            logger.LogWarning(
                "Pickup request {PickupRequestId} not found while user {UserId} attempted status update",
                requestId,
                userId);
            throw new InvalidOperationException("Pickup request not found");
        }

        // Only the listing owner can accept/reject requests
        // Both the listing owner and volunteer can mark as completed
        var isOwner = pickupRequest.Listing?.OwnerId == userId;
        var isVolunteer = pickupRequest.VolunteerId == userId;

        if (!isOwner && !isVolunteer)
        {
            logger.LogWarning(
                "User {UserId} attempted unauthorized update of pickup request {PickupRequestId}",
                userId,
                requestId);
            throw new UnauthorizedAccessException("You do not have permission to update this pickup request");
        }

        if (!Enum.TryParse<PickupRequestStatus>(status, true, out var statusEnum))
        {
            logger.LogWarning(
                "Invalid status value {Status} provided for pickup request {PickupRequestId}",
                status,
                requestId);
            throw new ArgumentException($"Invalid status value: {status}");
        }

        // Only owner can accept/reject, both can complete
        if (statusEnum is PickupRequestStatus.Accepted or PickupRequestStatus.Rejected && !isOwner)
        {
            logger.LogWarning(
                "Volunteer {UserId} attempted to set status {Status} on pickup request {PickupRequestId}",
                userId,
                status,
                requestId);
            throw new UnauthorizedAccessException("Only the listing owner can accept or reject pickup requests");
        }

        pickupRequest.Status = statusEnum;
        pickupRequest.UpdatedAtUtc = DateTime.UtcNow;

        // If accepting this request, update the listing status to claimed
        if (statusEnum == PickupRequestStatus.Accepted && pickupRequest.Listing != null)
        {
            pickupRequest.Listing.Status = ListingStatus.Claimed;

            // Reject all other pending requests for this listing
            var otherRequests = await context.PickupRequests
                .Where(pr => pr.ListingId == pickupRequest.ListingId
                          && pr.Id != requestId
                          && pr.Status == PickupRequestStatus.Pending)
                .ToListAsync();

            foreach (var request in otherRequests)
            {
                request.Status = PickupRequestStatus.Rejected;
                request.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        // If marking this request as completed, update the listing status to completed
        if (statusEnum == PickupRequestStatus.Completed && pickupRequest.Listing != null)
        {
            pickupRequest.Listing.Status = ListingStatus.Completed;
        }

        await context.SaveChangesAsync();

        // Create activities based on status change
        if (statusEnum == PickupRequestStatus.Accepted)
        {
            // Notify owner
            await userActivityService.CreateActivityAsync(new ActivityCreationData
            {
                Type = UserActivityType.PickupRequestAcceptedByOwner,
                UserId = pickupRequest.Listing!.OwnerId,
                ListingId = pickupRequest.ListingId,
                PickupRequestId = pickupRequest.Id,
                TemplateData = new Dictionary<string, object>
                {
                    { "volunteerName", pickupRequest.Volunteer?.UserName ?? "a volunteer" },
                    { "bottleCount", pickupRequest.Listing.BottleCount }
                }
            });

            // Notify volunteer
            await userActivityService.CreateActivityAsync(new ActivityCreationData
            {
                Type = UserActivityType.PickupRequestAccepted,
                UserId = pickupRequest.VolunteerId,
                ListingId = pickupRequest.ListingId,
                PickupRequestId = pickupRequest.Id,
                TemplateData = new Dictionary<string, object>
                {
                    { "bottleCount", pickupRequest.Listing.BottleCount },
                    { "locationAddress", pickupRequest.Listing.LocationAddress }
                }
            });

            // Send email notification to volunteer
            try
            {
                var settings = await settingsService.GetOrCreateSettingsAsync(pickupRequest.VolunteerId);
                if (settings.NotificationSettings.EmailNotificationsEnabled && settings.NotificationSettings.PickupRequestAcceptedEmail)
                {
                    await emailService.SendPickupRequestAcceptedEmailAsync(
                        pickupRequest.VolunteerId,
                        pickupRequest.Listing.BottleCount,
                        pickupRequest.Listing.LocationAddress,
                        pickupRequest.ListingId,
                        pickupRequest.Id);
                    logger.LogInformation(
                        "Email sent for PickupRequestAccepted to user {UserId}",
                        pickupRequest.VolunteerId);
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(
                    ex,
                    "Failed to send PickupRequestAccepted email to user {UserId}",
                    pickupRequest.VolunteerId);
                // Don't rethrow - email failure shouldn't break the flow
            }
        }
        else if (statusEnum == PickupRequestStatus.Rejected)
        {
            // Notify owner
            await userActivityService.CreateActivityAsync(new ActivityCreationData
            {
                Type = UserActivityType.PickupRequestRejectedByOwner,
                UserId = pickupRequest.Listing!.OwnerId,
                ListingId = pickupRequest.ListingId,
                PickupRequestId = pickupRequest.Id,
                TemplateData = new Dictionary<string, object>
                {
                    { "volunteerName", pickupRequest.Volunteer?.UserName ?? "a volunteer" }
                }
            });

            // Notify volunteer
            await userActivityService.CreateActivityAsync(new ActivityCreationData
            {
                Type = UserActivityType.PickupRequestRejected,
                UserId = pickupRequest.VolunteerId,
                ListingId = pickupRequest.ListingId,
                PickupRequestId = pickupRequest.Id,
                TemplateData = new Dictionary<string, object>
                {
                    { "locationAddress", pickupRequest.Listing!.LocationAddress }
                }
            });
        }
        else if (statusEnum == PickupRequestStatus.Completed)
        {
            // Notify both parties
            await userActivityService.CreateActivityAsync(new ActivityCreationData
            {
                Type = UserActivityType.PickupRequestCompletedByOwner,
                UserId = pickupRequest.Listing!.OwnerId,
                ListingId = pickupRequest.ListingId,
                PickupRequestId = pickupRequest.Id,
                TemplateData = new Dictionary<string, object>
                {
                    { "locationAddress", pickupRequest.Listing.LocationAddress }
                }
            });

            await userActivityService.CreateActivityAsync(new ActivityCreationData
            {
                Type = UserActivityType.PickupRequestCompleted,
                UserId = pickupRequest.VolunteerId,
                ListingId = pickupRequest.ListingId,
                PickupRequestId = pickupRequest.Id,
                TemplateData = new Dictionary<string, object>
                {
                    { "bottleCount", pickupRequest.Listing.BottleCount },
                    { "locationAddress", pickupRequest.Listing.LocationAddress }
                }
            });
        }

        logger.LogInformation(
            "Pickup request {PickupRequestId} updated to status {Status} by user {UserId}",
            pickupRequest.Id,
            pickupRequest.Status,
            userId);

        // If completed, automatically create a transaction
        if (statusEnum == PickupRequestStatus.Completed)
        {
            try
            {
                await transactionService.CreateTransactionAsync(requestId, userId);
                logger.LogInformation(
                    "Transaction creation triggered for completed pickup request {PickupRequestId}",
                    requestId);
            }
            catch (Exception ex)
            {
                // Transaction might already exist or fail for other reasons
                // Don't fail the status update if transaction creation fails
                logger.LogWarning(
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
            CreatedAt = pickupRequest.CreatedAtUtc,
            UpdatedAt = pickupRequest.UpdatedAtUtc
        };
    }
}
