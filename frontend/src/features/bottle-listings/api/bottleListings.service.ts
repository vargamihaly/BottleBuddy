import { apiClient } from "@/shared/api/apiClient";
import { BottleListing, ListingStatus, PaginationMetadata } from "@/types";

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
  status?: 'open' | 'claimed' | 'completed';
}

export interface GetBottleListingsParams {
  page?: number;
  pageSize?: number;
  status?: ListingStatus;
}

// Backend wraps responses in { data: ..., pagination: ... }
interface ApiResponse<T> {
  data: T;
}

interface PaginatedApiResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export const bottleListingService = {
  /**
   * Get all bottle listings with optional pagination and filtering
   */
  getAll: async (params?: GetBottleListingsParams) => {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params?.pageSize !== undefined) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.status !== undefined) {
      searchParams.append('status', params.status);
    }

    const url = `/api/bottlelistings${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await apiClient.get<PaginatedApiResponse<BottleListing>>(url);

    return {
      data: response.data,
      pagination: response.pagination
    };
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
