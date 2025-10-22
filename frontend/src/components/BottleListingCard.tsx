import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, Clock, Users, Trash2 } from "lucide-react";
import { BottleListing, CreatePickupRequest } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface BottleListingCardProps {
  listing: BottleListing;
  isOwnListing?: boolean;
}

export const BottleListingCard = ({ listing, isOwnListing = false }: BottleListingCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOfferingPickup, setIsOfferingPickup] = useState(false);

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
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete listing. Please try again.",
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
      const response = await apiClient.post('/api/pickuprequests', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bottleListings"] });
      toast({
        title: "Pickup request sent!",
        description: "The listing owner will be notified of your offer.",
      });
      setIsOfferingPickup(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to send pickup request. Please try again.",
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
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Listing'}
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            disabled={listing.status !== 'open' || isOfferingPickup}
            onClick={handleOfferPickup}
          >
            {isOfferingPickup
              ? 'Sending request...'
              : listing.status === 'open'
              ? 'Offer to Pick Up'
              : `Status: ${listing.status}`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
