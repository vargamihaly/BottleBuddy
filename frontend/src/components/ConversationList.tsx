import { useAuth } from "@/contexts/AuthContext";
import { PickupRequest, BottleListing } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessages } from "@/hooks/useMessages";

interface ConversationListProps {
  pickupRequests: PickupRequest[];
  listings: BottleListing[];
  selectedConversationId: string | null;
  onSelectConversation: (pickupRequestId: string) => void;
}

interface ConversationItemProps {
  pickupRequest: PickupRequest;
  listings: BottleListing[];
  isSelected: boolean;
  onClick: () => void;
  currentUserId?: string;
}

const ConversationItem = ({ pickupRequest, listings, isSelected, onClick, currentUserId }: ConversationItemProps) => {
  const { unreadCount } = useMessages(pickupRequest.id, true);

  // Find the listing for this pickup request
  const listing = listings.find((l) => l.id === pickupRequest.listingId);

  // Determine the other party's name
  const isUserVolunteer = pickupRequest.volunteerId === currentUserId;
  const otherPartyName = isUserVolunteer
    ? listing?.createdByUserName || listing?.createdByUserEmail || "Listing Owner"
    : pickupRequest.volunteerName || pickupRequest.volunteerEmail || "Volunteer";

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    completed: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  }[pickupRequest.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all hover:bg-gray-50 border-b border-gray-100",
        isSelected && "bg-green-50 border-l-4 border-l-green-600"
      )}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            {getInitials(otherPartyName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {otherPartyName}
            </h3>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-2">
                {unreadCount}
              </Badge>
            )}
          </div>

          <p className="text-xs text-gray-600 truncate mb-2">
            {pickupRequest.message || "No initial message"}
          </p>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn("text-xs", statusColor)}>
              {pickupRequest.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConversationList = ({
  pickupRequests,
  listings,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  const { user } = useAuth();

  // Filter active conversations (pending or accepted)
  const activeConversations = pickupRequests.filter(
    (req) => req.status === "pending" || req.status === "accepted"
  );

  if (pickupRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Inbox className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Conversations</h3>
        <p className="text-sm text-gray-600">
          You don't have any active pickup requests yet.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Create a listing or request a pickup to start chatting!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {activeConversations.length} active conversation{activeConversations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        {activeConversations.map((pickupRequest) => (
          <ConversationItem
            key={pickupRequest.id}
            pickupRequest={pickupRequest}
            listings={listings}
            isSelected={selectedConversationId === pickupRequest.id}
            onClick={() => onSelectConversation(pickupRequest.id)}
            currentUserId={user?.id}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
