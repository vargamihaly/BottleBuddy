import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  userActivityService,
  GetUserActivitiesParams
} from "@/api/services/userActivity.service";
import { useTranslation } from "react-i18next";
import { ApiRequestError } from "@/lib/apiClient";

/**
 * Query keys for user activities
 */
export const userActivityKeys = {
  all: ['userActivities'] as const,
  lists: () => [...userActivityKeys.all, 'list'] as const,
  list: (params?: GetUserActivitiesParams) => [...userActivityKeys.lists(), { params }] as const,
  unreadCount: () => [...userActivityKeys.all, 'unreadCount'] as const,
};

/**
 * Hook to fetch user activities with optional pagination and filtering
 */
export const useUserActivities = (params?: GetUserActivitiesParams, options?: { enabled?: boolean; refetchInterval?: number }) => {
  return useQuery({
    queryKey: userActivityKeys.list(params),
    queryFn: () => userActivityService.getAll(params),
    staleTime: 30000, // 30 seconds - data is considered fresh for 30s
    refetchInterval: options?.refetchInterval ?? 30000, // Default 30 seconds
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when network reconnects
    enabled: options?.enabled ?? true,
  });
};

/**
 * Hook to fetch unread activity count
 */
export const useUnreadActivityCount = () => {
  return useQuery({
    queryKey: userActivityKeys.unreadCount(),
    queryFn: () => userActivityService.getUnreadCount(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every 60 seconds
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

/**
 * Hook to mark an activity as read
 */
export const useMarkActivityAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (activityId: string) => userActivityService.markAsRead(activityId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userActivityKeys.all });
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
 * Hook to mark all activities as read
 */
export const useMarkAllActivitiesAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: () => userActivityService.markAllAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userActivityKeys.all });
      toast({
        title: t('activities.markAllAsReadSuccess', { defaultValue: 'All activities marked as read' }),
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
 * Hook to delete an activity
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (activityId: string) => userActivityService.delete(activityId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userActivityKeys.all });
      toast({
        title: t('activities.deleteSuccess', { defaultValue: 'Activity deleted' }),
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
