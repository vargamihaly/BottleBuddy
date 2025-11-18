import { useState } from "react";
import { Message } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ImageModal } from "@/components/ImageModal";
import { ReadReceipt } from "@/components/ReadReceipt";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
  apiBaseUrl?: string;
}

export const ChatMessage = ({ message, isOwnMessage, apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000" }: ChatMessageProps) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  const getInitials = (name?: string) => {


    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  // Construct full image URL
  const getImageUrl = (relativeUrl: string) => {
      console.log("---------------")
      console.log("import.meta.env.VITE_API_URL:")
      console.log(import.meta.env.VITE_API_URL)

    if (relativeUrl.startsWith("http")) {
      return relativeUrl;
    }
    return `${apiBaseUrl}${relativeUrl}`;
  };

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in slide-in-from-bottom-2 duration-200",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <Avatar className="w-8 h-8 flex-shrink-0">
        {message.senderAvatarUrl ? (
          <AvatarImage src={message.senderAvatarUrl} alt={message.senderName} />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
            {getInitials(message.senderName)}
          </AvatarFallback>
        )}
      </Avatar>

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col max-w-[75%]",
          isOwnMessage ? "items-end" : "items-start"
        )}
      >
        {/* Sender name and time */}
        <div
          className={cn(
            "flex items-center gap-2 mb-1 px-1",
            isOwnMessage ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span className="text-xs font-medium text-gray-900">
            {isOwnMessage ? t("messages.you") : message.senderName || t("messages.unknown")}
          </span>
          <span className="text-xs text-gray-500">{timeAgo}</span>
        </div>

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl break-words overflow-hidden",
            isOwnMessage
              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-900 rounded-tl-sm"
          )}
        >
          {/* Image attachment */}
          {message.imageUrl && (
            <div
              className="relative cursor-pointer group"
              onClick={() => setShowImageModal(true)}
            >
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              )}
              {imageError ? (
                <div className="flex items-center justify-center gap-2 p-4 bg-gray-200 text-gray-500">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{t("messages.imageLoadError")}</span>
                </div>
              ) : (
                <img
                  src={getImageUrl(message.imageUrl)}
                  alt={message.imageFileName || "Shared image"}
                  className="max-w-[300px] max-h-[300px] object-cover transition-opacity group-hover:opacity-90"
                  onLoad={() => setImageLoading(false)}
                  onError={() => {
                    setImageLoading(false);
                    setImageError(true);
                  }}
                  loading="lazy"
                />
              )}
            </div>
          )}

          {/* Text content */}
          {message.content && (
            <p className="text-sm leading-relaxed whitespace-pre-wrap px-4 py-2">
              {message.content}
            </p>
          )}
        </div>

        {/* Read status (only for own messages) */}
        {isOwnMessage && (
          <div className="px-1 mt-1">
            <ReadReceipt
              isRead={message.isRead}
              readAtUtc={message.readAtUtc}
            />
          </div>
        )}
      </div>

      {/* Image modal */}
      {showImageModal && message.imageUrl && (
        <ImageModal
          imageUrl={getImageUrl(message.imageUrl)}
          imageFileName={message.imageFileName}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
};
