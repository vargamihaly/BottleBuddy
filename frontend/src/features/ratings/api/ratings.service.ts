import { apiClient } from "@/shared/api/apiClient";
import { Rating, CreateRating } from "@/types";

// Backend wraps responses in { data: ... }
interface ApiResponse<T> {
  data: T;
}

export const ratingService = {
  /**
   * Get a rating for a specific transaction
   * Note: Try without unwrapping first - backend might return object directly
   */
  getByTransactionId: async (transactionId: string) => {
    return await apiClient.get<Rating>(`/api/ratings/transaction/${transactionId}`);
  },

  /**
   * Get all ratings received by a user
   * Note: Try without unwrapping first - backend might return array directly
   */
  getByUserId: async (userId: string) => {
    return await apiClient.get<Rating[]>(`/api/ratings/user/${userId}`);
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
