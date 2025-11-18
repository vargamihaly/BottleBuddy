namespace BottleBuddy.Application.Templates;

public static class EmailTemplates
{
    private const string PrimaryColor = "#10b981";
    private const string DarkerColor = "#059669";

    #region Pickup Request Received

    public static string GetPickupRequestReceivedHtml(
        string ownerName,
        string volunteerName,
        int bottleCount,
        string locationAddress,
        string viewDetailsUrl)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>New Pickup Request</title>
</head>
<body style=""margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;"">
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #f3f4f6; padding: 20px 0;"">
        <tr>
            <td align=""center"">
                <table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"">
                    <!-- Header -->
                    <tr>
                        <td style=""background-color: {PrimaryColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;"">
                            <h1 style=""color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;"">BottleBuddy</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style=""padding: 40px 30px;"">
                            <h2 style=""color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;"">New Pickup Request!</h2>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;"">
                                Hi {ownerName},
                            </p>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;"">
                                Great news! <strong>{volunteerName}</strong> has requested to pick up your bottles.
                            </p>

                            <div style=""background-color: #f9fafb; border-left: 4px solid {PrimaryColor}; padding: 20px; margin: 20px 0; border-radius: 4px;"">
                                <p style=""color: #111827; margin: 0 0 10px 0; font-size: 14px;""><strong>Pickup Details:</strong></p>
                                <p style=""color: #374151; margin: 5px 0; font-size: 14px;"">📦 Bottle Count: <strong>{bottleCount} bottles</strong></p>
                                <p style=""color: #374151; margin: 5px 0; font-size: 14px;"">📍 Location: <strong>{locationAddress}</strong></p>
                            </div>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 20px 0;"">
                                Review the request and accept it to coordinate the pickup with {volunteerName}.
                            </p>

                            <!-- CTA Button -->
                            <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""margin: 30px 0;"">
                                <tr>
                                    <td align=""center"">
                                        <a href=""{viewDetailsUrl}"" style=""display: inline-block; background-color: {PrimaryColor}; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; transition: background-color 0.3s;"">View Request Details</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;"">
                            <p style=""color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"">
                                Thanks for using BottleBuddy to make a difference!
                            </p>
                            <p style=""color: #9ca3af; font-size: 12px; margin: 0;"">
                                You can manage your email preferences in your account settings.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    public static string GetPickupRequestReceivedText(
        string ownerName,
        string volunteerName,
        int bottleCount,
        string locationAddress,
        string viewDetailsUrl)
    {
        return $@"BottleBuddy - New Pickup Request!

Hi {ownerName},

Great news! {volunteerName} has requested to pick up your bottles.

PICKUP DETAILS:
- Bottle Count: {bottleCount} bottles
- Location: {locationAddress}

Review the request and accept it to coordinate the pickup with {volunteerName}.

View Request Details: {viewDetailsUrl}

Thanks for using BottleBuddy to make a difference!

You can manage your email preferences in your account settings.";
    }

    #endregion

    #region Pickup Request Accepted

    public static string GetPickupRequestAcceptedHtml(
        string volunteerName,
        int bottleCount,
        string locationAddress,
        string viewDetailsUrl)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Pickup Request Accepted</title>
</head>
<body style=""margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;"">
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #f3f4f6; padding: 20px 0;"">
        <tr>
            <td align=""center"">
                <table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"">
                    <!-- Header -->
                    <tr>
                        <td style=""background-color: {PrimaryColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;"">
                            <h1 style=""color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;"">BottleBuddy</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style=""padding: 40px 30px;"">
                            <div style=""text-align: center; margin-bottom: 20px;"">
                                <span style=""font-size: 48px;"">🎉</span>
                            </div>

                            <h2 style=""color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; text-align: center;"">Your Pickup Request Was Accepted!</h2>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;"">
                                Hi {volunteerName},
                            </p>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;"">
                                Excellent! The owner has accepted your pickup request. You can now coordinate the pickup details.
                            </p>

                            <div style=""background-color: #f9fafb; border-left: 4px solid {PrimaryColor}; padding: 20px; margin: 20px 0; border-radius: 4px;"">
                                <p style=""color: #111827; margin: 0 0 10px 0; font-size: 14px;""><strong>Pickup Details:</strong></p>
                                <p style=""color: #374151; margin: 5px 0; font-size: 14px;"">📦 Bottle Count: <strong>{bottleCount} bottles</strong></p>
                                <p style=""color: #374151; margin: 5px 0; font-size: 14px;"">📍 Location: <strong>{locationAddress}</strong></p>
                            </div>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 20px 0;"">
                                Contact the owner to arrange a convenient pickup time.
                            </p>

                            <!-- CTA Button -->
                            <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""margin: 30px 0;"">
                                <tr>
                                    <td align=""center"">
                                        <a href=""{viewDetailsUrl}"" style=""display: inline-block; background-color: {PrimaryColor}; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; transition: background-color 0.3s;"">View Pickup Details</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;"">
                            <p style=""color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"">
                                Thanks for helping the environment with BottleBuddy!
                            </p>
                            <p style=""color: #9ca3af; font-size: 12px; margin: 0;"">
                                You can manage your email preferences in your account settings.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    public static string GetPickupRequestAcceptedText(
        string volunteerName,
        int bottleCount,
        string locationAddress,
        string viewDetailsUrl)
    {
        return $@"BottleBuddy - Your Pickup Request Was Accepted!

Hi {volunteerName},

Excellent! The owner has accepted your pickup request. You can now coordinate the pickup details.

PICKUP DETAILS:
- Bottle Count: {bottleCount} bottles
- Location: {locationAddress}

Contact the owner to arrange a convenient pickup time.

View Pickup Details: {viewDetailsUrl}

Thanks for helping the environment with BottleBuddy!

You can manage your email preferences in your account settings.";
    }

    #endregion

    #region Transaction Completed

    public static string GetTransactionCompletedHtml(
        string userName,
        decimal amount,
        int bottleCount,
        string locationAddress,
        string viewDetailsUrl,
        bool isOwner)
    {
        var roleSpecificMessage = isOwner
            ? "Your bottles have been successfully picked up and recycled!"
            : "You've successfully completed a bottle pickup!";

        var amountMessage = isOwner
            ? $"You earned <strong style=\"color: {PrimaryColor}; font-size: 20px;\">{amount:N0} HUF</strong>"
            : $"Transaction amount: <strong style=\"color: {PrimaryColor}; font-size: 20px;\">{amount:N0} HUF</strong>";

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Transaction Completed</title>
</head>
<body style=""margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;"">
    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #f3f4f6; padding: 20px 0;"">
        <tr>
            <td align=""center"">
                <table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"">
                    <!-- Header -->
                    <tr>
                        <td style=""background-color: {PrimaryColor}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;"">
                            <h1 style=""color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;"">BottleBuddy</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style=""padding: 40px 30px;"">
                            <div style=""text-align: center; margin-bottom: 20px;"">
                                <span style=""font-size: 48px;"">✅</span>
                            </div>

                            <h2 style=""color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; text-align: center;"">Transaction Completed!</h2>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;"">
                                Hi {userName},
                            </p>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;"">
                                {roleSpecificMessage}
                            </p>

                            <div style=""background-color: #f0fdf4; border: 2px solid {PrimaryColor}; padding: 25px; margin: 20px 0; border-radius: 8px; text-align: center;"">
                                <p style=""color: #111827; margin: 0 0 15px 0; font-size: 16px;"">💰 {amountMessage}</p>
                            </div>

                            <div style=""background-color: #f9fafb; border-left: 4px solid {PrimaryColor}; padding: 20px; margin: 20px 0; border-radius: 4px;"">
                                <p style=""color: #111827; margin: 0 0 10px 0; font-size: 14px;""><strong>Transaction Details:</strong></p>
                                <p style=""color: #374151; margin: 5px 0; font-size: 14px;"">📦 Bottle Count: <strong>{bottleCount} bottles</strong></p>
                                <p style=""color: #374151; margin: 5px 0; font-size: 14px;"">📍 Location: <strong>{locationAddress}</strong></p>
                                <p style=""color: #374151; margin: 5px 0; font-size: 14px;"">💵 Amount: <strong>{amount:N0} HUF</strong></p>
                            </div>

                            <p style=""color: #374151; font-size: 16px; line-height: 24px; margin: 20px 0;"">
                                Thank you for being part of the BottleBuddy community and helping the environment!
                            </p>

                            <!-- CTA Button -->
                            <table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""margin: 30px 0;"">
                                <tr>
                                    <td align=""center"">
                                        <a href=""{viewDetailsUrl}"" style=""display: inline-block; background-color: {PrimaryColor}; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; transition: background-color 0.3s;"">View Transaction Details</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style=""background-color: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;"">
                            <p style=""color: #6b7280; font-size: 14px; margin: 0 0 10px 0;"">
                                Keep up the great work with BottleBuddy!
                            </p>
                            <p style=""color: #9ca3af; font-size: 12px; margin: 0;"">
                                You can manage your email preferences in your account settings.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    public static string GetTransactionCompletedText(
        string userName,
        decimal amount,
        int bottleCount,
        string locationAddress,
        string viewDetailsUrl,
        bool isOwner)
    {
        var roleSpecificMessage = isOwner
            ? "Your bottles have been successfully picked up and recycled!"
            : "You've successfully completed a bottle pickup!";

        var amountMessage = isOwner
            ? $"You earned {amount:N0} HUF"
            : $"Transaction amount: {amount:N0} HUF";

        return $@"BottleBuddy - Transaction Completed!

Hi {userName},

{roleSpecificMessage}

{amountMessage}

TRANSACTION DETAILS:
- Bottle Count: {bottleCount} bottles
- Location: {locationAddress}
- Amount: {amount:N0} HUF

Thank you for being part of the BottleBuddy community and helping the environment!

View Transaction Details: {viewDetailsUrl}

Keep up the great work with BottleBuddy!

You can manage your email preferences in your account settings.";
    }

    #endregion
}
