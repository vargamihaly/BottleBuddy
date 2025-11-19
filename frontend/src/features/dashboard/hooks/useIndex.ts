import { useMemo } from "react";
import { useBottleListingOverview } from "@/features/listings/hooks";

/**
 * Custom hook for Index page
 * Handles filtering and processing of listings specifically for the home page
 */
export const useIndex = () => {
  const {
    bottleListings,
    myListings,
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    availableListings,
    myPickupRequests,
    isLoading,
    isError,
  } = useBottleListingOverview();

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

  return {
    bottleListings,
    myListings,
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    availableListings: availableListingsWithValidDeadline,
    myPickupRequests,
    isLoading,
    isError,
  };
};