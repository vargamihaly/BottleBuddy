import {apiClient} from "@/shared/lib/apiClient";
import {UpdateUserSettingsDto, UserSettings} from "@/shared/types";

interface UserSettingsResponse {
    data: UserSettings;
}

export const userSettingsService = {
    /**
     * Get current user's settings (auto-creates if doesn't exist)
     */
    get: async (): Promise<UserSettings> => {
        const response = await apiClient.get<UserSettingsResponse>('/api/user-settings');
        return response.data;
    },

    /**
     * Update current user's settings (partial update)
     */
    update: async (dto: UpdateUserSettingsDto): Promise<UserSettings> => {
        const response = await apiClient.patch<UserSettingsResponse>('/api/user-settings', dto);
        return response.data;
    }
};
