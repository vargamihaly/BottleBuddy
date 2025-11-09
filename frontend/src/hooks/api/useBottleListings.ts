import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  bottleListingService,
  CreateBottleListingRequest,
  UpdateBottleListingRequest
} from "@/api/services";
import { useTranslation } from "react-i18next";
import { ApiRequestError } from "@/lib/apiClient";

/**
 * Query keys for bottle listings
 */
export const bottleListingKeys = {
  all: ['bottleListings'] as const,
  lists: () => [...bottleListingKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...bottleListingKeys.lists(), { filters }] as const,
  details: () => [...bottleListingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bottleListingKeys.details(), id] as const,
  myListings: () => [...bottleListingKeys.all, 'my-listings'] as const,
};

/**
 * Hook to fetch all bottle listings
 */
export const useBottleListings = () => {
  return useQuery({
    queryKey: bottleListingKeys.list(),
    queryFn: bottleListingService.getAll,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch a single bottle listing by ID
 */
export const useBottleListing = (id: string) => {
  return useQuery({
    queryKey: bottleListingKeys.detail(id),
    queryFn: () => bottleListingService.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch current user's bottle listings
 */
export const useMyBottleListings = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: bottleListingKeys.myListings(),
    queryFn: bottleListingService.getMyListings,
    enabled,
  });
};

/**
 * Hook to create a new bottle listing
 */
export const useCreateBottleListing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateBottleListingRequest) => bottleListingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bottleListingKeys.all });
      toast({
        title: t('listing.createSuccess'),
        description: t('listing.createSuccess'),
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
 * Hook to update a bottle listing
 */
export const useUpdateBottleListing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBottleListingRequest }) =>
      bottleListingService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: bottleListingKeys.all });
      queryClient.invalidateQueries({ queryKey: bottleListingKeys.detail(id) });
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
 * Hook to delete a bottle listing
 */
export const useDeleteBottleListing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: string) => bottleListingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bottleListingKeys.all });
      toast({
        title: t('listing.deleteSuccess'),
        description: t('listing.deleteSuccess'),
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
