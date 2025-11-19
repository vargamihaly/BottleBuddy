import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {userSettingsService} from '@/features/notifications/api';
import {UpdateUserSettingsDto} from '@/shared/types';
import {useAuth} from '@/contexts/AuthContext';

export const userSettingsKeys = {
    all: ['userSettings'] as const,
    detail: () => [...userSettingsKeys.all, 'detail'] as const,
};

export const useUserSettings = () => {
    const {user} = useAuth();

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
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: userSettingsKeys.all});
        },
    });
};
