import { useEffect, useRef, useCallback, useState } from "react";

import { useSignalRContext } from "@/contexts/SignalRContext";

interface TypingUser {
  userId: string;
  timestamp: number;
}

interface UseTypingIndicatorOptions {
  pickupRequestId: string | null;
  currentUserId: string | null;
}

const TYPING_DEBOUNCE_DELAY = 500;
const TYPING_TIMEOUT = 3000;

export const useTypingIndicator = ({
  pickupRequestId,
  currentUserId,
}: UseTypingIndicatorOptions) => {
  const { connection, isConnected } = useSignalRContext();
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

  useEffect(() => {
    if (!connection || !isConnected || !pickupRequestId) {
      return;
    }

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      console.log("Received typing indicator:", data);

      if (data.userId === currentUserId) {
        return;
      }

      const updatedMap = new Map(typingUsersMapRef.current);

      if (data.isTyping) {
        updatedMap.set(data.userId, {
          userId: data.userId,
          timestamp: Date.now(),
        });
      } else {
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

  const startTyping = useCallback(() => {
    if (sendTypingTimeoutRef.current) {
      clearTimeout(sendTypingTimeoutRef.current);
    }

    if (!isCurrentlyTypingRef.current) {
      sendTypingTimeoutRef.current = setTimeout(() => {
        isCurrentlyTypingRef.current = true;
        sendTypingIndicator(true);
      }, TYPING_DEBOUNCE_DELAY);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isCurrentlyTypingRef.current) {
        isCurrentlyTypingRef.current = false;
        sendTypingIndicator(false);
      }
    }, TYPING_TIMEOUT);
  }, [sendTypingIndicator]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (sendTypingTimeoutRef.current) {
      clearTimeout(sendTypingTimeoutRef.current);
      sendTypingTimeoutRef.current = null;
    }

    if (isCurrentlyTypingRef.current) {
      isCurrentlyTypingRef.current = false;
      sendTypingIndicator(false);
    }
  }, [sendTypingIndicator]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (sendTypingTimeoutRef.current) {
        clearTimeout(sendTypingTimeoutRef.current);
      }
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
