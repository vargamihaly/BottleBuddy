import { useMemo } from "react";
import { useBottleListings, useMyListings } from "@/features/bottle-listings";
import { useMyPickupTasks } from "@/features/pickup-requests";
import { useAvailableListings } from "./useAvailableListings";

/**
 * Custom hook for Index page
 * Aggregates data from multiple feature hooks for the home page
 */
export const useIndex = () => {
  // Get all listings (for map view and general data)
  const {
    data: bottleListings,
    isLoading: isLoadingListings,
    isError: isErrorListings,
  } = useBottleListings();

  // Get user's own listings
  const {
    myListings,
    isLoading: isLoadingMyListings,
  } = useMyListings();

  // Get user's pickup tasks
  const {
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    myPickupRequests,
    isLoading: isLoadingPickupTasks,
  } = useMyPickupTasks();

  // Get available listings
  const {
    availableListings,
    isLoading: isLoadingAvailable,
  } = useAvailableListings();

  // Filter out listings with expired pickup deadlines from available listings
  const availableListingsWithValidDeadline = useMemo(() => {
    return availableListings.filter(listing => {
      // Include listings without a deadline
      if (!listing.pickupDeadline) return true;

      // Only include if deadline is in the future
      const deadline = new Date(listing.pickupDeadline);
      const now = new Date();
      return deadline > now;
    });
  }, [availableListings]);

  // Aggregate loading and error states
  const isLoading = isLoadingListings || isLoadingMyListings || isLoadingPickupTasks || isLoadingAvailable;
  const isError = isErrorListings;

  return {
    bottleListings: Array.isArray(bottleListings) ? bottleListings : [],
    myListings,
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    availableListings: availableListingsWithValidDeadline,
    myPickupRequests,
    isLoading,
    isError,
  };
};