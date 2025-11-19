import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userSettingsService } from "@/features/user-profile/api/userSettings.service";
import { UpdateUserSettingsDto } from '@/types';
import { useAuth } from "@/shared/contexts/AuthContext";

export const userSettingsKeys = {
    all: ['userSettings'] as const,
    detail: () => [...userSettingsKeys.all, 'detail'] as const,
};

export const useUserSettings = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: userSettingsKeys.detail(),
        queryFn: () => userSettingsService.get(),
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpdateUserSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: UpdateUserSettingsDto) => userSettingsService.update(dto),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: userSettingsKeys.all });
        },
    });
};
