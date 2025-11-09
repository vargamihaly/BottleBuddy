import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, Clock, Users, Trash2, CheckCircle, XCircle, MessageCircle } from "lucide-react";
import { BottleListing, CreatePickupRequest, PickupRequest, Transaction, Rating } from "@/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { RatingDialog } from "@/components/RatingDialog";
import { useMessages } from "@/hooks/useMessages";
import { useTranslation } from "react-i18next";

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
  const { unreadCount } = useMessages(request.id, request.status === 'accepted' || request.status === 'pending');
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
  const { data: transaction } = useQuery<Transaction>({
    queryKey: ["transaction", requestId],
    queryFn: async () => {
      const response = await apiClient.get<Transaction>(`/api/transactions/pickup-request/${requestId}`);
      return response;
    },
  });

  const { data: myRating } = useQuery<Rating | null>({
    queryKey: ["rating", transaction?.id],
    queryFn: async () => {
      if (!transaction) return null;
      try {
        const response = await apiClient.get<Rating>(`/api/ratings/transaction/${transaction.id}`);
        return response;
      } catch (error: unknown) {
        if (error instanceof ApiRequestError && error.statusCode === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!transaction,
  });

  if (!transaction) {
    return <div className="text-xs text-gray-500">{t('listing.loadingRequests')}</div>;
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
      {!myRating ? (
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
          onClick={() => onOpenRatingDialog(transaction)}
        >
          <Star className="w-3 h-3 mr-1" />
          {t('listing.rate', { name: volunteerName })}
        </Button>
      ) : (
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
      )}
    </div>
  );
};

export const BottleListingCard = ({ listing, isOwnListing = false, myPickupRequests = [] }: BottleListingCardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOfferingPickup, setIsOfferingPickup] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch pickup requests for this listing if it's the user's own listing
  const { data: pickupRequests = [], isLoading: isLoadingRequests } = useQuery<PickupRequest[]>({
    queryKey: ["pickupRequests", listing.id],
    queryFn: async () => {
      const response = await apiClient.get<PickupRequest[]>(`/api/pickuprequests/listing/${listing.id}`);
      return response;
    },
    enabled: isOwnListing,
  });

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
  const { data: transaction } = useQuery<Transaction | null>({
    queryKey: ["transaction", myCompletedPickupRequest?.id],
    queryFn: async () => {
      if (!myCompletedPickupRequest) return null;
      const response = await apiClient.get<Transaction>(
        `/api/transactions/pickup-request/${myCompletedPickupRequest.id}`
      );
      return response;
    },
    enabled: !!myCompletedPickupRequest,
  });

  // Check if user has already rated this transaction
  const { data: myRating } = useQuery<Rating | null>({
    queryKey: ["rating", transaction?.id],
    queryFn: async () => {
      if (!transaction) return null;
      try {
        const response = await apiClient.get<Rating>(`/api/ratings/transaction/${transaction.id}`);
        return response;
      } catch (error: unknown) {
        if (error instanceof ApiRequestError && error.statusCode === 404) {
          return null; // No rating yet
        }
        throw error;
      }
    },
    enabled: !!transaction,
  });

  // Format created date if available
  const timePosted = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      await apiClient.delete(`/api/bottlelistings/${listingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bottleListings"] });
      toast({
        title: "Listing deleted",
        description: "Your bottle listing has been successfully deleted.",
      });
      setIsDeleting(false);
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : "Failed to delete listing. Please try again.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setIsDeleting(true);
      deleteMutation.mutate(listing.id);
    }
  };

  // Pickup request mutation
  const pickupRequestMutation = useMutation({
    mutationFn: async (data: CreatePickupRequest) => {
      const response = await apiClient.post<PickupRequest>('/api/pickuprequests', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bottleListings"] });
      queryClient.invalidateQueries({ queryKey: ["myPickupRequests"] });
      toast({
        title: "Pickup request sent!",
        description: "The listing owner will be notified of your offer.",
      });
      setIsOfferingPickup(false);
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : "Failed to send pickup request. Please try again.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
      setIsOfferingPickup(false);
    },
  });

  const handleOfferPickup = () => {
    if (window.confirm(t('listing.confirmOffer', { count: listing.bottleCount, location: listing.locationAddress }))) {
      setIsOfferingPickup(true);
      pickupRequestMutation.mutate({
        listingId: listing.id,
      });
    }
  };

  // Update pickup request status mutation
  const updatePickupRequestStatusMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      const response = await apiClient.patch(`/api/pickuprequests/${requestId}/status`, { Status: status });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pickupRequests", listing.id] });
      queryClient.invalidateQueries({ queryKey: ["bottleListings"] });
      queryClient.invalidateQueries({ queryKey: ["myPickupRequests"] });
      toast({
        title: t('listing.updateSuccess'),
        description: t('listing.updateSuccess'),
      });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : t('common.error');
      toast({
        title: t('common.error'),
        description,
        variant: "destructive",
      });
    },
  });

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
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
              {listing.bottleCount}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {listing.title || `${listing.bottleCount} Bottles Available`}
              </h4>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="w-3 h-3" />
                <span>{listing.locationAddress}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
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
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? t('listing.deletingButton') : t('listing.deleteButton')}
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
                disabled={listing.status !== 'open' || isOfferingPickup || hasActivePickupRequest}
                onClick={handleOfferPickup}
              >
                {isOfferingPickup
                  ? t('listing.sendingRequest')
                  : myPickupRequest?.status === 'pending'
                  ? t('listing.requestPending')
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
