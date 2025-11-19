import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useToast} from "@/shared/hooks/use-toast";
import {
    bottleListingService,
    CreateBottleListingRequest,
    GetBottleListingsParams,
    UpdateBottleListingRequest
} from "@/api/services";
import {useTranslation} from "react-i18next";
import {ApiRequestError} from "@/shared/api/apiClient";

/**
 * Query keys for bottle listings
 */
export const bottleListingKeys = {
    all: ['bottleListings'] as const,
    lists: () => [...bottleListingKeys.all, 'list'] as const,
    list: (params?: GetBottleListingsParams) => [...bottleListingKeys.lists(), {params}] as const,
    details: () => [...bottleListingKeys.all, 'detail'] as const,
    detail: (id: string) => [...bottleListingKeys.details(), id] as const,
};

/**
 * Hook to fetch all bottle listings with optional pagination and filtering
 */
export const useBottleListings = (params?: GetBottleListingsParams) => {
    return useQuery({
        queryKey: bottleListingKeys.list(params),
        queryFn: () => bottleListingService.getAll(params),
        staleTime: 30000, // 30 seconds - data is considered fresh for 30s
        refetchInterval: 60000, // Refetch every 60 seconds
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnReconnect: true, // Refetch when network reconnects
        select: (data) => data.data, // Extract just the data array for backward compatibility
    });
};

/**
 * Hook to fetch all bottle listings with pagination metadata
 */
export const useBottleListingsPaginated = (params?: GetBottleListingsParams) => {
    return useQuery({
        queryKey: bottleListingKeys.list(params),
        queryFn: () => bottleListingService.getAll(params),
        staleTime: 30000, // 30 seconds - data is considered fresh for 30s
        refetchInterval: 60000, // Refetch every 60 seconds
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnReconnect: true, // Refetch when network reconnects
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
 * Note: This fetches all listings and filters them client-side
 * The filtering is done in the component using user?.email
 */
export const useMyBottleListings = ({enabled = true}: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: bottleListingKeys.list(), // Use same cache as getAll
        queryFn: () => bottleListingService.getAll(),
        enabled,
        staleTime: 30000, // 30 seconds - data is considered fresh for 30s
        refetchInterval: 60000, // Refetch every 60 seconds
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnReconnect: true, // Refetch when network reconnects
        select: (data) => data.data, // Extract just the data array for backward compatibility
    });
};

/**
 * Hook to create a new bottle listing
 */
export const useCreateBottleListing = () => {
    const queryClient = useQueryClient();
    const {toast} = useToast();
    const {t} = useTranslation();

    return useMutation({
        mutationFn: (data: CreateBottleListingRequest) => bottleListingService.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: bottleListingKeys.all});
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
    const {toast} = useToast();
    const {t} = useTranslation();

    return useMutation({
        mutationFn: ({id, data}: { id: string; data: UpdateBottleListingRequest }) =>
            bottleListingService.update(id, data),
        onSuccess: async (_, {id}) => {
            await queryClient.invalidateQueries({queryKey: bottleListingKeys.all});
            await queryClient.invalidateQueries({queryKey: bottleListingKeys.detail(id)});
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
    const {toast} = useToast();
    const {t} = useTranslation();

    return useMutation({
        mutationFn: (id: string) => bottleListingService.delete(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: bottleListingKeys.all});
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
