import { apiClient } from "@/lib/apiClient";
import { Transaction } from "@/types";

// Backend wraps responses in { data: ... }
interface ApiResponse<T> {
  data: T;
}

export const transactionService = {
  /**
   * Get all transactions for the current user
   */
  getMyTransactions: async () => {
    const response = await apiClient.get<ApiResponse<Transaction[]>>('/api/transactions/my-transactions');
    return response.data;
  },

  /**
   * Get a transaction by pickup request ID
   */
  getByPickupRequestId: async (pickupRequestId: string) => {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/api/transactions/pickup-request/${pickupRequestId}`);
    return response.data;
  },

  /**
   * Get a transaction by ID
   */
  getById: async (transactionId: string) => {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/api/transactions/${transactionId}`);
    return response.data;
  },
};
