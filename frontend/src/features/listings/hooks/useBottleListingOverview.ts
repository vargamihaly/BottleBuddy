import {useAuth} from "@/contexts/AuthContext";
import {useBottleListings as useAllBottleListings} from "./useBottleListings";
import {useMyPickupRequests} from "@/features/pickup-requests/hooks";

/**
 * Hook that combines listings and pickup requests with filtering logic
 * Uses the new service layer underneath
 */
export const useBottleListingOverview = () => {
  const { user } = useAuth();

  // Use new hooks
  const {
    data: bottleListings,
    isLoading,
    isError,
  } = useAllBottleListings();

  const {
    data: myPickupRequests,
  } = useMyPickupRequests({ enabled: !!user });

  // Ensure we have arrays (fallback if API fails)
  const safeBottleListings = Array.isArray(bottleListings) ? bottleListings : [];
  const safeMyPickupRequests = Array.isArray(myPickupRequests) ? myPickupRequests : [];

  // Separate user's own listings from others (exclude completed ones from homepage)
  const myListings = safeBottleListings.filter(
    listing => listing.createdByUserEmail === user?.email && listing.status !== 'completed'
  );

  // Get IDs of listings with active pickup requests (pending or accepted) by this user
  const activePickupRequestListingIds = safeMyPickupRequests
    .filter(request => request.status === 'pending' || request.status === 'accepted')
    .map(request => request.listingId);

  // Get IDs of listings with completed pickup requests by this user
  const completedPickupRequestListingIds = safeMyPickupRequests
    .filter(request => request.status === 'completed')
    .map(request => request.listingId);

  // Listings where user has active pickup requests (pending or accepted)
  const myPickupTaskListings = safeBottleListings.filter(
    listing => listing.createdByUserEmail !== user?.email && activePickupRequestListingIds.includes(listing.id)
  );

  // Listings where user has completed pickup requests
  const myCompletedPickupTaskListings = safeBottleListings.filter(
    listing => listing.createdByUserEmail !== user?.email && completedPickupRequestListingIds.includes(listing.id)
  );

  // Available listings (exclude own, exclude with active pickup requests, exclude completed)
  const availableListings = safeBottleListings.filter(
    listing =>
      listing.createdByUserEmail !== user?.email &&
      !activePickupRequestListingIds.includes(listing.id) &&
      listing.status !== 'completed'
  );

  return {
    bottleListings: safeBottleListings,
    myListings,
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    availableListings,
    myPickupRequests: safeMyPickupRequests,
    isLoading,
    isError,
  };
};
