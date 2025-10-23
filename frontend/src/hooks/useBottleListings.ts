import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { BottleListing, PaginatedResponse, PickupRequest } from "@/types";
import { apiClient } from "@/lib/apiClient";

const fetchBottleListings = async (): Promise<BottleListing[]> => {
  const response = await apiClient.get<PaginatedResponse<BottleListing>>('/api/bottlelistings');
  return response.data;
};

const fetchMyPickupRequests = async (): Promise<PickupRequest[]> => {
  const response = await apiClient.get<PickupRequest[]>('/api/pickuprequests/my-requests');
  return response;
};

export const useBottleListings = () => {
  const { user } = useAuth();

  const {
    data: bottleListings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bottleListings"],
    queryFn: fetchBottleListings
  });

  const {
    data: myPickupRequests = [],
  } = useQuery({
    queryKey: ["myPickupRequests"],
    queryFn: fetchMyPickupRequests,
    enabled: !!user
  });

  // Separate user's own listings from others (exclude completed ones from homepage)
  const myListings = bottleListings.filter(
    listing => listing.createdByUserEmail === user?.email && listing.status !== 'completed'
  );

  // Get IDs of listings with active pickup requests (pending or accepted) by this user
  const activePickupRequestListingIds = myPickupRequests
    .filter(request => request.status === 'pending' || request.status === 'accepted')
    .map(request => request.listingId);

  // Get IDs of listings with completed pickup requests by this user
  const completedPickupRequestListingIds = myPickupRequests
    .filter(request => request.status === 'completed')
    .map(request => request.listingId);

  // Listings where user has active pickup requests (pending or accepted)
  const myPickupTaskListings = bottleListings.filter(
    listing => listing.createdByUserEmail !== user?.email && activePickupRequestListingIds.includes(listing.id)
  );

  // Listings where user has completed pickup requests
  const myCompletedPickupTaskListings = bottleListings.filter(
    listing => listing.createdByUserEmail !== user?.email && completedPickupRequestListingIds.includes(listing.id)
  );

  // Available listings (exclude own, exclude with active pickup requests, exclude completed)
  const availableListings = bottleListings.filter(
    listing => listing.createdByUserEmail !== user?.email && !activePickupRequestListingIds.includes(listing.id) && listing.status !== 'completed',
  );

  return {
    bottleListings,
    myListings,
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    availableListings,
    myPickupRequests,
    isLoading,
    isError,
  };
};