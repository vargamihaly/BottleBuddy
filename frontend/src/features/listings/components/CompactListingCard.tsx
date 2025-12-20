import {MapPin, Coins, Calendar, Clock, Trash2} from "lucide-react";
import {Card, CardHeader, CardTitle, CardContent} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Badge} from "@/shared/ui/badge";
import {StatusTimeline} from "./StatusTimeline";
import {BottleListingWithRequests} from "@/features/listings/hooks/useMyListingsEnhanced";
import {useTranslation} from "react-i18next";
import {useUpdatePickupRequestStatus} from "@/features/pickup-requests/hooks";
import {PickupRequestItem} from "./PickupRequestItem";
import {Separator} from "@/shared/ui/separator";

interface CompactListingCardProps {
  listing: BottleListingWithRequests;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDeadline(deadline?: string): string {
  if (!deadline) return "";
  const daysLeft = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysLeft < 0) return "Overdue";
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "Due tomorrow";
  return `${daysLeft} days left`;
}

function getDeadlineColor(deadline?: string): string {
  if (!deadline) return "text-gray-600";
  const daysLeft = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (daysLeft < 0) return "text-red-600 font-medium";
  if (daysLeft <= 2) return "text-orange-600 font-medium";
  return "text-gray-600";
}

export const CompactListingCard = ({
  listing,
  onDelete,
}: CompactListingCardProps) => {
  const {t} = useTranslation();
  const updateStatusMutation = useUpdatePickupRequestStatus();

  const handleAccept = (requestId: string) => {
    if (window.confirm(t('listing.confirmAccept'))) {
      updateStatusMutation.mutate({ requestId, status: "accepted" });
    }
  };

  const handleReject = (requestId: string) => {
    if (window.confirm(t('listing.confirmReject'))) {
      updateStatusMutation.mutate({ requestId, status: "rejected" });
    }
  };
  
  const pendingPickupRequests = listing.pickupRequests.filter(req => req.status === 'pending');

  const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
    open: "default",
    claimed: "secondary",
    completed: "outline",
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 bg-green-100 text-green-700">
              {listing.bottleCount} {listing.bottleCount === 1 ? "bottle" : "bottles"}
            </Badge>
            <CardTitle className="text-lg line-clamp-1">
              {listing.title || listing.location}
            </CardTitle>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-3 h-3 mr-1 shrink-0" />
              <span className="line-clamp-1">{listing.location}</span>
            </div>
          </div>
          <Badge variant={statusVariant[listing.status]} className="capitalize shrink-0">
            {listing.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* StatusTimeline */}
        <StatusTimeline
          status={listing.status}
          pendingRequests={pendingPickupRequests.length}
          className="py-2"
        />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-green-700">
            <Coins className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              ~{listing.estimatedRefund.toLocaleString()} HUF
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{formatDate(listing.createdAt)}</span>
          </div>
          {listing.deadline && (
            <div className={`flex items-center gap-1.5 col-span-2 ${getDeadlineColor(listing.deadline)}`}>
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatDeadline(listing.deadline)}</span>
            </div>
          )}
        </div>

        {/* Pending Requests Section */}
        {listing.status === "open" && pendingPickupRequests.length > 0 && (
            <div className="space-y-2 pt-2">
              <Separator />
              <h4 className="text-sm font-semibold text-gray-700 pt-2">
                {t('listing.pickupRequests')}
              </h4>
              {pendingPickupRequests.map((request) => (
                <PickupRequestItem
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  isUpdating={updateStatusMutation.isPending}
                />
              ))}
            </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Button
            onClick={() => onDelete(listing.id)}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};