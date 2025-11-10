import { apiClient } from "@/lib/apiClient";
import { PickupRequest, CreatePickupRequest } from "@/types";

export interface UpdatePickupRequestStatusRequest {
  Status: string;
}

// Backend wraps responses in { data: ... }
interface ApiResponse<T> {
  data: T;
}

export const pickupRequestService = {
  /**
   * Get all pickup requests for a specific listing
   * Note: This endpoint returns array directly, NOT wrapped in { data: ... }
   */
  getByListingId: async (listingId: string) => {
    return await apiClient.get<PickupRequest[]>(`/api/pickuprequests/listing/${listingId}`);
  },

  /**
   * Get all pickup requests created by the current user (as volunteer)
   * Note: This endpoint returns array directly, NOT wrapped in { data: ... }
   */
  getMyRequests: async () => {
    return await apiClient.get<PickupRequest[]>('/api/pickuprequests/my-requests');
  },

  /**
   * Create a new pickup request
   */
  create: async (data: CreatePickupRequest) => {
    const response = await apiClient.post<ApiResponse<PickupRequest>>('/api/pickuprequests', data);
    return response.data;
  },

  /**
   * Update the status of a pickup request
   */
  updateStatus: (requestId: string, status: string) =>
    apiClient.patch(`/api/pickuprequests/${requestId}/status`, { Status: status }),

  /**
   * Delete a pickup request
   */
  delete: (requestId: string) =>
    apiClient.delete(`/api/pickuprequests/${requestId}`),
};
