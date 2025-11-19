import {useQuery} from "@tanstack/react-query";
import {transactionService} from "@/features/dashboard/api";
import {ApiRequestError} from "@/shared/lib/apiClient";
import {Transaction} from "@/shared/types";

/**
 * Query keys for transactions
 */
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...transactionKeys.lists(), { filters }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  byPickupRequest: (pickupRequestId: string) =>
    [...transactionKeys.all, 'pickup-request', pickupRequestId] as const,
  myTransactions: () => [...transactionKeys.all, 'my-transactions'] as const,
};

/**
 * Hook to fetch current user's transactions
 */
export const useMyTransactions = () => {
  return useQuery({
    queryKey: transactionKeys.myTransactions(),
    queryFn: transactionService.getMyTransactions,
  });
};

/**
 * Hook to fetch a transaction by pickup request ID
 */
export const useTransactionByPickupRequest = (pickupRequestId: string, enabled = true) => {
  return useQuery<Transaction | null>({
    queryKey: transactionKeys.byPickupRequest(pickupRequestId),
    queryFn: async () => {
      try {
        return await transactionService.getByPickupRequestId(pickupRequestId);
      } catch (error) {
        if (error instanceof ApiRequestError && error.statusCode === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!pickupRequestId && enabled,
  });
};

/**
 * Hook to fetch a transaction by ID
 */
export const useTransaction = (transactionId: string, enabled = true) => {
  return useQuery({
    queryKey: transactionKeys.detail(transactionId),
    queryFn: () => transactionService.getById(transactionId),
    enabled: !!transactionId && enabled,
  });
};
