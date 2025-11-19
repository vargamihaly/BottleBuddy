import { useMemo } from "react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useMyBottleListings } from "@/features/bottle-listings";
import { usePickupRequestsByListing } from "@/features/pickup-requests";
import { BottleListing } from "@/types";

/**
 * Extended bottle listing with pending pickup request count
 */
export interface BottleListingWithRequests extends BottleListing {
  pendingPickupRequestsCount: number;
}

/**
 * Custom hook for MyActiveListingsWidget
 * Fetches user's active listings and enriches them with pending pickup request counts
 */
export const useMyActiveListingsWidget = () => {
  const { user } = useAuth();

  // Fetch all user's listings
  const {
    data: allListings = [],
    isLoading: isLoadingListings,
    isError,
  } = useMyBottleListings({ enabled: !!user });

  // Filter to only user's own listings
  const myListings = useMemo(
    () => allListings.filter((listing) => listing.createdByUserEmail === user?.email),
    [allListings, user?.email]
  );

  // Filter to only active (open) listings
  const activeListings = useMemo(
    () => myListings.filter((listing) => listing.status === "open"),
    [myListings]
  );

  // Fetch pickup requests for each active listing
  const pickupRequestQueries = activeListings.map((listing) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePickupRequestsByListing(listing.id, !!user)
  );

  // Check if any pickup request queries are still loading
  const isLoadingPickupRequests = pickupRequestQueries.some((query) => query.isLoading);

  // Enrich listings with pending pickup request counts
  const listingsWithRequests: BottleListingWithRequests[] = useMemo(() => {
    return activeListings.map((listing, index) => {
      const pickupRequests = pickupRequestQueries[index]?.data || [];
      const pendingCount = pickupRequests.filter((req) => req.status === "pending").length;

      return {
        ...listing,
        pendingPickupRequestsCount: pendingCount,
      };
    });
  }, [activeListings, pickupRequestQueries]);

  return {
    listings: listingsWithRequests,
    isLoading: isLoadingListings || isLoadingPickupRequests,
    isError,
  };
};
