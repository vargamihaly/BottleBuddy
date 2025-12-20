import {useMemo} from "react";
import {useAuth} from "@/contexts/AuthContext";
import {useMyBottleListings} from "@/features/listings/hooks";
import {useQuery} from "@tanstack/react-query";
import {pickupRequestService} from "@/features/pickup-requests/api";
import {BottleListing, ListingStats, PickupRequest} from "@/shared/types";
import {useMyTransactions} from "@/features/dashboard/hooks";

/**
 * Extended bottle listing with pickup requests
 */
export interface BottleListingWithRequests extends BottleListing {
    pickupRequests: PickupRequest[];
    pendingRequests: number;
}

/**
 * Custom hook for MyListings page
 * Fetches user's listings, enriches them with pickup requests, and calculates stats
 */
export const useMyListingsEnhanced = () => {
    const {user} = useAuth();

    // 1. Fetch all user's listings
    const {
        data: allListings = [],
        isLoading: isLoadingListings,
        isError,
    } = useMyBottleListings({enabled: !!user});

    // 2. Filter to user's own listings
    const myListings = useMemo(
        () => allListings.filter((listing) => listing.createdByUserEmail === user?.email),
        [allListings, user?.email]
    );

    // 3. Extract listing IDs
    const myListingIds = useMemo(
        () => myListings.map((listing) => listing.id),
        [myListings]
    );

    // 4. Fetch all pickup requests for user's listings in parallel
    const {data: allPickupRequests = [], isLoading: isLoadingPickupRequests} = useQuery({
        queryKey: ['pickupRequests', 'listings', myListingIds],
        queryFn: async () => {
            if (myListingIds.length === 0) return [];

            // Fetch pickup requests for all listings in parallel
            const requests = await Promise.all(
                myListingIds.map((id) => pickupRequestService.getByListingId(id))
            );

            // Flatten the results and tag each request with its listing ID
            return requests.flatMap((reqs, index) =>
                reqs.map((req) => ({...req, listingId: myListingIds[index]}))
            );
        },
        enabled: !!user && myListingIds.length > 0,
        staleTime: 30000, // 30 seconds
        refetchInterval: 60000, // Refetch every 60 seconds
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });

    // 5. Fetch transactions for earnings calculation
    const {data: transactions = []} = useMyTransactions();

    // 6. Enrich listings with pickupRequests
    const listingsWithRequests: BottleListingWithRequests[] = useMemo(() => {
        return myListings.map((listing) => {
            const pickupRequestsForListing = allPickupRequests.filter(
                (req: any) => req.listingId === listing.id
            );
            const pendingCount = pickupRequestsForListing.filter((req: any) => req.status === "pending").length;

            return {
                ...listing,
                pickupRequests: pickupRequestsForListing,
                pendingRequests: pendingCount,
            };
        });
    }, [myListings, allPickupRequests]);

    // 7. Calculate stats
    const stats: ListingStats = useMemo(() => {
        const totalActive = myListings.filter((l) => l.status === "open").length;

        const pendingRequests = allPickupRequests.filter(
            (r: any) => r.status === "pending"
        ).length;

        const totalEarnings = transactions.reduce(
            (sum, t) => sum + (t.ownerAmount || 0),
            0
        );

        const completedPickups = transactions.filter(
            (t) => t.status === "completed"
        ).length;

        return {
            totalActive,
            pendingRequests,
            totalEarnings,
            completedPickups,
        };
    }, [myListings, allPickupRequests, transactions]);

    return {
        listings: listingsWithRequests,
        stats,
        isLoading: isLoadingListings || isLoadingPickupRequests,
        isError,
    };
};