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
   */
  getByListingId: async (listingId: string) => {
    const response = await apiClient.get<ApiResponse<PickupRequest[]>>(`/api/pickuprequests/listing/${listingId}`);
    return response.data;
  },

  /**
   * Get all pickup requests created by the current user (as volunteer)
   */
  getMyRequests: async () => {
    const response = await apiClient.get<ApiResponse<PickupRequest[]>>('/api/pickuprequests/my-requests');
    return response.data;
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
