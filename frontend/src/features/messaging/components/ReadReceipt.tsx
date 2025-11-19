import {Check, CheckCheck, Clock} from "lucide-react";
import {differenceInHours, format, formatDistanceToNow} from "date-fns";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/shared/ui/tooltip";
import {useTranslation} from "react-i18next";

interface ReadReceiptProps {
    isRead: boolean;
    readAtUtc?: string;
    isSending?: boolean;
}

export const ReadReceipt = ({isRead, readAtUtc, isSending = false}: ReadReceiptProps) => {
    const {t} = useTranslation();

    // Status: Sending (not delivered yet)
    if (isSending) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-gray-400">
                            <Clock className="w-3 h-3"/>
                            <span className="text-xs">{t("readReceipt.sending")}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("readReceipt.sendingMessage")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Status: Read (has readAtUtc timestamp)
    if (isRead && readAtUtc) {
        const readDate = new Date(readAtUtc);
        const hoursAgo = differenceInHours(new Date(), readDate);

        // Use relative time for recent reads (within 24 hours)
        const relativeTime = formatDistanceToNow(readDate, {addSuffix: true});

        // Use absolute time for older reads
        const absoluteTime = hoursAgo > 24
            ? format(readDate, "MMM d, h:mm a")
            : format(readDate, "h:mm a");

        const displayText = hoursAgo < 1
            ? relativeTime.replace("ago", "").trim()
            : hoursAgo < 24
                ? relativeTime.replace(" ago", "")
                : absoluteTime;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-green-600">
                            <CheckCheck className="w-3 h-3"/>
                            <span className="text-xs">{t("readReceipt.read")} {displayText}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("readReceipt.readAt", {time: format(readDate, "PPpp")})}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Status: Read (but no timestamp - backward compatibility)
    if (isRead) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 text-green-600">
                            <CheckCheck className="w-3 h-3"/>
                            <span className="text-xs">{t("readReceipt.read")}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t("readReceipt.read")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Status: Delivered (not read yet)
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-gray-400">
                        <Check className="w-3 h-3"/>
                        <span className="text-xs">{t("readReceipt.delivered")}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t("readReceipt.delivered")}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
