import {Badge} from "@/shared/ui/badge";
import {Button} from "@/shared/ui/button";
import {Card, CardContent, CardHeader} from "@/shared/ui/card";
import {Calendar, CheckCircle, Clock, MapPin, MessageCircle, Star, Trash2, Users, XCircle} from "lucide-react";
import {BottleListing, PickupRequest, Transaction} from "@/shared/types";
import {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Separator} from "@/shared/ui/separator";
import {RatingDialog} from "@/features/listings/components";
import {useMessages} from "@/features/messaging/hooks";
import {useTranslation} from "react-i18next";
import {useDeleteBottleListing} from "@/features/listings/hooks";
import {
    useCreatePickupRequest,
    usePickupRequestsByListing,
    useUpdatePickupRequestStatus
} from "@/features/pickup-requests/hooks";
import {useRatingByTransaction, useTransactionByPickupRequest} from "@/features/dashboard/hooks";

interface BottleListingCardProps {
  listing: BottleListing;
  isOwnListing?: boolean;
  myPickupRequests?: PickupRequest[];
}

// Helper component for pickup request item
const PickupRequestItem = ({
  request,
  onAccept,
  onReject,
  onComplete,
  onOpenRatingDialog,
  isUpdating,
}: {
  request: PickupRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  onComplete: (requestId: string) => void;
  onOpenRatingDialog: (transaction: Transaction) => void;
  isUpdating: boolean;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { unreadCount } = useMessages(request.id, {
    enabled: request.status === 'accepted' || request.status === 'pending',
    fetchMessages: false,
  });
  const canMessage = request.status === 'accepted' || request.status === 'pending';

  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            {request.volunteerName || request.volunteerEmail}
          </span>
        </div>
        <Badge
          variant={
            request.status === 'pending'
              ? 'default'
              : request.status === 'accepted'
              ? 'secondary'
              : 'outline'
          }
          className={
            request.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : request.status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }
        >
          {t(`listing.${request.status}`)}
        </Badge>
      </div>

      {request.message && (
        <p className="text-xs text-gray-600 italic">"{request.message}"</p>
      )}

      {request.status === 'pending' && (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onAccept(request.id)}
            disabled={isUpdating}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('listing.accept')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            onClick={() => onReject(request.id)}
            disabled={isUpdating}
          >
            <XCircle className="w-3 h-3 mr-1" />
            {t('listing.reject')}
          </Button>
        </div>
      )}

      {request.status === 'accepted' && (
        <div className="space-y-2">
          {canMessage && (
            <Button
              size="sm"
              variant="outline"
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
              onClick={() => navigate(`/messages?conversation=${request.id}`)}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              {t('listing.message')}
              {unreadCount > 0 && (
                <Badge className="ml-2 h-4 min-w-4 bg-red-500 text-white text-xs px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          )}
          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => onComplete(request.id)}
            disabled={isUpdating}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('listing.markAsCompleted')}
          </Button>
        </div>
      )}

      {request.status === 'completed' && (
        <CompletedRequestRating
          requestId={request.id}
          volunteerName={request.volunteerName || request.volunteerEmail || 'Volunteer'}
          onOpenRatingDialog={onOpenRatingDialog}
        />
      )}
    </div>
  );
};

// Helper component for completed request rating in owner's view
const CompletedRequestRating = ({
  requestId,
  volunteerName,
  onOpenRatingDialog,
}: {
  requestId: string;
  volunteerName: string;
  onOpenRatingDialog: (transaction: Transaction) => void;
}) => {
  const { t } = useTranslation();
  const {
    data: transaction,
    isLoading: isLoadingTransaction,
  } = useTransactionByPickupRequest(requestId);

  const transactionId = transaction?.id ?? '';
  const {
    data: myRating,
    isLoading: isLoadingRating,
  } = useRatingByTransaction(transactionId, !!transactionId);

  if (isLoadingTransaction) {
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
    <div className="space-y-2">
      <div className="bg-emerald-50 rounded-lg p-2">
        <p className="text-xs text-emerald-700 font-medium">{t('listing.completed')}</p>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-600">{t('listing.yourShare')}:</span>
          <span className="font-semibold text-emerald-700">{transaction.ownerAmount} HUF</span>
        </div>
      </div>
      {!myRating && !isLoadingRating ? (
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          onClick={() => onOpenRatingDialog(transaction)}
        >
          <Star className="w-3 h-3 mr-1" />
          {t('listing.rate', { name: volunteerName })}
        </Button>
      ) : myRating ? (
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= myRating.value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">{t('listing.youRated')}</p>
        </div>
      ) : (
        <div className="text-xs text-gray-500">{t('listing.loadingRequests')}</div>
      )}
    </div>
  );
};

export const BottleListingCard = ({ listing, isOwnListing = false, myPickupRequests = [] }: BottleListingCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch pickup requests for this listing if it's the user's own listing
  const { data: pickupRequests = [], isLoading: isLoadingRequests } = usePickupRequestsByListing(
    listing.id,
    isOwnListing
  );

  // Check if user already has an active pickup request for this listing
  const myPickupRequest = useMemo(() => {
    return myPickupRequests.find(
      request => request.listingId === listing.id &&
      (request.status === 'pending' || request.status === 'accepted')
    );
  }, [myPickupRequests, listing.id]);

  // Check if user has a completed pickup request for this listing
  const myCompletedPickupRequest = useMemo(() => {
    return myPickupRequests.find(
      request => request.listingId === listing.id && request.status === 'completed'
    );
  }, [myPickupRequests, listing.id]);

  const hasActivePickupRequest = !!myPickupRequest;

  // Fetch transaction for completed pickup request
  const { data: transaction } = useTransactionByPickupRequest(
    myCompletedPickupRequest?.id || '',
    !!myCompletedPickupRequest
  );

  // Check if user has already rated this transaction
  const { data: myRating } = useRatingByTransaction(
    transaction?.id || '',
    !!transaction
  );

  // Format created date if available
  const timePosted = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

  // Format pickup deadline if available
  const formattedDeadline = listing.pickupDeadline
    ? new Date(listing.pickupDeadline).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  // Check if deadline is approaching or past
  const deadlineDate = listing.pickupDeadline ? new Date(listing.pickupDeadline) : null;
  const isDeadlinePast = deadlineDate ? deadlineDate < new Date() : false;
  const isDeadlineSoon = deadlineDate
    ? deadlineDate > new Date() && deadlineDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
    : false;

  // Calculate share amounts based on splitPercentage
  // splitPercentage is the owner's (lister's) percentage
  // Default to 50/50 if not specified
  const ownerPercentage = listing.splitPercentage ?? 50;
  const volunteerPercentage = 100 - ownerPercentage;

  // Calculate actual amounts
  const ownerShare = (listing.estimatedRefund * ownerPercentage) / 100;
  const volunteerShare = (listing.estimatedRefund * volunteerPercentage) / 100;

  // Determine which share to display based on whether it's the user's own listing
  const userShare = isOwnListing ? ownerShare : volunteerShare;
  const userPercentage = isOwnListing ? ownerPercentage : volunteerPercentage;

  // Use custom hooks for mutations
  const deleteMutation = useDeleteBottleListing();
  const createPickupRequestMutation = useCreatePickupRequest();
  const updatePickupRequestStatusMutation = useUpdatePickupRequestStatus();

  const handleDelete = () => {
    if (window.confirm(t('listing.deleteConfirm'))) {
      deleteMutation.mutate(listing.id);
    }
  };

  const handleOfferPickup = () => {
    if (window.confirm(t('listing.confirmOffer', { count: listing.bottleCount, location: listing.locationAddress }))) {
      createPickupRequestMutation.mutate({
        listingId: listing.id,
      });
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    if (window.confirm(t('listing.confirmAccept'))) {
      updatePickupRequestStatusMutation.mutate({ requestId, status: "accepted" });
    }
  };

  const handleRejectRequest = (requestId: string) => {
    if (window.confirm(t('listing.confirmReject'))) {
      updatePickupRequestStatusMutation.mutate({ requestId, status: "rejected" });
    }
  };

  const handleCompletePickup = (requestId: string) => {
    if (window.confirm(t('listing.confirmComplete'))) {
      updatePickupRequestStatusMutation.mutate({ requestId, status: "completed" });
    }
  };

  const handleOpenRatingDialog = () => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowRatingDialog(true);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-300 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {listing.bottleCount}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 truncate" title={listing.title || `${listing.bottleCount} Bottles Available`}>
                {listing.title || `${listing.bottleCount} Bottles Available`}
              </h4>
              <div className="flex items-center space-x-1 text-sm text-gray-600 min-w-0">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate" title={listing.locationAddress}>{listing.locationAddress}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 flex-shrink-0">
            {t(`listing.${listing.status}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{listing.createdByUserName || 'User'}</span>
            {listing.createdByUserRating !== undefined && listing.createdByUserRating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{listing.createdByUserRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{timePosted}</span>
          </div>
        </div>

        {formattedDeadline && (
          <div className={`flex items-center space-x-2 text-sm rounded-lg p-2 ${
            isDeadlinePast
              ? 'bg-red-50 text-red-700'
              : isDeadlineSoon
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-blue-50 text-blue-700'
          }`}>
            <Calendar className={`w-4 h-4 ${
              isDeadlinePast
                ? 'text-red-600'
                : isDeadlineSoon
                ? 'text-yellow-600'
                : 'text-blue-600'
            }`} />
            <span className="font-medium">
              {t('listing.pickupDeadline')}: {formattedDeadline}
            </span>
            {isDeadlinePast && (
              <Badge variant="destructive" className="ml-auto text-xs">
                {t('listing.pastDeadline')}
              </Badge>
            )}
            {isDeadlineSoon && !isDeadlinePast && (
              <Badge className="ml-auto text-xs bg-yellow-500 text-white">
                {t('listing.soon')}
              </Badge>
            )}
          </div>
        )}

        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700">{t('listing.estimatedRefund')}:</span>
            <span className="font-bold text-green-800">{listing.estimatedRefund} HUF</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-green-600">{t('listing.yourShare')} ({userPercentage}%):</span>
            <span className="text-sm font-semibold text-green-700">{userShare.toFixed(0)} HUF</span>
          </div>
        </div>

        {isOwnListing ? (
          <>
            {/* Pickup Requests Section - Always Visible */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  {t('listing.pickupRequests')}
                  {pickupRequests.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {pickupRequests.length}
                    </Badge>
                  )}
                  {pickupRequests.filter(r => r.status === 'pending').length > 0 && (
                    <Badge className="bg-yellow-500 text-white">
                      {pickupRequests.filter(r => r.status === 'pending').length} {t('listing.pending')}
                    </Badge>
                  )}
                </h4>
              </div>

              <Separator />

              {isLoadingRequests ? (
                <div className="text-center py-4 text-sm text-gray-500">
                  {t('listing.loadingRequests')}
                </div>
              ) : pickupRequests.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">{t('listing.noPickupRequests')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('listing.shareToGetVolunteers')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pickupRequests.map((request) => (
                    <PickupRequestItem
                      key={request.id}
                      request={request}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                      onComplete={handleCompletePickup}
                      onOpenRatingDialog={(txn) => {
                        setSelectedTransaction(txn);
                        setShowRatingDialog(true);
                      }}
                      isUpdating={updatePickupRequestStatusMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </div>

            <Separator />

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleteMutation.isPending ? t('listing.deletingButton') : t('listing.deleteButton')}
            </Button>
          </>
        ) : (
          <>
            {(myPickupRequest?.status === 'accepted' || myPickupRequest?.status === 'pending') ? (
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{t('listing.yourPickupRequest')}</span>
                    <Badge
                      className={
                        myPickupRequest.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }
                    >
                      {t(`listing.${myPickupRequest.status}`)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {myPickupRequest.status === 'pending'
                      ? t('listing.waitingForAcceptance', { name: listing.createdByUserName || 'the owner' })
                      : t('listing.coordinatePickup')}
                  </p>
                </div>
                {myPickupRequest.status === 'accepted' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => navigate(`/messages?conversation=${myPickupRequest.id}`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('listing.message')} {listing.createdByUserName || 'Owner'}
                    </Button>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleCompletePickup(myPickupRequest.id)}
                      disabled={updatePickupRequestStatusMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('listing.markAsCompleted')}
                    </Button>
                  </>
                )}
              </div>
            ) : myCompletedPickupRequest ? (
              <div className="space-y-2">
                {transaction && (
                  <div className="bg-emerald-50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-emerald-700 font-medium">{t('listing.transactionCompleted')}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('listing.yourShare')}:</span>
                      <span className="font-semibold text-emerald-700">
                        {transaction.volunteerAmount} HUF
                      </span>
                    </div>
                  </div>
                )}
                {!myRating ? (
                  <Button
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    onClick={handleOpenRatingDialog}
                    disabled={!transaction}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {t('listing.rateExchange')}
                  </Button>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= myRating.value
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{t('listing.youRated')}</p>
                  </div>
                )}
              </div>
            ) : (
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={listing.status !== 'open' || createPickupRequestMutation.isPending || hasActivePickupRequest}
                onClick={handleOfferPickup}
              >
                {createPickupRequestMutation.isPending
                  ? t('listing.sendingRequest')
                  : listing.status === 'open'
                  ? t('listing.offerToPickUp')
                  : `${t('common.status')}: ${t(`listing.${listing.status}`)}`}
              </Button>
            )}
          </>
        )}
      </CardContent>

      {/* Rating Dialog */}
      {selectedTransaction && (
        <RatingDialog
          open={showRatingDialog}
          onOpenChange={setShowRatingDialog}
          transaction={selectedTransaction}
          otherPartyName={listing.createdByUserName || listing.createdByUserEmail}
        />
      )}
    </Card>
  );
};
