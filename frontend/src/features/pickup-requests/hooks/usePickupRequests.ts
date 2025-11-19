import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import { pickupRequestService } from "@/features/pickup-requests/api";
import { CreatePickupRequest } from "@/shared/types";
import { useTranslation } from "react-i18next";
import { ApiRequestError } from "@/shared/lib/apiClient";

/**
 * Query keys for pickup requests
 */
export const pickupRequestKeys = {
  all: ['pickupRequests'] as const,
  lists: () => [...pickupRequestKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...pickupRequestKeys.lists(), { filters }] as const,
  byListing: (listingId: string) => [...pickupRequestKeys.all, 'listing', listingId] as const,
  myRequests: () => [...pickupRequestKeys.all, 'my-requests'] as const,
};

/**
 * Hook to fetch pickup requests for a specific listing
 */
export const usePickupRequestsByListing = (listingId: string, enabled = true) => {
  return useQuery({
    queryKey: pickupRequestKeys.byListing(listingId),
    queryFn: () => pickupRequestService.getByListingId(listingId),
    enabled: !!listingId && enabled,
    staleTime: 30000, // 30 seconds - data is considered fresh for 30s
    refetchInterval: 60000, // Refetch every 60 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when network reconnects
  });
};

/**
 * Hook to fetch current user's pickup requests (as volunteer)
 */
export const useMyPickupRequests = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: pickupRequestKeys.myRequests(),
    queryFn: pickupRequestService.getMyRequests,
    enabled,
    staleTime: 30000, // 30 seconds - data is considered fresh for 30s
    refetchInterval: 60000, // Refetch every 60 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when network reconnects
  });
};

/**
 * Hook to create a new pickup request
 */
export const useCreatePickupRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreatePickupRequest) => pickupRequestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: ['bottleListings'] });
      toast({
        title: t('map.pickupRequestSent'),
        description: t('map.ownerNotified'),
      });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : error instanceof Error
          ? error.message
          : t('common.error');

      toast({
        title: t('common.error'),
        description,
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to update pickup request status
 */
export const useUpdatePickupRequestStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: string }) =>
      pickupRequestService.updateStatus(requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: ['bottleListings'] });
      toast({
        title: t('listing.updateSuccess'),
        description: t('listing.updateSuccess'),
      });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : error instanceof Error
          ? error.message
          : t('common.error');

      toast({
        title: t('common.error'),
        description,
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook to delete a pickup request
 */
export const useDeletePickupRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (requestId: string) => pickupRequestService.delete(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupRequestKeys.all });
      toast({
        title: t('common.success'),
        description: t('common.success'),
      });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : error instanceof Error
          ? error.message
          : t('common.error');

      toast({
        title: t('common.error'),
        description,
        variant: "destructive",
      });
    },
  });
};
