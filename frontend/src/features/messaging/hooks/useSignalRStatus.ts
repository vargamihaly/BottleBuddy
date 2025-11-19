import { useSignalR } from "./useSignalR";

/**
 * Hook to get the current SignalR connection status
 * Provides convenient boolean flags for different connection states
 */
export const useSignalRStatus = () => {
  const { isConnected, connectionError } = useSignalR();

  return {
    isConnected,
    hasError: !!connectionError,
    errorMessage: connectionError,
    isDisconnected: !isConnected && !connectionError,
    isReconnecting: !isConnected && !!connectionError,
  };
};
