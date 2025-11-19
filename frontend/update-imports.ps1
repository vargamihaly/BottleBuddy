# PowerShell script to update import paths for feature-sliced architecture migration

$ErrorActionPreference = "Stop"

Write-Host "Starting import path migration..." -ForegroundColor Green

# Define replacement mappings (old pattern -> new pattern)
$replacements = @(
    # Shared infrastructure
    @{
        Pattern = 'from [''"]@/lib/apiClient[''"]'
        Replacement = 'from "@/shared/api/apiClient"'
    },
    @{
        Pattern = 'from [''"]@/lib/tokenUtils[''"]'
        Replacement = 'from "@/shared/lib/tokenUtils"'
    },
    @{
        Pattern = 'from [''"]@/lib/utils[''"]'
        Replacement = 'from "@/shared/lib/utils"'
    },
    @{
        Pattern = 'from [''"]@/lib/i18n[''"]'
        Replacement = 'from "@/shared/lib/i18n"'
    },
    @{
        Pattern = 'from [''"]@/lib/mapUtils[''"]'
        Replacement = 'from "@/features/map"'
    },
    @{
        Pattern = 'from [''"]@/contexts/AuthContext[''"]'
        Replacement = 'from "@/shared/contexts/AuthContext"'
    },
    @{
        Pattern = 'from [''"]@/contexts/SignalRContext[''"]'
        Replacement = 'from "@/shared/contexts/SignalRContext"'
    },
    @{
        Pattern = 'from [''"]@/hooks/use-toast[''"]'
        Replacement = 'from "@/shared/hooks/use-toast"'
    },
    @{
        Pattern = 'from [''"]@/hooks/use-mobile[''"]'
        Replacement = 'from "@/shared/hooks/use-mobile"'
    },
    @{
        Pattern = 'from [''"]@/hooks/useSignalRStatus[''"]'
        Replacement = 'from "@/shared/hooks/useSignalRStatus"'
    },

    # UI Components
    @{
        Pattern = 'from [''"]@/components/ui/'
        Replacement = 'from "@/shared/components/ui/'
    },

    # Layout components
    @{
        Pattern = 'from [''"]@/components/ProtectedRoute[''"]'
        Replacement = 'from "@/shared/components/layout/ProtectedRoute"'
    },
    @{
        Pattern = 'from [''"]@/components/ErrorBoundary[''"]'
        Replacement = 'from "@/shared/components/layout/ErrorBoundary"'
    },
    @{
        Pattern = 'from [''"]@/components/LanguageSwitcher[''"]'
        Replacement = 'from "@/shared/components/layout/LanguageSwitcher"'
    },
    @{
        Pattern = 'from [''"]@/components/LanguageSyncProvider[''"]'
        Replacement = 'from "@/shared/components/layout/LanguageSyncProvider"'
    },
    @{
        Pattern = 'from [''"]@/components/LoadingSpinner[''"]'
        Replacement = 'from "@/shared/components/layout/LoadingSpinner"'
    },

    # Feature components
    @{
        Pattern = 'from [''"]@/components/BottleListingCard[''"]'
        Replacement = 'from "@/features/bottle-listings"'
    },
    @{
        Pattern = 'from [''"]@/components/BottleListingSkeleton[''"]'
        Replacement = 'from "@/features/bottle-listings"'
    },
    @{
        Pattern = 'from [''"]@/components/LocationPicker[''"]'
        Replacement = 'from "@/features/bottle-listings"'
    },
    @{
        Pattern = 'from [''"]@/components/MapView[''"]'
        Replacement = 'from "@/features/map"'
    },
    @{
        Pattern = 'from [''"]@/components/RatingDialog[''"]'
        Replacement = 'from "@/features/ratings"'
    },
    @{
        Pattern = 'from [''"]@/components/ChatBox[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/ChatMessage[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/MessageInput[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/ConversationList[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/TypingIndicator[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/ReadReceipt[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/ImageModal[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/ImagePreview[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/components/UserDashboard[''"]'
        Replacement = 'from "@/features/dashboard"'
    },

    # HomePage components
    @{
        Pattern = 'from [''"]@/components/HomePage/'
        Replacement = 'from "@/features/home/components/'
    },

    # Dashboard components
    @{
        Pattern = 'from [''"]@/components/Dashboard/'
        Replacement = 'from "@/features/dashboard/components/'
    },

    # API Hooks - use consolidated import from features
    @{
        Pattern = 'from [''"]@/hooks/api/useBottleListings[''"]'
        Replacement = 'from "@/features/bottle-listings"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api/usePickupRequests[''"]'
        Replacement = 'from "@/features/pickup-requests"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api/useTransactions[''"]'
        Replacement = 'from "@/features/transactions"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api/useRatings[''"]'
        Replacement = 'from "@/features/ratings"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api/useUserActivities[''"]'
        Replacement = 'from "@/features/notifications"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api/useNotificationPreferences[''"]'
        Replacement = 'from "@/features/notifications"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api/useUserSettings[''"]'
        Replacement = 'from "@/features/user-profile"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api/useStatistics[''"]'
        Replacement = 'from "@/features/statistics"'
    },
    @{
        Pattern = 'from [''"]@/hooks/api[''"]'
        Replacement = 'from "@/hooks/api"'  # Temporary - will need manual review
    },

    # Other hooks
    @{
        Pattern = 'from [''"]@/hooks/useMessages[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/hooks/useTypingIndicator[''"]'
        Replacement = 'from "@/features/messaging"'
    },
    @{
        Pattern = 'from [''"]@/hooks/useIndex[''"]'
        Replacement = 'from "@/features/home"'
    },
    @{
        Pattern = 'from [''"]@/hooks/useBottleListingOverview[''"]'
        Replacement = 'from "@/hooks/useBottleListingOverview"'  # Keep temporarily
    },
    @{
        Pattern = 'from [''"]@/hooks/useMapViewData[''"]'
        Replacement = 'from "@/features/bottle-listings"'
    },
    @{
        Pattern = 'from [''"]@/hooks/useMyActiveListingsWidget[''"]'
        Replacement = 'from "@/features/dashboard/components/MyActiveListingsWidget/hooks"'
    },

    # Utils
    @{
        Pattern = 'from [''"]@/utils/activityTemplates[''"]'
        Replacement = 'from "@/features/notifications"'
    },

    # API Services
    @{
        Pattern = 'from [''"]@/api/services/bottleListings.service[''"]'
        Replacement = 'from "@/features/bottle-listings/api/bottleListings.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/pickupRequests.service[''"]'
        Replacement = 'from "@/features/pickup-requests/api/pickupRequests.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/transactions.service[''"]'
        Replacement = 'from "@/features/transactions/api/transactions.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/messages.service[''"]'
        Replacement = 'from "@/features/messaging/api/messages.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/ratings.service[''"]'
        Replacement = 'from "@/features/ratings/api/ratings.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/statistics.service[''"]'
        Replacement = 'from "@/features/statistics/api/statistics.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/userActivity.service[''"]'
        Replacement = 'from "@/features/notifications/api/userActivity.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/notificationPreferences.service[''"]'
        Replacement = 'from "@/features/notifications/api/notificationPreferences.service"'
    },
    @{
        Pattern = 'from [''"]@/api/services/userSettings.service[''"]'
        Replacement = 'from "@/features/user-profile/api/userSettings.service"'
    }
)

# Get all TypeScript/TSX files in src (excluding node_modules)
$files = Get-ChildItem -Path "src" -Include *.ts,*.tsx -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules" }

$totalFiles = $files.Count
$updatedFiles = 0
$current = 0

Write-Host "Found $totalFiles files to process" -ForegroundColor Cyan

foreach ($file in $files) {
    $current++
    Write-Progress -Activity "Updating import paths" -Status "Processing $($file.Name)" -PercentComplete (($current / $totalFiles) * 100)

    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content

    foreach ($replacement in $replacements) {
        $content = $content -replace $replacement.Pattern, $replacement.Replacement
    }

    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $updatedFiles++
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Progress -Activity "Updating import paths" -Completed

Write-Host ""
Write-Host "Migration complete!" -ForegroundColor Green
Write-Host "Total files processed: $totalFiles" -ForegroundColor Cyan
Write-Host "Files updated: $updatedFiles" -ForegroundColor Yellow
