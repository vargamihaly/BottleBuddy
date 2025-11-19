import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useToast} from "@/shared/hooks/use-toast";
import {notificationPreferencesService} from "@/features/notifications/api";
import {UpdateNotificationPreferences} from "@/shared/types";
import {useTranslation} from "react-i18next";
import {ApiRequestError} from "@/shared/lib/apiClient";

/**
 * Query keys for notification preferences
 */
export const notificationPreferencesKeys = {
    all: ['notificationPreferences'] as const,
    detail: () => [...notificationPreferencesKeys.all, 'detail'] as const,
};

/**
 * Hook to fetch notification preferences
 */
export const useNotificationPreferences = () => {
    return useQuery({
        queryKey: notificationPreferencesKeys.detail(),
        queryFn: () => notificationPreferencesService.get(),
        staleTime: 60000, // 1 minute - preferences don't change often
    });
};

/**
 * Hook to update notification preferences
 */
export const useUpdateNotificationPreferences = () => {
    const queryClient = useQueryClient();
    const {toast} = useToast();
    const {t} = useTranslation();

    return useMutation({
        mutationFn: (preferences: UpdateNotificationPreferences) =>
            notificationPreferencesService.update(preferences),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: notificationPreferencesKeys.all});
            toast({
                title: t('settings.preferences.updateSuccess', {
                    defaultValue: 'Preferences updated successfully'
                }),
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
