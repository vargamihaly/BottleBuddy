import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, Clock, Users, Trash2, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { BottleListing, CreatePickupRequest, PickupRequest, Transaction, Rating } from "@/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { RatingDialog } from "@/components/RatingDialog";

interface BottleListingCardProps {
  listing: BottleListing;
  isOwnListing?: boolean;
  myPickupRequests?: PickupRequest[];
}

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
    return <div className="text-xs text-gray-500">Loading transaction...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="bg-emerald-50 rounded-lg p-2">
        <p className="text-xs text-emerald-700 font-medium">Completed</p>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-gray-600">Your share:</span>
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
          Rate {volunteerName}
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
          <p className="text-xs text-gray-600">You rated this exchange</p>
        </div>
      )}
    </div>
  );
};

export const BottleListingCard = ({ listing, isOwnListing = false, myPickupRequests = [] }: BottleListingCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOfferingPickup, setIsOfferingPickup] = useState(false);
  const [showPickupRequests, setShowPickupRequests] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch pickup requests for this listing if it's the user's own listing
  const { data: pickupRequests = [], isLoading: isLoadingRequests } = useQuery<PickupRequest[]>({
    queryKey: ["pickupRequests", listing.id],
    queryFn: async () => {
      const response = await apiClient.get<PickupRequest[]>(`/api/pickuprequests/listing/${listing.id}`);
      return response;
    },
    enabled: isOwnListing && showPickupRequests,
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
    enabled: !!myCompletedPickupRequest && listing.status === 'completed',
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
    if (window.confirm(`Are you sure you want to offer to pick up ${listing.bottleCount} bottles from ${listing.locationAddress}?`)) {
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
        title: "Request updated",
        description: "The pickup request has been updated successfully.",
      });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : "Failed to update pickup request.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    },
  });

  const handleAcceptRequest = (requestId: string) => {
    if (window.confirm("Accept this pickup request? This will mark the listing as claimed.")) {
      updatePickupRequestStatusMutation.mutate({ requestId, status: "accepted" });
    }
  };

  const handleRejectRequest = (requestId: string) => {
    if (window.confirm("Reject this pickup request?")) {
      updatePickupRequestStatusMutation.mutate({ requestId, status: "rejected" });
    }
  };

  const handleCompletePickup = (requestId: string) => {
    if (window.confirm("Mark this pickup as completed? This confirms the bottles were successfully exchanged.")) {
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
            {listing.status}
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
            <span className="text-sm text-green-700">Estimated Total Refund:</span>
            <span className="font-bold text-green-800">{listing.estimatedRefund} HUF</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-green-600">Your share ({userPercentage}%):</span>
            <span className="text-sm font-semibold text-green-700">{userShare.toFixed(0)} HUF</span>
          </div>
        </div>

        {isOwnListing ? (
          <>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setShowPickupRequests(!showPickupRequests)}
            >
              {showPickupRequests ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Pickup Requests
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  View Pickup Requests
                </>
              )}
            </Button>

            {showPickupRequests && (
              <div className="space-y-2">
                {isLoadingRequests ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    Loading requests...
                  </div>
                ) : pickupRequests.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No pickup requests yet
                  </div>
                ) : (
                  <>
                    <Separator />
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {pickupRequests.map((request) => (
                        <div
                          key={request.id}
                          className="bg-gray-50 rounded-lg p-3 space-y-2"
                        >
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
                              {request.status}
                            </Badge>
                          </div>
                          {request.message && (
                            <p className="text-xs text-gray-600">{request.message}</p>
                          )}
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => handleAcceptRequest(request.id)}
                                disabled={updatePickupRequestStatusMutation.isPending}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                                onClick={() => handleRejectRequest(request.id)}
                                disabled={updatePickupRequestStatusMutation.isPending}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          {request.status === 'accepted' && (
                            <Button
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleCompletePickup(request.id)}
                              disabled={updatePickupRequestStatusMutation.isPending}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Mark as Completed
                            </Button>
                          )}
                          {request.status === 'completed' && (
                            <CompletedRequestRating
                              requestId={request.id}
                              volunteerName={request.volunteerName || request.volunteerEmail || 'Volunteer'}
                              onOpenRatingDialog={(txn) => {
                                setSelectedTransaction(txn);
                                setShowRatingDialog(true);
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Listing'}
            </Button>
          </>
        ) : (
          <>
            {myPickupRequest?.status === 'accepted' ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleCompletePickup(myPickupRequest.id)}
                disabled={updatePickupRequestStatusMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            ) : myCompletedPickupRequest && listing.status === 'completed' ? (
              <div className="space-y-2">
                {transaction && (
                  <div className="bg-emerald-50 rounded-lg p-3 space-y-1">
                    <p className="text-xs text-emerald-700 font-medium">Transaction Completed</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Your share:</span>
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
                    Rate This Exchange
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
                    <p className="text-xs text-gray-600">You rated this exchange</p>
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
                  ? 'Sending request...'
                  : myPickupRequest?.status === 'pending'
                  ? 'Request Pending...'
                  : listing.status === 'open'
                  ? 'Offer to Pick Up'
                  : `Status: ${listing.status}`}
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
