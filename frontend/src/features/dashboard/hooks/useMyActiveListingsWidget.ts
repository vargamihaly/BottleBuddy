import {useMemo} from "react";
import {useAuth} from "@/contexts/AuthContext";
import {useMyBottleListings} from "@/features/listings/hooks";
import {useQuery} from "@tanstack/react-query";
import {pickupRequestService} from "@/features/pickup-requests/api";
import {BottleListing} from "@/shared/types";

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

  // Extract active listing IDs
  const activeListingIds = useMemo(
    () => activeListings.map((listing) => listing.id),
    [activeListings]
  );

  // Fetch all pickup requests for active listings in a single query
  const { data: allPickupRequests = [], isLoading: isLoadingPickupRequests } = useQuery({
    queryKey: ['pickupRequests', 'listings', activeListingIds],
    queryFn: async () => {
      if (activeListingIds.length === 0) return [];

      // Fetch pickup requests for all active listings in parallel
      const requests = await Promise.all(
        activeListingIds.map((id) => pickupRequestService.getByListingId(id))
      );

      // Flatten the results and tag each request with its listing ID
      return requests.flatMap((reqs, index) =>
        reqs.map((req) => ({ ...req, listingId: activeListingIds[index] }))
      );
    },
    enabled: !!user && activeListingIds.length > 0,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Enrich listings with pending pickup request counts
  const listingsWithRequests: BottleListingWithRequests[] = useMemo(() => {
    return activeListings.map((listing) => {
      const pickupRequests = allPickupRequests.filter(
        (req) => req.listingId === listing.id
      );
      const pendingCount = pickupRequests.filter((req) => req.status === "pending").length;

      return {
        ...listing,
        pendingPickupRequestsCount: pendingCount,
      };
    });
  }, [activeListings, allPickupRequests]);

  return {
    listings: listingsWithRequests,
    isLoading: isLoadingListings || isLoadingPickupRequests,
    isError,
  };
};
