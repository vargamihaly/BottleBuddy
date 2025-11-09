import { apiClient } from "@/lib/apiClient";
import { Message } from "@/types";

export const messageService = {
  /**
   * Get all messages for a specific pickup request conversation
   */
  getByPickupRequestId: (pickupRequestId: string) =>
    apiClient.get<Message[]>(`/api/messages/pickup-request/${pickupRequestId}`),

  /**
   * Send a text message
   */
  sendMessage: (pickupRequestId: string, content: string) =>
    apiClient.post<Message>(`/api/messages/pickup-request/${pickupRequestId}`, { content }),

  /**
   * Send a message with an image
   */
  sendImageMessage: (pickupRequestId: string, formData: FormData) =>
    apiClient.post<Message>(
      `/api/messages/pickup-request/${pickupRequestId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  /**
   * Mark messages as read
   */
  markAsRead: (pickupRequestId: string) =>
    apiClient.post(`/api/messages/pickup-request/${pickupRequestId}/mark-read`, {}),

  /**
   * Get unread message count for a specific conversation
   */
  getUnreadCount: (pickupRequestId: string) =>
    apiClient.get<number>(`/api/messages/pickup-request/${pickupRequestId}/unread-count`),
};
