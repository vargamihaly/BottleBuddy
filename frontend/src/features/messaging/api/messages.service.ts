import {apiClient} from "@/shared/lib/apiClient";
import {Message} from "@/shared/types";

export interface SendMessagePayload {
    content?: string;
    image?: File | Blob;
}

export const messageService = {
    /**
     * Get all messages for a specific pickup request conversation
     */
    getByPickupRequestId: (pickupRequestId: string) =>
        apiClient.get<Message[]>(`/api/pickuprequests/${pickupRequestId}/messages`),

    /**
     * Send a message (supports optional image attachment)
     */
    sendMessage: (pickupRequestId: string, data: SendMessagePayload) => {
        const formData = new FormData();

        if (data.content) {
            formData.append('content', data.content);
        }

        if (data.image) {
            formData.append('image', data.image);
        }

        return apiClient.post<Message>(`/api/pickuprequests/${pickupRequestId}/messages`, formData);
    },

    /**
     * Mark messages as read
     */
    markAsRead: (pickupRequestId: string) =>
        apiClient.patch(`/api/pickuprequests/${pickupRequestId}/messages/mark-all-read`, {}),

    /**
     * Get unread message count for a specific conversation
     */
    getUnreadCount: (pickupRequestId: string) =>
        apiClient.get<number>(`/api/pickuprequests/${pickupRequestId}/messages/unread-count`),

    /**
     * Get total unread messages for the current user
     */
    getTotalUnreadCount: () =>
        apiClient.get<number>('/api/messages/unread-count'),

    /**
     * Mark a single message as read
     */
    markMessageAsRead: (messageId: string) =>
        apiClient.patch(`/api/messages/${messageId}/read`, {}),
};
