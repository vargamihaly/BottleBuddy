import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Star, Clock, Users } from "lucide-react";
import { BottleListing } from "@/types";

interface BottleListingCardProps {
  listing: BottleListing;
  isOwnListing?: boolean;
}

export const BottleListingCard = ({ listing, isOwnListing = false }: BottleListingCardProps) => {
  // Format created date if available
  const timePosted = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Recently';

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
            <span className="text-xs text-green-600">Your share (50%):</span>
            <span className="text-sm font-semibold text-green-700">{listing.estimatedRefund / 2} HUF</span>
          </div>
        </div>

        {isOwnListing ? (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            variant="secondary"
            disabled
          >
            Your Listing
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            disabled={listing.status !== 'open'}
          >
            {listing.status === 'open' ? 'Offer to Pick Up' : `Status: ${listing.status}`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
