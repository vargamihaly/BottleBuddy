import { apiClient } from "@/shared/lib/apiClient";
import { NotificationPreferences, UpdateNotificationPreferences } from "@/shared/types";

interface NotificationPreferencesResponse {
  data: NotificationPreferences;
}

export const notificationPreferencesService = {
  /**
   * Get user's notification preferences (auto-creates if not exists)
   */
  get: async (): Promise<NotificationPreferences> => {
    const response = await apiClient.get<NotificationPreferencesResponse>('/notification-preferences');
    return response.data.data;
  },

  /**
   * Update user's notification preferences
   */
  update: async (preferences: UpdateNotificationPreferences): Promise<NotificationPreferences> => {
    const response = await apiClient.patch<NotificationPreferencesResponse>('/notification-preferences', preferences);
    return response.data.data;
  }
};
