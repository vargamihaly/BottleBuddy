import { useAuth } from "@/shared/contexts/AuthContext";
import { useBottleListings } from "@/features/bottle-listings";
import { useMyPickupRequests } from "@/features/pickup-requests";
import { useMemo } from "react";

/**
 * Hook that filters bottle listings to show only available listings
 * Excludes user's own listings, listings with active pickup requests, and completed listings
 * Used for browsing available bottles on the home page
 */
export const useAvailableListings = () => {
  const { user } = useAuth();
  const {
    data: bottleListings,
    isLoading,
    isError,
  } = useBottleListings();

  const {
    data: myPickupRequests,
  } = useMyPickupRequests({ enabled: !!user });

  // Ensure we have arrays (fallback if API fails)
  const safeBottleListings = Array.isArray(bottleListings) ? bottleListings : [];
  const safeMyPickupRequests = Array.isArray(myPickupRequests) ? myPickupRequests : [];

  // Get IDs of listings with active pickup requests (pending or accepted) by this user
  const activePickupRequestListingIds = useMemo(() => {
    return safeMyPickupRequests
      .filter(request => request.status === 'pending' || request.status === 'accepted')
      .map(request => request.listingId);
  }, [safeMyPickupRequests]);

  // Available listings (exclude own, exclude with active pickup requests, exclude completed)
  const availableListings = useMemo(() => {
    return safeBottleListings.filter(
      listing =>
        listing.createdByUserEmail !== user?.email &&
        !activePickupRequestListingIds.includes(listing.id) &&
        listing.status !== 'completed'
    );
  }, [safeBottleListings, user?.email, activePickupRequestListingIds]);

  return {
    availableListings,
    isLoading,
    isError,
  };
};
