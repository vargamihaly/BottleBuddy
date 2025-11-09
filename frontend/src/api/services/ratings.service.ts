import { apiClient } from "@/lib/apiClient";
import { Rating, CreateRating } from "@/types";

// Backend wraps responses in { data: ... }
interface ApiResponse<T> {
  data: T;
}

export const ratingService = {
  /**
   * Get a rating for a specific transaction
   */
  getByTransactionId: async (transactionId: string) => {
    const response = await apiClient.get<ApiResponse<Rating>>(`/api/ratings/transaction/${transactionId}`);
    return response.data;
  },

  /**
   * Get all ratings received by a user
   */
  getByUserId: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<Rating[]>>(`/api/ratings/user/${userId}`);
    return response.data;
  },

  /**
   * Create a new rating
   */
  create: async (data: CreateRating) => {
    const response = await apiClient.post<ApiResponse<Rating>>('/api/ratings', data);
    return response.data;
  },

  /**
   * Update an existing rating
   */
  update: async (ratingId: string, data: Partial<CreateRating>) => {
    const response = await apiClient.patch<ApiResponse<Rating>>(`/api/ratings/${ratingId}`, data);
    return response.data;
  },

  /**
   * Delete a rating
   */
  delete: (ratingId: string) =>
    apiClient.delete(`/api/ratings/${ratingId}`),
};
