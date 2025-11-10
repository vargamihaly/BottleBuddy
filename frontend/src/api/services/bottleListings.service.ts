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

// Backend wraps responses in { data: ... }
interface ApiResponse<T> {
  data: T;
}

export const bottleListingService = {
  /**
   * Get all bottle listings
   */
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<BottleListing[]>>('/api/bottlelistings');
    return response.data;
  },

  /**
   * Get a single bottle listing by ID
   */
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<BottleListing>>(`/api/bottlelistings/${id}`);
    return response.data;
  },

  /**
   * Create a new bottle listing
   */
  create: async (data: CreateBottleListingRequest) => {
    const response = await apiClient.post<ApiResponse<BottleListing>>('/api/bottlelistings', data);
    return response.data;
  },

  /**
   * Update an existing bottle listing
   */
  update: async (id: string, data: UpdateBottleListingRequest) => {
    const response = await apiClient.patch<ApiResponse<BottleListing>>(`/api/bottlelistings/${id}`, data);
    return response.data;
  },

  /**
   * Delete a bottle listing
   */
  delete: (id: string) =>
    apiClient.delete(`/api/bottlelistings/${id}`),
};
