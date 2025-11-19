import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/hooks/use-toast";
import { ratingService } from "@/api/services";
import { CreateRating, Rating } from "@/types";
import { ApiRequestError } from "@/shared/api/apiClient";
import { useTranslation } from "react-i18next";

/**
 * Query keys for ratings
 */
export const ratingKeys = {
  all: ['ratings'] as const,
  lists: () => [...ratingKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...ratingKeys.lists(), { filters }] as const,
  byTransaction: (transactionId: string) =>
    [...ratingKeys.all, 'transaction', transactionId] as const,
  byUser: (userId: string) => [...ratingKeys.all, 'user', userId] as const,
};

/**
 * Hook to fetch a rating for a specific transaction
 */
export const useRatingByTransaction = (transactionId: string, enabled = true) => {
  return useQuery<Rating | null>({
    queryKey: ratingKeys.byTransaction(transactionId),
    queryFn: async () => {
      try {
        return await ratingService.getByTransactionId(transactionId);
      } catch (error) {
        if (error instanceof ApiRequestError && error.statusCode === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!transactionId && enabled,
    retry: false, // Don't retry if 404 (no rating exists)
  });
};

/**
 * Hook to fetch all ratings for a user
 */
export const useRatingsByUser = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ratingKeys.byUser(userId),
    queryFn: () => ratingService.getByUserId(userId),
    enabled: !!userId && enabled,
  });
};

/**
 * Hook to create a new rating
 */
export const useCreateRating = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateRating) => ratingService.create(data),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ratingKeys.all });
      await queryClient.invalidateQueries({
        queryKey: ratingKeys.byTransaction(variables.transactionId),
      });
      toast({
        title: t('common.success'),
        description: t('listing.youRated'),
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
 * Hook to update a rating
 */
export const useUpdateRating = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ ratingId, data }: { ratingId: string; data: Partial<CreateRating> }) =>
      ratingService.update(ratingId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ratingKeys.all });
      toast({
        title: t('common.success'),
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
 * Hook to delete a rating
 */
export const useDeleteRating = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (ratingId: string) => ratingService.delete(ratingId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ratingKeys.all });
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
