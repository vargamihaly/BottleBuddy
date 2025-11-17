import { apiClient } from "@/lib/apiClient";
import { UserActivity, PaginationMetadata } from "@/types";

export interface GetUserActivitiesParams {
  page?: number;
  pageSize?: number;
  isRead?: boolean;
}

interface UserActivityResponse {
  data: UserActivity[];
  pagination: PaginationMetadata;
}

interface UnreadCountResponse {
  data: number;
}

export const userActivityService = {
  /**
   * Get user activities with optional pagination and filtering
   */
  getAll: async (params?: GetUserActivitiesParams): Promise<UserActivityResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.pageSize !== undefined) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.isRead !== undefined) {
      searchParams.append('isRead', params.isRead.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/useractivities?${queryString}` : '/useractivities';

    const response = await apiClient.get<UserActivityResponse>(url);
    return response.data;
  },

  /**
   * Get count of unread activities
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<UnreadCountResponse>('/useractivities/unread-count');
    return response.data.data;
  },

  /**
   * Mark an activity as read
   */
  markAsRead: async (activityId: string): Promise<void> => {
    await apiClient.patch(`/useractivities/${activityId}/mark-read`);
  },

  /**
   * Mark all activities as read
   */
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/useractivities/mark-all-read');
  },

  /**
   * Delete an activity
   */
  delete: async (activityId: string): Promise<void> => {
    await apiClient.delete(`/useractivities/${activityId}`);
  }
};
