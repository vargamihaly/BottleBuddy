import { apiClient } from "@/lib/apiClient";
import { PickupRequest, CreatePickupRequest } from "@/types";

export interface UpdatePickupRequestStatusRequest {
  Status: string;
}

export const pickupRequestService = {
  /**
   * Get all pickup requests for a specific listing
   */
  getByListingId: (listingId: string) =>
    apiClient.get<PickupRequest[]>(`/api/pickuprequests/listing/${listingId}`),

  /**
   * Get all pickup requests created by the current user (as volunteer)
   */
  getMyRequests: () =>
    apiClient.get<PickupRequest[]>('/api/pickuprequests/my-requests'),

  /**
   * Create a new pickup request
   */
  create: (data: CreatePickupRequest) =>
    apiClient.post<PickupRequest>('/api/pickuprequests', data),

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
