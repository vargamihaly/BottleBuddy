// Shared TypeScript types for the application

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
    locationAddress: string;
    description?: string;
    latitude?: number | null;
    longitude?: number | null;
    estimatedRefund: number;
    pickupDeadline?: string;
    splitPercentage?: number;
    status: 'open' | 'claimed' | 'completed' | 'cancelled';
    userId: string;
    createdByUserRating?: number;
    createdByUserName?: string;
    createdByUserEmail?: string;
    user?: User;
    createdAt?: string;
    updatedAt?: string;
    // Computed fields for display
    distance?: string;
    distanceKm?: number;
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
    status?: 'pending' | 'completed' | 'cancelled';
    createdAt?: string;
    completedAt?: string;
    volunteerName?: string;
    ownerName?: string;
    bottleCount?: number;
    listingTitle?: string;
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
