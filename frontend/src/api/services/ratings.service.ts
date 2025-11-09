import { apiClient } from "@/lib/apiClient";
import { Rating, CreateRating } from "@/types";

export const ratingService = {
  /**
   * Get a rating for a specific transaction
   */
  getByTransactionId: (transactionId: string) =>
    apiClient.get<Rating>(`/api/ratings/transaction/${transactionId}`),

  /**
   * Get all ratings received by a user
   */
  getByUserId: (userId: string) =>
    apiClient.get<Rating[]>(`/api/ratings/user/${userId}`),

  /**
   * Create a new rating
   */
  create: (data: CreateRating) =>
    apiClient.post<Rating>('/api/ratings', data),

  /**
   * Update an existing rating
   */
  update: (ratingId: string, data: Partial<CreateRating>) =>
    apiClient.patch<Rating>(`/api/ratings/${ratingId}`, data),

  /**
   * Delete a rating
   */
  delete: (ratingId: string) =>
    apiClient.delete(`/api/ratings/${ratingId}`),
};
