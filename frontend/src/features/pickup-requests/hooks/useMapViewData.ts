import {useAuth} from "@/contexts/AuthContext";
import {useMyPickupRequests} from "./usePickupRequests";
import {BottleListing} from "@/shared/types";

/**
 * Custom hook that combines listings and pickup requests for MapView
 * Provides helper functions to check pickup request status
 */
export const useMapViewData = (listings: BottleListing[]) => {
    const {user} = useAuth();

    // Fetch user's pickup requests
    const {
        data: myPickupRequests,
        isLoading: isLoadingPickupRequests,
    } = useMyPickupRequests({enabled: !!user});

    // Ensure we have arrays (fallback if API fails)
    const safePickupRequests = Array.isArray(myPickupRequests) ? myPickupRequests : [];

    /**
     * Check if user already has an active pickup request for a listing
     * Active means status is 'pending' or 'accepted'
     */
    const hasActivePickupRequest = (listingId: string): boolean => {
        return safePickupRequests.some(
            request => request.listingId === listingId &&
                (request.status === 'pending' || request.status === 'accepted')
        );
    };

    /**
     * Get pickup request status for a listing
     * Returns the status if there's an active request, otherwise undefined
     */
    const getPickupRequestStatus = (listingId: string): 'pending' | 'accepted' | undefined => {
        const request = safePickupRequests.find(
            request => request.listingId === listingId &&
                (request.status === 'pending' || request.status === 'accepted')
        );
        return request?.status as 'pending' | 'accepted' | undefined;
    };

    return {
        myPickupRequests: safePickupRequests,
        isLoadingPickupRequests,
        hasActivePickupRequest,
        getPickupRequestStatus,
    };
};
