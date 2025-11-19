import { useAuth } from "@/shared/contexts/AuthContext";
import { useBottleListings } from "./useBottleListings";
import { useMemo } from "react";

/**
 * Hook that filters bottle listings to show only the current user's listings
 * Excludes completed listings from the view
 */
export const useMyListings = () => {
  const { user } = useAuth();
  const {
    data: bottleListings,
    isLoading,
    isError,
  } = useBottleListings();

  // Ensure we have an array (fallback if API fails)
  const safeBottleListings = Array.isArray(bottleListings) ? bottleListings : [];

  // Filter to only user's own listings (exclude completed ones)
  const myListings = useMemo(() => {
    return safeBottleListings.filter(
      listing => listing.createdByUserEmail === user?.email && listing.status !== 'completed'
    );
  }, [safeBottleListings, user?.email]);

  return {
    myListings,
    isLoading,
    isError,
  };
};
