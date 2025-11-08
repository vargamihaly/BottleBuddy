import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Package, ArrowRight } from "lucide-react";
import { PickupRequest, BottleListing } from "@/types";
import { useNavigate } from "react-router-dom";

interface MyActivePickupsWidgetProps {
  pickupRequests: PickupRequest[];
  listings: BottleListing[];
}

export const MyActivePickupsWidget = ({ pickupRequests, listings }: MyActivePickupsWidgetProps) => {
  const navigate = useNavigate();

  // Filter active pickups (pending or accepted)
  const activePickups = pickupRequests.filter(
    req => req.status === "pending" || req.status === "accepted"
  );

  const getListingForPickup = (pickupRequest: PickupRequest) => {
    return listings.find(l => l.id === pickupRequest.listingId);
  };

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    accepted: "bg-green-100 text-green-800 border-green-300",
  };

  if (activePickups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Active Pickups
          </CardTitle>
          <CardDescription>You don't have any active pickup tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-4">
              Browse available bottles near you to start earning!
            </p>
            <Button onClick={() => navigate("/my-pickup-tasks")} variant="outline">
              View All Pickup Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Active Pickups
            <Badge variant="secondary" className="ml-2">{activePickups.length}</Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-pickup-tasks")}
            className="text-green-600 hover:text-green-700"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <CardDescription>Your upcoming bottle pickups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activePickups.slice(0, 3).map((pickup) => {
            const listing = getListingForPickup(pickup);
            if (!listing) return null;

            return (
              <div
                key={pickup.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/messages?conversation=${pickup.id}`)}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">
                      {listing.bottleCount} bottles
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusColor[pickup.status as keyof typeof statusColor]}`}
                    >
                      {pickup.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {pickup.message || "No message"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
