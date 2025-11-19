using Azure;
using Azure.Communication.Email;
using BottleBuddy.Application.Models;
using BottleBuddy.Application.Services;
using BottleBuddy.Application.Templates;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BottleBuddy.Infrastructure.Email;

public class AzureEmailService(
    IConfiguration configuration,
    ILogger<AzureEmailService> logger,
    UserManager<User> userManager)
    : IEmailService
{
    private readonly string? _connectionString = configuration["AzureCommunicationServices:Email:ConnectionString"];

    private readonly string _fromEmail = configuration["AzureCommunicationServices:Email:FromEmail"]
                                         ?? "DoNotReply@bottlebuddy.azurecomm.net";

    private readonly string _fromName = configuration["AzureCommunicationServices:Email:FromName"]
                                        ?? "BottleBuddy";

    private readonly string _frontendBaseUrl = configuration["Frontend:BaseUrl"]
                                               ?? "http://localhost:5173";

    public async Task SendPickupRequestReceivedEmailAsync(
        string ownerUserId,
        string volunteerName,
        int bottleCount,
        string locationAddress,
        Guid listingId,
        Guid pickupRequestId)
    {
        logger.LogInformation(
            "Sending pickup request received email to owner {OwnerId} for listing {ListingId}",
            ownerUserId,
            listingId);

        try
        {
            var owner = await userManager.FindByIdAsync(ownerUserId);
            if (owner == null)
            {
                logger.LogWarning("User {UserId} not found, cannot send email", ownerUserId);
                return;
            }

            if (!owner.EmailConfirmed)
            {
                logger.LogInformation("User {UserId} email not confirmed, skipping email", ownerUserId);
                return;
            }

            if (string.IsNullOrEmpty(owner.Email))
            {
                logger.LogWarning("User {UserId} has no email address, cannot send email", ownerUserId);
                return;
            }

            if (string.IsNullOrEmpty(_connectionString))
            {
                logger.LogWarning("Azure Communication Services connection string not configured, skipping email");
                return;
            }

            var ownerName = owner.Profile?.FullName ?? owner.Email;
            var viewDetailsUrl = $"{_frontendBaseUrl}/listings/{listingId}";

            var subject = "New Pickup Request for Your Bottles";
            var htmlContent = EmailTemplates.GetPickupRequestReceivedHtml(
                ownerName,
                volunteerName,
                bottleCount,
                locationAddress,
                viewDetailsUrl);
            var textContent = EmailTemplates.GetPickupRequestReceivedText(
                ownerName,
                volunteerName,
                bottleCount,
                locationAddress,
                viewDetailsUrl);

            await SendEmailAsync(owner.Email, subject, htmlContent, textContent);

            logger.LogInformation(
                "Successfully sent pickup request received email to {Email}",
                owner.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error sending pickup request received email to user {UserId}",
                ownerUserId);
            // Don't throw - email failures should not break the application flow
        }
    }

    public async Task SendPickupRequestAcceptedEmailAsync(
        string volunteerUserId,
        int bottleCount,
        string locationAddress,
        Guid listingId,
        Guid pickupRequestId)
    {
        logger.LogInformation(
            "Sending pickup request accepted email to volunteer {VolunteerId} for listing {ListingId}",
            volunteerUserId,
            listingId);

        try
        {
            var volunteer = await userManager.FindByIdAsync(volunteerUserId);
            if (volunteer == null)
            {
                logger.LogWarning("User {UserId} not found, cannot send email", volunteerUserId);
                return;
            }

            if (!volunteer.EmailConfirmed)
            {
                logger.LogInformation("User {UserId} email not confirmed, skipping email", volunteerUserId);
                return;
            }

            if (string.IsNullOrEmpty(volunteer.Email))
            {
                logger.LogWarning("User {UserId} has no email address, cannot send email", volunteerUserId);
                return;
            }

            if (string.IsNullOrEmpty(_connectionString))
            {
                logger.LogWarning("Azure Communication Services connection string not configured, skipping email");
                return;
            }

            var volunteerName = volunteer.Profile?.FullName ?? volunteer.Email;
            var viewDetailsUrl = $"{_frontendBaseUrl}/listings/{listingId}";

            var subject = "Your Pickup Request Was Accepted!";
            var htmlContent = EmailTemplates.GetPickupRequestAcceptedHtml(
                volunteerName,
                bottleCount,
                locationAddress,
                viewDetailsUrl);
            var textContent = EmailTemplates.GetPickupRequestAcceptedText(
                volunteerName,
                bottleCount,
                locationAddress,
                viewDetailsUrl);

            await SendEmailAsync(volunteer.Email, subject, htmlContent, textContent);

            logger.LogInformation(
                "Successfully sent pickup request accepted email to {Email}",
                volunteer.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error sending pickup request accepted email to user {UserId}",
                volunteerUserId);
            // Don't throw - email failures should not break the application flow
        }
    }

    public async Task SendTransactionCompletedEmailAsync(
        string userId,
        decimal amount,
        int bottleCount,
        string locationAddress,
        Guid transactionId,
        bool isOwner)
    {
        logger.LogInformation(
            "Sending transaction completed email to user {UserId} for transaction {TransactionId}",
            userId,
            transactionId);

        try
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                logger.LogWarning("User {UserId} not found, cannot send email", userId);
                return;
            }

            if (!user.EmailConfirmed)
            {
                logger.LogInformation("User {UserId} email not confirmed, skipping email", userId);
                return;
            }

            if (string.IsNullOrEmpty(user.Email))
            {
                logger.LogWarning("User {UserId} has no email address, cannot send email", userId);
                return;
            }

            if (string.IsNullOrEmpty(_connectionString))
            {
                logger.LogWarning("Azure Communication Services connection string not configured, skipping email");
                return;
            }

            var userName = user.Profile?.FullName ?? user.Email;
            var viewDetailsUrl = $"{_frontendBaseUrl}/transactions/{transactionId}";

            var subject = isOwner
                ? $"Transaction Completed - You Earned {amount:N0} HUF"
                : "Transaction Completed Successfully";
            var htmlContent = EmailTemplates.GetTransactionCompletedHtml(
                userName,
                amount,
                bottleCount,
                locationAddress,
                viewDetailsUrl,
                isOwner);
            var textContent = EmailTemplates.GetTransactionCompletedText(
                userName,
                amount,
                bottleCount,
                locationAddress,
                viewDetailsUrl,
                isOwner);

            await SendEmailAsync(user.Email, subject, htmlContent, textContent);

            logger.LogInformation(
                "Successfully sent transaction completed email to {Email}",
                user.Email);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error sending transaction completed email to user {UserId}",
                userId);
            // Don't throw - email failures should not break the application flow
        }
    }

    private async Task SendEmailAsync(string toEmail, string subject, string htmlContent, string textContent)
    {
        if (string.IsNullOrEmpty(_connectionString))
        {
            logger.LogWarning("Azure Communication Services connection string not configured, cannot send email");
            return;
        }

        try
        {
            var emailClient = new EmailClient(_connectionString);

            var emailMessage = new EmailMessage(
                senderAddress: _fromEmail,
                recipientAddress: toEmail,
                content: new EmailContent(subject)
                {
                    PlainText = textContent,
                    Html = htmlContent
                });

            logger.LogInformation(
                "Sending email to {Email} with subject '{Subject}' from {FromEmail}",
                toEmail,
                subject,
                _fromEmail);

            EmailSendOperation emailSendOperation = await emailClient.SendAsync(
                WaitUntil.Completed,
                emailMessage);

            // Check the status
            if (emailSendOperation.HasCompleted)
            {
                var operationId = emailSendOperation.Id;
                logger.LogInformation(
                    "Email sent successfully to {Email} with operation ID {OperationId}",
                    toEmail,
                    operationId);
            }
            else
            {
                logger.LogWarning(
                    "Email sending to {Email} did not complete immediately, operation ID: {OperationId}",
                    toEmail,
                    emailSendOperation.Id);
            }
        }
        catch (RequestFailedException ex)
        {
            logger.LogError(
                ex,
                "Azure Communication Services request failed when sending to {Email}. Status: {Status}, ErrorCode: {ErrorCode}",
                toEmail,
                ex.Status,
                ex.ErrorCode);
            throw new InvalidOperationException(
                $"Failed to send email via Azure Communication Services. Status: {ex.Status}, Error: {ex.ErrorCode}",
                ex);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Unexpected error sending email to {Email}",
                toEmail);
            throw;
        }
    }
}