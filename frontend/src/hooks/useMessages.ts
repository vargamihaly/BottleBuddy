import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message, CreateMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useSignalR } from "@/hooks/useSignalR";
import { messageService } from "@/api/services";
import { ApiRequestError } from "@/lib/apiClient";

const messageKeys = {
  all: ['messages'] as const,
  byPickupRequest: (pickupRequestId: string) =>
    [...messageKeys.all, 'pickup-request', pickupRequestId] as const,
  unreadCount: (pickupRequestId: string) =>
    [...messageKeys.byPickupRequest(pickupRequestId), 'unread-count'] as const,
  totalUnread: () => [...messageKeys.all, 'total-unread'] as const,
};

export const useMessages = (pickupRequestId: string | null, enabled = true) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { connection, isConnected } = useSignalR();

  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: messageKeys.byPickupRequest(pickupRequestId ?? ''),
    queryFn: () => messageService.getByPickupRequestId(pickupRequestId ?? ''),
    enabled: enabled && !!pickupRequestId,
    staleTime: 30000,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: messageKeys.unreadCount(pickupRequestId ?? ''),
    queryFn: () => messageService.getUnreadCount(pickupRequestId ?? ''),
    enabled: enabled && !!pickupRequestId,
  });

  useEffect(() => {
    if (!connection || !isConnected || !pickupRequestId) {
      return;
    }

    connection
      .invoke("JoinConversation", pickupRequestId)
      .catch((err) => console.error("Error joining conversation:", err));

    const handleReceiveMessage = (message: Message) => {
      queryClient.setQueryData<Message[] | undefined>(
        messageKeys.byPickupRequest(pickupRequestId),
        (oldMessages) => {
          if (!oldMessages) {
            return [message];
          }

          const exists = oldMessages.some((m) => m.id === message.id);
          if (exists) {
            return oldMessages;
          }

          return [...oldMessages, message];
        }
      );

      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
    };

    const handleMessageRead = (data: { messageId: string; readAtUtc?: string }) => {
      queryClient.setQueryData<Message[] | undefined>(
        messageKeys.byPickupRequest(pickupRequestId),
        (oldMessages) => {
          if (!oldMessages) {
            return oldMessages;
          }

          return oldMessages.map((msg) =>
            msg.id === data.messageId ? { ...msg, isRead: true, readAtUtc: data.readAtUtc } : msg,
          );
        }
      );

      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
    };

    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageRead", handleMessageRead);

    return () => {
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("MessageRead", handleMessageRead);

      connection
        .invoke("LeaveConversation", pickupRequestId)
        .catch((err) => console.error("Error leaving conversation:", err));
    };
  }, [connection, isConnected, pickupRequestId, queryClient]);

  const sendMessageMutation = useMutation({
    mutationFn: (data: CreateMessage) => messageService.sendMessage(pickupRequestId ?? '', data),
    onSuccess: () => {
      if (!pickupRequestId) return;
      queryClient.invalidateQueries({ queryKey: messageKeys.byPickupRequest(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : error instanceof Error
          ? error.message
          : "Please try again.";

      toast({
        title: "Failed to send message",
        description,
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => messageService.markAsRead(pickupRequestId ?? ''),
    onSuccess: () => {
      if (!pickupRequestId) return;
      queryClient.invalidateQueries({ queryKey: messageKeys.byPickupRequest(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
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

export const useTotalUnreadCount = () => {
  const { data: totalUnreadCount = 0 } = useQuery({
    queryKey: messageKeys.totalUnread(),
    queryFn: messageService.getTotalUnreadCount,
    staleTime: 60000,
  });

  return totalUnreadCount;
};
