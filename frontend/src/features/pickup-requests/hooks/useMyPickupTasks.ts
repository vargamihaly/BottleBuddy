import { useAuth } from "@/shared/contexts/AuthContext";
import { useBottleListings } from "@/features/bottle-listings";
import { useMyPickupRequests } from "./usePickupRequests";
import { useMemo } from "react";

/**
 * Hook that combines bottle listings with user's pickup requests
 * Returns listings where the user is volunteering as a pickup helper
 */
export const useMyPickupTasks = () => {
  const { user } = useAuth();
  const {
    data: bottleListings,
    isLoading: isLoadingListings,
    isError: isErrorListings,
  } = useBottleListings();

  const {
    data: myPickupRequests,
    isLoading: isLoadingRequests,
    isError: isErrorRequests,
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

  // Get IDs of listings with completed pickup requests by this user
  const completedPickupRequestListingIds = useMemo(() => {
    return safeMyPickupRequests
      .filter(request => request.status === 'completed')
      .map(request => request.listingId);
  }, [safeMyPickupRequests]);

  // Listings where user has active pickup requests (pending or accepted)
  const myPickupTaskListings = useMemo(() => {
    return safeBottleListings.filter(
      listing => listing.createdByUserEmail !== user?.email && activePickupRequestListingIds.includes(listing.id)
    );
  }, [safeBottleListings, user?.email, activePickupRequestListingIds]);

  // Listings where user has completed pickup requests
  const myCompletedPickupTaskListings = useMemo(() => {
    return safeBottleListings.filter(
      listing => listing.createdByUserEmail !== user?.email && completedPickupRequestListingIds.includes(listing.id)
    );
  }, [safeBottleListings, user?.email, completedPickupRequestListingIds]);

  return {
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    myPickupRequests: safeMyPickupRequests,
    isLoading: isLoadingListings || isLoadingRequests,
    isError: isErrorListings || isErrorRequests,
  };
};
