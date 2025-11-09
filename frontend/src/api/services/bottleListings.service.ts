import { apiClient } from "@/lib/apiClient";
import { BottleListing } from "@/types";

export interface CreateBottleListingRequest {
  title?: string;
  bottleCount: number;
  locationAddress: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  estimatedRefund: number;
  splitPercentage: number;
  pickupDeadline?: string;
}

export interface UpdateBottleListingRequest extends Partial<CreateBottleListingRequest> {
  status?: 'open' | 'claimed' | 'completed' | 'cancelled';
}

export const bottleListingService = {
  /**
   * Get all bottle listings
   */
  getAll: () =>
    apiClient.get<BottleListing[]>('/api/bottlelistings'),

  /**
   * Get a single bottle listing by ID
   */
  getById: (id: string) =>
    apiClient.get<BottleListing>(`/api/bottlelistings/${id}`),

  /**
   * Create a new bottle listing
   */
  create: (data: CreateBottleListingRequest) =>
    apiClient.post<BottleListing>('/api/bottlelistings', data),

  /**
   * Update an existing bottle listing
   */
  update: (id: string, data: UpdateBottleListingRequest) =>
    apiClient.patch<BottleListing>(`/api/bottlelistings/${id}`, data),

  /**
   * Delete a bottle listing
   */
  delete: (id: string) =>
    apiClient.delete(`/api/bottlelistings/${id}`),

  /**
   * Get listings created by the current user
   */
  getMyListings: () =>
    apiClient.get<BottleListing[]>('/api/bottlelistings/my-listings'),
};
