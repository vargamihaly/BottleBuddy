import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as signalR from "@microsoft/signalr";

import config from "@/config";
import { useAuth } from "@/contexts/AuthContext";

interface SignalRContextValue {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  connectionError: string | null;
}

const SignalRContext = createContext<SignalRContextValue | undefined>(undefined);

const HUB_URL = `${config.api.baseUrl}/hubs/messages`;

/**
 * Creates a SignalR connection with proper configuration
 * Always fetches the latest token to handle token refresh scenarios
 */
const createSignalRConnection = (initialToken: string) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => {
        // Always get the latest token from localStorage to handle token refresh
        return localStorage.getItem("token") || initialToken || "";
      },
      withCredentials: false,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Custom retry delays: 0s, 2s, 10s, 30s, then 60s
        if (retryContext.previousRetryCount === 0) return 0;
        if (retryContext.previousRetryCount === 1) return 2000;
        if (retryContext.previousRetryCount === 2) return 10000;
        if (retryContext.previousRetryCount === 3) return 30000;
        return 60000;
      },
    })
    .configureLogging(
      import.meta.env.DEV
        ? signalR.LogLevel.Information
        : signalR.LogLevel.Warning
    )
    .build();
};

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const cleanupConnection = () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      isStartingRef.current = false;

      const currentConnection = connectionRef.current;

      if (currentConnection) {
        currentConnection
          .stop()
          .then(() => console.log("SignalR connection stopped"))
          .catch((error) => console.error("Error stopping SignalR:", error));
      }

      connectionRef.current = null;

      if (isMounted) {
        setConnection(null);
        setIsConnected(false);
      }
    };

    if (!token) {
      setConnectionError("No authentication token found");
      cleanupConnection();
      return () => {
        isMounted = false;
      };
    }

    setConnectionError(null);

    const newConnection = createSignalRConnection(token);

    connectionRef.current = newConnection;
    setConnection(newConnection);

    newConnection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
      setIsConnected(false);
      setConnectionError("Connection lost, attempting to reconnect...");
    });

    newConnection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      setIsConnected(true);
      setConnectionError(null);
    });

    newConnection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      setIsConnected(false);
      if (error) {
        setConnectionError(`Connection closed: ${error.message}`);
      }
    });

    const startConnection = async () => {
      if (!connectionRef.current || isStartingRef.current) {
        return;
      }

      isStartingRef.current = true;
      try {
        await connectionRef.current.start();
        if (!isMounted) {
          return;
        }
        console.log("SignalR connected successfully");
        setIsConnected(true);
        setConnectionError(null);
      } catch (error) {
        console.error("SignalR connection failed:", error);
        if (!isMounted) {
          return;
        }
        setConnectionError(
          error instanceof Error ? error.message : "Failed to connect"
        );
        retryTimeoutRef.current = setTimeout(() => {
          isStartingRef.current = false;
          startConnection();
        }, 5000);
        return;
      }
      isStartingRef.current = false;
    };

    startConnection();

    return () => {
      isMounted = false;
      cleanupConnection();
    };
  }, [token]);

  const value = useMemo(
    () => ({ connection, isConnected, connectionError }),
    [connection, isConnected, connectionError]
  );

  return (
    <SignalRContext.Provider value={value}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
};

export { SignalRContext };
