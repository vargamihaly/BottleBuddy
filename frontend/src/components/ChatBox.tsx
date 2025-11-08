import { useEffect, useRef, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { useSignalR } from "@/hooks/useSignalR";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { ChatMessage } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateMessage } from "@/types";

interface ChatBoxProps {
  pickupRequestId: string;
  otherPartyName?: string;
  disabled?: boolean;
}

export const ChatBox = ({
  pickupRequestId,
  otherPartyName = "the other party",
  disabled = false,
}: ChatBoxProps) => {
  const { user } = useAuth();
  const {
    messages,
    isLoading,
    isError,
    sendMessage,
    isSending,
    markAllAsRead,
    refetch,
  } = useMessages(pickupRequestId, true);

  const { connection, isConnected } = useSignalR();
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator({
    pickupRequestId,
    connection,
    isConnected,
    currentUserId: user?.id || null,
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const previousMessageCount = useRef(messages.length);

  // Create a mapping of user IDs to names from messages
  const userNamesMap = useMemo(() => {
    const map = new Map<string, string>();
    messages.forEach((msg) => {
      if (msg.senderId && msg.senderName) {
        map.set(msg.senderId, msg.senderName);
      }
    });
    return map;
  }, [messages]);

  // Get names of typing users
  const typingUserNames = useMemo(() => {
    return typingUsers
      .map((userId) => userNamesMap.get(userId) || otherPartyName)
      .filter((name) => name !== undefined);
  }, [typingUsers, userNamesMap, otherPartyName]);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll to bottom when messages load, new message arrives, or typing indicator appears
  useEffect(() => {
    if (messages.length > 0) {
      // Immediate scroll on first load
      if (!hasScrolledToBottom) {
        scrollToBottom("auto");
        setHasScrolledToBottom(true);
      }
      // Smooth scroll when new messages arrive
      else if (messages.length > previousMessageCount.current) {
        scrollToBottom("smooth");
      }
      previousMessageCount.current = messages.length;
    }
  }, [messages, hasScrolledToBottom]);

  // Auto-scroll when typing indicator appears
  useEffect(() => {
    if (typingUserNames.length > 0 && hasScrolledToBottom) {
      scrollToBottom("smooth");
    }
  }, [typingUserNames.length, hasScrolledToBottom]);

  // Mark messages as read when component mounts and user views them
  useEffect(() => {
    if (messages.length > 0 && user) {
      // Mark as read after a short delay (user has time to see them)
      const timer = setTimeout(() => {
        const hasUnreadMessages = messages.some(
          (msg) => !msg.isRead && msg.senderId !== user.id
        );
        if (hasUnreadMessages) {
          markAllAsRead();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages, user, markAllAsRead]);

  const handleSendMessage = (data: CreateMessage) => {
    sendMessage(data);
  };

  if (isLoading) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading messages...</p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-4">Failed to load messages</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      {/* Header */}
      <CardHeader className="border-b border-gray-200 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span>Chat with {otherPartyName}</span>
          </CardTitle>
          {messages.length > 0 && (
            <span className="text-xs text-gray-500">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-1">No messages yet</p>
                <p className="text-xs text-gray-400">
                  Start a conversation with {otherPartyName}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.senderId === user?.id}
                />
              ))}
              {/* Typing indicator */}
              {typingUserNames.length > 0 && (
                <TypingIndicator typingUserNames={typingUserNames} />
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Disabled state alert */}
        {disabled && (
          <Alert className="m-4 mb-0 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800">
              This conversation is no longer active
            </AlertDescription>
          </Alert>
        )}

        {/* Message Input */}
        <MessageInput
          onSend={handleSendMessage}
          isSending={isSending}
          disabled={disabled}
          placeholder={`Message ${otherPartyName}...`}
          onTypingStart={startTyping}
          onTypingStop={stopTyping}
        />
      </CardContent>
    </Card>
  );
};
