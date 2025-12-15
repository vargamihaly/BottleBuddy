// Shared TypeScript types for the application

// Enums
export enum ListingStatus {
    Open = 'open',
    Claimed = 'claimed',
    Completed = 'completed'
}

export interface User {
    id: string;
    email: string;
    emailConfirmed?: boolean;
    username?: string;  // Maps to Username from backend (case-insensitive JSON)
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
    rating?: number;
    totalRatings?: number;
    profileCreatedAt?: string;
    createdAt?: string;  // Keep for backward compatibility
}

export interface BottleListing {
    id: string;
    title?: string;
    bottleCount: number;
    location: string;
    description?: string;
    latitude?: number | null;
    longitude?: number | null;
    estimatedRefund: number;
    deadline?: string;
    sharePercentage: number;
    status: ListingStatus;
    userId: string;
    createdByUserRating?: number;
    createdByUserName?: string;
    createdByUserEmail?: string;
    user?: User;
    createdAt: string;
    updatedAt?: string;
    // Computed fields for display
    distance?: string;
    distanceKm?: number;
    pendingRequests?: number;
}

export interface PickupRequest {
    id: string;
    listingId: string;
    volunteerId: string;
    volunteer?: User;
    volunteerName?: string;
    volunteerEmail?: string;
    message?: string;
    pickupTime?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePickupRequest {
    listingId: string;
    message?: string;
    pickupTime?: string;
}

export interface Transaction {
    id: string;
    listingId: string;
    pickupRequestId: string;
    volunteerAmount: number;
    ownerAmount: number;
    totalRefund: number;
    status: 'pending' | 'completed';
    createdAt?: string;
    completedAt?: string;
    volunteerName?: string;
    ownerName?: string;
    bottleCount?: number;
    listingTitle?: string;
}

export interface ListingStats {
    totalActive: number;
    pendingRequests: number;
    totalEarnings: number;
    completedPickups: number;
}

export interface Rating {
    id: string;
    raterId: string;
    rater?: User;
    ratedUserId: string;
    ratedUser?: User;
    transactionId: string;
    value: number; // 1-5
    comment?: string;
    createdAt?: string;
    raterName?: string;
    ratedUserName?: string;
}

export interface CreateRating {
    transactionId: string;
    value: number;
    comment?: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore?: boolean;
}

export interface PaginationMetadata {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user?: User;
}

export interface Statistics {
    totalBottlesReturned: number;
    totalHufShared: number;
    activeUsers: number;
}

// Message types
export interface Message {
    id: string;
    pickupRequestId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    readAtUtc?: string;
    createdAt: string;
    imageUrl?: string;
    imageFileName?: string;
    senderName?: string;
    senderAvatarUrl?: string;
}

export interface CreateMessage {
    content?: string;
    image?: File;
}

// UserActivity types
export enum UserActivityType {
    // Listing events
    ListingCreated = 'listingCreated',
    ListingDeleted = 'listingDeleted',
    ListingReceivedOffer = 'listingReceivedOffer',

    // Pickup request events (as owner receiving requests)
    PickupRequestReceived = 'pickupRequestReceived',
    PickupRequestAcceptedByOwner = 'pickupRequestAcceptedByOwner',
    PickupRequestRejectedByOwner = 'pickupRequestRejectedByOwner',
    PickupRequestCompletedByOwner = 'pickupRequestCompletedByOwner',

    // Pickup request events (as volunteer making requests)
    PickupRequestCreated = 'pickupRequestCreated',
    PickupRequestAccepted = 'pickupRequestAccepted',
    PickupRequestRejected = 'pickupRequestRejected',
    PickupRequestCompleted = 'pickupRequestCompleted',
    PickupRequestCancelled = 'pickupRequestCancelled',

    // Transaction events
    TransactionCompleted = 'transactionCompleted',

    // Rating events
    RatingReceived = 'ratingReceived',
    RatingPrompt = 'ratingPrompt',

    // Map events
    NearbyListingAvailable = 'nearbyListingAvailable',
    PickupOpportunityNearby = 'pickupOpportunityNearby'
}

export enum UserActivityCategory {
    All = 'all',
    Listings = 'listings',
    Pickups = 'pickups',
    Transactions = 'transactions',
    Ratings = 'ratings'
}

export interface RatingDto {
    id: string;
    raterId: string;
    raterName: string;
    value: number;
    comment?: string;
    createdAtUtc: string;
}

export interface UserActivity {
    id: string;
    userId: string;
    type: UserActivityType;
    createdAtUtc: string;
    isRead: boolean;
    listingId?: string;
    pickupRequestId?: string;
    transactionId?: string;
    ratingId?: string;
    rating?: RatingDto;
    templateData: Record<string, unknown>;
}

export interface UserActivityResponse {
    data: UserActivity[];
    pagination: PaginationMetadata;
}

// Notification Preferences types
export interface NotificationPreferences {
    id: string;
    userId: string;
    emailNotificationsEnabled: boolean;
    pickupRequestReceivedEmail: boolean;
    pickupRequestAcceptedEmail: boolean;
    transactionCompletedEmail: boolean;
    createdAtUtc: string;
    updatedAtUtc: string;
}

export interface UpdateNotificationPreferences {
    emailNotificationsEnabled?: boolean;
    pickupRequestReceivedEmail?: boolean;
    pickupRequestAcceptedEmail?: boolean;
    transactionCompletedEmail?: boolean;
}

// User Settings types
export interface UserNotificationSettings {
    emailNotificationsEnabled: boolean;
    pickupRequestReceivedEmail: boolean;
    pickupRequestAcceptedEmail: boolean;
    transactionCompletedEmail: boolean;
}

export interface UserSettings {
    id: string;
    userId: string;
    preferredLanguage: string;
    notificationSettings: UserNotificationSettings;
    createdAtUtc: string;
    updatedAtUtc: string;
}

export interface UpdateUserNotificationSettingsDto {
    emailNotificationsEnabled?: boolean;
    pickupRequestReceivedEmail?: boolean;
    pickupRequestAcceptedEmail?: boolean;
    transactionCompletedEmail?: boolean;
}

export interface UpdateUserSettingsDto {
    preferredLanguage?: string;
    notificationSettings?: UpdateUserNotificationSettingsDto;
}
