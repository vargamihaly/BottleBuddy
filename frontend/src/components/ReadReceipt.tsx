import { Check, CheckCheck, Clock } from "lucide-react";
import { formatDistanceToNow, format, differenceInHours } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReadReceiptProps {
  isRead: boolean;
  readAtUtc?: string;
  isSending?: boolean;
}

export const ReadReceipt = ({ isRead, readAtUtc, isSending = false }: ReadReceiptProps) => {
  // Status: Sending (not delivered yet)
  if (isSending) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Sending...</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Message is being sent</p>
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
    const relativeTime = formatDistanceToNow(readDate, { addSuffix: true });

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
              <CheckCheck className="w-3 h-3" />
              <span className="text-xs">Read {displayText}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Read at {format(readDate, "PPpp")}</p>
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
              <CheckCheck className="w-3 h-3" />
              <span className="text-xs">Read</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Read</p>
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
            <Check className="w-3 h-3" />
            <span className="text-xs">Delivered</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delivered</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
