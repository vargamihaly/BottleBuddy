import { useEffect, useRef, useCallback, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface TypingUser {
  userId: string;
  timestamp: number;
}

interface UseTypingIndicatorOptions {
  pickupRequestId: string | null;
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  currentUserId: string | null;
}

const TYPING_DEBOUNCE_DELAY = 500; // Wait 500ms before sending typing status
const TYPING_TIMEOUT = 3000; // Auto-stop typing after 3 seconds of inactivity

export const useTypingIndicator = ({
  pickupRequestId,
  connection,
  isConnected,
  currentUserId,
}: UseTypingIndicatorOptions) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sendTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCurrentlyTypingRef = useRef(false);
  const typingUsersMapRef = useRef<Map<string, TypingUser>>(new Map());

  // Clean up typing users that have exceeded the timeout
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const updatedMap = new Map(typingUsersMapRef.current);
      let hasChanges = false;

      updatedMap.forEach((typingUser, userId) => {
        if (now - typingUser.timestamp > TYPING_TIMEOUT + 1000) {
          updatedMap.delete(userId);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        typingUsersMapRef.current = updatedMap;
        setTypingUsers(Array.from(updatedMap.keys()));
      }
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Listen for typing events from SignalR
  useEffect(() => {
    if (!connection || !isConnected || !pickupRequestId) {
      return;
    }

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      console.log("Received typing indicator:", data);

      // Don't show current user's typing status
      if (data.userId === currentUserId) {
        return;
      }

      const updatedMap = new Map(typingUsersMapRef.current);

      if (data.isTyping) {
        // Add user to typing list
        updatedMap.set(data.userId, {
          userId: data.userId,
          timestamp: Date.now(),
        });
      } else {
        // Remove user from typing list
        updatedMap.delete(data.userId);
      }

      typingUsersMapRef.current = updatedMap;
      setTypingUsers(Array.from(updatedMap.keys()));
    };

    connection.on("UserTyping", handleUserTyping);

    return () => {
      connection.off("UserTyping", handleUserTyping);
    };
  }, [connection, isConnected, pickupRequestId, currentUserId]);

  // Send typing indicator to SignalR
  const sendTypingIndicator = useCallback(
    async (isTyping: boolean) => {
      if (!connection || !isConnected || !pickupRequestId) {
        return;
      }

      try {
        await connection.invoke("SendTypingIndicator", pickupRequestId, isTyping);
        console.log(`Sent typing indicator: ${isTyping}`);
      } catch (error) {
        console.error("Error sending typing indicator:", error);
      }
    },
    [connection, isConnected, pickupRequestId]
  );

  // Start typing - debounced
  const startTyping = useCallback(() => {
    // Clear existing debounce timeout
    if (sendTypingTimeoutRef.current) {
      clearTimeout(sendTypingTimeoutRef.current);
    }

    // If not currently typing, wait for debounce delay before sending
    if (!isCurrentlyTypingRef.current) {
      sendTypingTimeoutRef.current = setTimeout(() => {
        isCurrentlyTypingRef.current = true;
        sendTypingIndicator(true);
      }, TYPING_DEBOUNCE_DELAY);
    }

    // Reset the auto-stop timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isCurrentlyTypingRef.current) {
        isCurrentlyTypingRef.current = false;
        sendTypingIndicator(false);
      }
    }, TYPING_TIMEOUT);
  }, [sendTypingIndicator]);

  // Stop typing - immediate
  const stopTyping = useCallback(() => {
    // Clear all timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (sendTypingTimeoutRef.current) {
      clearTimeout(sendTypingTimeoutRef.current);
      sendTypingTimeoutRef.current = null;
    }

    // Send stop typing if currently typing
    if (isCurrentlyTypingRef.current) {
      isCurrentlyTypingRef.current = false;
      sendTypingIndicator(false);
    }
  }, [sendTypingIndicator]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (sendTypingTimeoutRef.current) {
        clearTimeout(sendTypingTimeoutRef.current);
      }
      // Send stop typing on unmount if currently typing
      if (isCurrentlyTypingRef.current) {
        isCurrentlyTypingRef.current = false;
        if (connection && isConnected && pickupRequestId) {
          connection
            .invoke("SendTypingIndicator", pickupRequestId, false)
            .catch((err) => console.error("Error stopping typing on unmount:", err));
        }
      }
    };
  }, [connection, isConnected, pickupRequestId]);

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
};
