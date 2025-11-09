import { apiClient } from "@/lib/apiClient";
import { Transaction } from "@/types";

export const transactionService = {
  /**
   * Get all transactions for the current user
   */
  getMyTransactions: () =>
    apiClient.get<Transaction[]>('/api/transactions/my-transactions'),

  /**
   * Get a transaction by pickup request ID
   */
  getByPickupRequestId: (pickupRequestId: string) =>
    apiClient.get<Transaction>(`/api/transactions/pickup-request/${pickupRequestId}`),

  /**
   * Get a transaction by ID
   */
  getById: (transactionId: string) =>
    apiClient.get<Transaction>(`/api/transactions/${transactionId}`),
};
