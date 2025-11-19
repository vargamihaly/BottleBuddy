import {apiClient} from "@/shared/lib/apiClient";
import {UserActivity, PaginationMetadata, UserActivityType, UserActivityCategory} from "@/shared/types";

export interface GetUserActivitiesParams {
    page?: number;
    pageSize?: number;
    isRead?: boolean;
    type?: UserActivityType;
    category?: UserActivityCategory;
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
        if (params?.category !== undefined) {
            searchParams.append('category', params.category);
        }
        if (params?.type !== undefined) {
            searchParams.append('type', params.type);
        }

        const queryString = searchParams.toString();
        const url = queryString ? `/api/useractivities?${queryString}` : '/api/useractivities';

        return await apiClient.get<UserActivityResponse>(url);
    },

    /**
     * Get count of unread activities
     */
    getUnreadCount: async (): Promise<number> => {
        const response = await apiClient.get<UnreadCountResponse>('/api/useractivities/unread-count');
        return response.data;
    },

    /**
     * Mark an activity as read
     */
    markAsRead: async (activityId: string): Promise<void> => {
        await apiClient.patch(`/api/useractivities/${activityId}/mark-read`);
    },

    /**
     * Mark all activities as read
     */
    markAllAsRead: async (): Promise<void> => {
        await apiClient.patch('/api/useractivities/mark-all-read');
    },

    /**
     * Delete an activity
     */
    delete: async (activityId: string): Promise<void> => {
        await apiClient.delete(`/api/useractivities/${activityId}`);
    }
};
