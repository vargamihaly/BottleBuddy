import { apiClient } from "@/lib/apiClient";
import { Transaction } from "@/types";

export const transactionService = {
  /**
   * Get all transactions for the current user
   * Note: Try without unwrapping first - backend might return array directly
   */
  getMyTransactions: async () => {
    return await apiClient.get<Transaction[]>('/api/transactions/my-transactions');
  },

  /**
   * Get a transaction by pickup request ID
   * Note: Try without unwrapping first - backend might return object directly
   */
  getByPickupRequestId: async (pickupRequestId: string) => {
    return await apiClient.get<Transaction>(`/api/transactions/pickup-request/${pickupRequestId}`);
  },

  /**
   * Get a transaction by ID
   * Note: Try without unwrapping first - backend might return object directly
   */
  getById: async (transactionId: string) => {
    return await apiClient.get<Transaction>(`/api/transactions/${transactionId}`);
  },
};
