import {useState} from "react";
import {MapPin, Coins, Calendar, Clock, Trash2, Star, Users} from "lucide-react";
import {Card, CardHeader, CardTitle, CardContent} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Badge} from "@/shared/ui/badge";
import {StatusTimeline} from "./StatusTimeline";
import {BottleListingWithRequests} from "@/features/listings/hooks/useMyListingsEnhanced";
import {useTranslation} from "react-i18next";
import {useUpdatePickupRequestStatus} from "@/features/pickup-requests/hooks";
import {PickupRequestItem} from "./PickupRequestItem";
import {Separator} from "@/shared/ui/separator";
import {RatingDialog} from "@/features/listings/components";
import {
  useRatingByTransaction,
  useTransactionByPickupRequest
} from "@/features/dashboard/hooks";
import type {Transaction} from "@/shared/types";

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

  // Rating dialog state
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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
  const completedPickupRequests = listing.pickupRequests.filter(req => req.status === 'completed');

  const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
    open: "default",
    claimed: "secondary",
    completed: "outline",
  };

  // Sub-component for rating completed requests
  const CompletedRequestRating = ({
    requestId,
    volunteerName,
  }: {
    requestId: string;
    volunteerName: string;
  }) => {
    const {data: transaction, isLoading: isLoadingTransaction} =
      useTransactionByPickupRequest(requestId);

    const transactionId = transaction?.id ?? '';
    const {data: myRating, isLoading: isLoadingRating} =
      useRatingByTransaction(transactionId, !!transactionId);

    if (isLoadingTransaction || isLoadingRating) {
      return <div className="text-xs text-gray-500">{t('listing.loadingRequests')}</div>;
    }

    if (!transaction) {
      return (
        <div className="text-xs text-gray-500">
          {t('listing.transactionPending')}
        </div>
      );
    }

    return (
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        {/* Volunteer Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">{volunteerName}</span>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            {t('listing.completed')}
          </Badge>
        </div>

        {/* Transaction Amount */}
        <div className="flex items-center gap-2 text-sm">
          <Coins className="w-4 h-4 text-green-600" />
          <span className="text-gray-700">
            {t('listing.earned')}: <span className="font-semibold text-green-700">
              {transaction.ownerAmount} HUF
            </span>
          </span>
        </div>

        {/* Rating Section */}
        {myRating ? (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-600">{t('listing.yourRating')}:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= myRating.value
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            onClick={() => {
              setSelectedTransaction(transaction);
              setShowRatingDialog(true);
            }}
          >
            <Star className="w-3 h-3 mr-1" />
            {t('listing.rateVolunteer')}
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
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

        {/* Completed Requests Section */}
        {(listing.status === "completed" || listing.status === "claimed") &&
          completedPickupRequests.length > 0 && (
            <div className="space-y-2 pt-2">
              <Separator />
              <h4 className="text-sm font-semibold text-gray-700 pt-2">
                {t('listing.completedPickups')}
              </h4>
              {completedPickupRequests.map((request) => (
                <CompletedRequestRating
                  key={request.id}
                  requestId={request.id}
                  volunteerName={request.volunteerName || request.volunteerEmail || 'Volunteer'}
                />
              ))}
            </div>
          )}

        {/* Actions */}
        {listing.status !== "completed" && (
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
        )}
      </CardContent>
    </Card>
    {/* Rating Dialog */}
    {selectedTransaction && (
      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        transaction={selectedTransaction}
        otherPartyName={
          completedPickupRequests.find(r => r.id === selectedTransaction.pickupRequestId)
            ?.volunteerName ||
          completedPickupRequests.find(r => r.id === selectedTransaction.pickupRequestId)
            ?.volunteerEmail ||
          'Volunteer'
        }
      />
    )}
    </>
  );
};