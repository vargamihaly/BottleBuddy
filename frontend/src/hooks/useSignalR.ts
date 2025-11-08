import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import config from "@/config";

const HUB_URL = `${config.api.baseUrl}/hubs/messages`;

export const useSignalR = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      setConnectionError("No authentication token found");
      return;
    }

    // Create a new SignalR connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => token,
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
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up event handlers
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

    // Start the connection
    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("SignalR connected successfully");
        setIsConnected(true);
        setConnectionError(null);
        setConnection(newConnection);
        connectionRef.current = newConnection;
      } catch (error) {
        console.error("SignalR connection failed:", error);
        setConnectionError(
          error instanceof Error ? error.message : "Failed to connect"
        );
        // Retry after 5 seconds
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        connectionRef.current
          .stop()
          .then(() => console.log("SignalR connection stopped"))
          .catch((err) => console.error("Error stopping SignalR:", err));
      }
    };
  }, []);

  return {
    connection,
    isConnected,
    connectionError,
  };
};
