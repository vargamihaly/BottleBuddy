import {ChangeEvent, KeyboardEvent, useRef, useState} from "react";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {AlertCircle, Image as ImageIcon, Loader2, Send} from "lucide-react";
import {ImagePreview} from "@/features/messaging/components";
import {CreateMessage} from "@/shared/types";
import {useTranslation} from "react-i18next";

interface MessageInputProps {
    onSend: (data: CreateMessage) => void;
    isSending: boolean;
    placeholder?: string;
    disabled?: boolean;
    onTypingStart?: () => void;
    onTypingStop?: () => void;
}

export const MessageInput = ({
                                 onSend,
                                 isSending,
                                 placeholder,
                                 disabled = false,
                                 onTypingStart,
                                 onTypingStop,
                             }: MessageInputProps) => {
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {t} = useTranslation();

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

    const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset error
        setImageError(null);

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            setImageError(t("messageInput.imageTypeError"));
            return;
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            setImageError(t("messageInput.imageSizeError"));
            return;
        }

        setSelectedImage(file);
        // Reset file input so the same file can be selected again if removed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImageError(null);
    };

    const handleSend = () => {
        const trimmedMessage = message.trim();

        // Validate that either content or image is provided
        if (!trimmedMessage && !selectedImage) return;
        if (isSending || disabled) return;

        // Stop typing indicator when sending message
        if (onTypingStop) {
            onTypingStop();
        }

        // Create message data
        const data: CreateMessage = {
            content: trimmedMessage || undefined,
            image: selectedImage || undefined,
        };

        onSend(data);
        setMessage("");
        setSelectedImage(null);
        setImageError(null);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter (without Shift)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isMessageValid =
        (message.trim().length > 0 && message.trim().length <= 1000) || selectedImage !== null;
    const characterCount = message.length;
    const isOverLimit = characterCount > 1000;

    return (
        <div className="border-t border-gray-200 p-4 bg-white">
            {/* Image preview */}
            {selectedImage && (
                <div className="mb-3">
                    <ImagePreview file={selectedImage} onRemove={handleRemoveImage}/>
                </div>
            )}

            {/* Image error */}
            {imageError && (
                <div className="mb-3 flex items-center gap-2 text-red-500 text-sm bg-red-50 p-2 rounded">
                    <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                    <span>{imageError}</span>
                </div>
            )}

            <div className="flex gap-2">
                <div className="flex-1">
                    <Textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            // Trigger typing indicator on input change
                            if (onTypingStart && e.target.value.length > 0) {
                                onTypingStart();
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || t("messageInput.placeholder")}
                        disabled={disabled || isSending}
                        className="min-h-[60px] max-h-[120px] resize-none"
                        maxLength={1050} // Allow typing a bit over to show error
                    />
                    <div className="flex items-center justify-between mt-1 px-1">
            <span
                className={`text-xs ${
                    isOverLimit ? "text-red-500 font-medium" : "text-gray-400"
                }`}
            >
              {characterCount}/1000
            </span>
                        <span className="text-xs text-gray-400">
              {t("messageInput.enterToSend")}
            </span>
                    </div>
                </div>

                {/* Image upload button */}
                <div className="flex flex-col gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={disabled || isSending}
                    />
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || isSending || !!selectedImage}
                        variant="outline"
                        className="h-[60px] px-3"
                        title={t("messageInput.attachImage")}
                    >
                        <ImageIcon className="w-5 h-5"/>
                    </Button>
                </div>

                {/* Send button */}
                <Button
                    onClick={handleSend}
                    disabled={!isMessageValid || isSending || disabled}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-[60px] px-4"
                >
                    {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin"/>
                    ) : (
                        <>
                            <Send className="w-5 h-5"/>
                            <span className="ml-2 hidden sm:inline">{t("messageInput.send")}</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
