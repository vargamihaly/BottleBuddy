import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Message, CreateMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";

const fetchMessages = async (pickupRequestId: string): Promise<Message[]> => {
  const response = await apiClient.get<Message[]>(
    `/api/pickuprequests/${pickupRequestId}/messages`
  );
  return response;
};

const sendMessage = async (
  pickupRequestId: string,
  data: CreateMessage
): Promise<Message> => {
  // Create FormData for multipart/form-data upload
  const formData = new FormData();

  if (data.content) {
    formData.append("content", data.content);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await apiClient.post<Message>(
    `/api/pickuprequests/${pickupRequestId}/messages`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response;
};

const markAllAsRead = async (pickupRequestId: string): Promise<void> => {
  await apiClient.patch(
    `/api/pickuprequests/${pickupRequestId}/messages/mark-all-read`,
    {}
  );
};

const getUnreadCount = async (pickupRequestId: string): Promise<number> => {
  const response = await apiClient.get<number>(
    `/api/pickuprequests/${pickupRequestId}/messages/unread-count`
  );
  return response;
};

const getTotalUnreadCount = async (): Promise<number> => {
  const response = await apiClient.get<number>(`/api/messages/unread-count`);
  return response;
};

export const useMessages = (pickupRequestId: string | null, enabled = true) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { connection, isConnected } = useSignalR();

  // Fetch messages for a pickup request
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["messages", pickupRequestId],
    queryFn: () => fetchMessages(pickupRequestId!),
    enabled: enabled && !!pickupRequestId,
    staleTime: 30000, // Consider data stale after 30 seconds (reduced polling reliance)
  });

  // Fetch unread count for a specific pickup request
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount", pickupRequestId],
    queryFn: () => getUnreadCount(pickupRequestId!),
    enabled: enabled && !!pickupRequestId,
  });

  // Set up SignalR listeners for real-time updates
  useEffect(() => {
    if (!connection || !isConnected || !pickupRequestId) {
      return;
    }

    console.log(`Setting up SignalR listeners for pickup request: ${pickupRequestId}`);

    // Join the conversation group
    connection
      .invoke("JoinConversation", pickupRequestId)
      .then(() => console.log(`Joined conversation: ${pickupRequestId}`))
      .catch((err) => console.error("Error joining conversation:", err));

    // Listen for new messages
    const handleReceiveMessage = (message: Message) => {
      console.log("Received new message via SignalR:", message);

      // Add the new message to the cache
      queryClient.setQueryData<Message[]>(
        ["messages", pickupRequestId],
        (oldMessages) => {
          if (!oldMessages) return [message];

          // Check if message already exists to avoid duplicates
          const exists = oldMessages.some((m) => m.id === message.id);
          if (exists) return oldMessages;

          return [...oldMessages, message];
        }
      );

      // Invalidate unread counts
      queryClient.invalidateQueries({ queryKey: ["unreadCount", pickupRequestId] });
      queryClient.invalidateQueries({ queryKey: ["totalUnreadCount"] });
    };

    // Listen for message read status updates
    const handleMessageRead = (data: { messageId: string; readAtUtc?: string }) => {
      console.log("Message marked as read via SignalR:", data.messageId, data.readAtUtc);

      // Update the message in the cache
      queryClient.setQueryData<Message[]>(
        ["messages", pickupRequestId],
        (oldMessages) => {
          if (!oldMessages) return oldMessages;

          return oldMessages.map((msg) =>
            msg.id === data.messageId
              ? { ...msg, isRead: true, readAtUtc: data.readAtUtc }
              : msg
          );
        }
      );

      // Invalidate unread counts
      queryClient.invalidateQueries({ queryKey: ["unreadCount", pickupRequestId] });
      queryClient.invalidateQueries({ queryKey: ["totalUnreadCount"] });
    };

    // Register event handlers
    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageRead", handleMessageRead);

    // Cleanup function
    return () => {
      console.log(`Cleaning up SignalR listeners for pickup request: ${pickupRequestId}`);

      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("MessageRead", handleMessageRead);

      // Leave the conversation group
      connection
        .invoke("LeaveConversation", pickupRequestId)
        .then(() => console.log(`Left conversation: ${pickupRequestId}`))
        .catch((err) => console.error("Error leaving conversation:", err));
    };
  }, [connection, isConnected, pickupRequestId, queryClient]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: CreateMessage) => sendMessage(pickupRequestId!, data),
    onSuccess: () => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ["messages", pickupRequestId] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount", pickupRequestId] });
      queryClient.invalidateQueries({ queryKey: ["totalUnreadCount"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsRead(pickupRequestId!),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["messages", pickupRequestId] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount", pickupRequestId] });
      queryClient.invalidateQueries({ queryKey: ["totalUnreadCount"] });
    },
  });

  return {
    messages,
    isLoading,
    isError,
    unreadCount,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    refetch,
  };
};

// Hook for total unread count across all conversations
export const useTotalUnreadCount = () => {
  const { data: totalUnreadCount = 0 } = useQuery({
    queryKey: ["totalUnreadCount"],
    queryFn: getTotalUnreadCount,
    staleTime: 60000, // Consider data stale after 60 seconds
  });

  return totalUnreadCount;
};
