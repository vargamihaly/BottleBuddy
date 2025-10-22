import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Users, Search, Filter, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BottleListing } from "@/types";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  createBottleIcon,
  createSelectedMarkerIcon,
  createUserLocationIcon,
  getUserLocation,
  calculateDistance,
  formatDistance,
} from "@/lib/mapUtils";
import type { Map as LeafletMap } from 'leaflet';
import {useAuth} from "@/contexts/AuthContext.tsx";


interface BottleListingWithDistance extends BottleListing {
  distance?: string;
  distanceKm?: number;
}

// Component to handle map interactions and updates
function MapController({
  center,
  selectedListing
}: {
  center: [number, number];
  selectedListing: BottleListingWithDistance | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedListing?.latitude && selectedListing?.longitude) {
      map.flyTo([selectedListing.latitude, selectedListing.longitude], 15, {
        duration: 1.5,
      });
    }
  }, [selectedListing, map]);

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

interface MapViewProps {
  listings: BottleListing[];
  onBackToHome: () => void;
}

export const MapView = ({ listings, onBackToHome }: MapViewProps) => {
  const { user } = useAuth();
  const [selectedListing, setSelectedListing] = useState<BottleListingWithDistance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const { toast } = useToast();
  const mapRef = useRef<LeafletMap | null>(null);

  // Get user's location on mount
  useEffect(() => {
    getUserLocation()
      .then((location) => {
        setUserLocation(location);
        setMapCenter(location);
        toast({
          title: "Location found",
          description: "Centered map on your location",
        });
      })
      .catch((error) => {
        console.error("Error getting user location:", error);
        toast({
          title: "Location unavailable",
          description: "Using default location (Budapest)",
          variant: "destructive",
        });
      });
  }, [toast]);

  // Exclude completed listings from the map view
  const activeListings = listings.filter(listing => listing.status !== 'completed');

  // Calculate distances for listings with coordinates
  const listingsWithDistance: BottleListingWithDistance[] = activeListings
    .filter(listing => listing.latitude && listing.longitude)
    .map(listing => {
      if (userLocation && listing.latitude && listing.longitude) {
        const distance = calculateDistance(
          userLocation[0],
          userLocation[1],
          listing.latitude,
          listing.longitude
        );
        return { ...listing, distance: formatDistance(distance), distanceKm: distance };
      }
      return { ...listing, distance: "Unknown", distanceKm: Infinity };
    })
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

  const filteredListings = listingsWithDistance.filter(listing => {
    const location = listing.locationAddress || "";
    const user = listing.createdByUserName || "";
    const title = listing.title || "";
    return (
      location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCenterOnUser = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      toast({
        title: "Centered on your location",
      });
    } else {
      getUserLocation()
        .then((location) => {
          setUserLocation(location);
          setMapCenter(location);
          toast({
            title: "Location found",
            description: "Centered map on your location",
          });
        })
        .catch(() => {
          toast({
            title: "Location unavailable",
            description: "Please enable location services",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onBackToHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bottle Map</h1>
                <p className="text-sm text-gray-600">
                  {filteredListings.length} bottle{filteredListings.length !== 1 ? 's' : ''} near you
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleCenterOnUser}>
                <Navigation className="w-4 h-4 mr-2" />
                My Location
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Map Area */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={DEFAULT_ZOOM}
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController center={mapCenter} selectedListing={selectedListing} />

            {/* User Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={createUserLocationIcon()}>
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold">Your Location</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Bottle Listing Markers */}
            {filteredListings.map((listing) => {
              if (!listing.latitude || !listing.longitude) return null;

              const bottleCount = listing.bottleCount;
              const isSelected = selectedListing?.id === listing.id;
              const icon = isSelected
                ? createSelectedMarkerIcon(bottleCount)
                : createBottleIcon(bottleCount);

              return (
                <Marker
                  key={listing.id}
                  position={[listing.latitude, listing.longitude]}
                  icon={icon}
                  eventHandlers={{
                    click: () => setSelectedListing(listing),
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-semibold text-lg mb-2">
                        {listing.title || `${bottleCount} Bottles`}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {listing.locationAddress}
                      </p>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500">Distance:</span>
                        <Badge variant="secondary">{listing.distance}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-500">Your share:</span>
                        <span className="font-semibold text-green-600">
                          {Math.round(listing.estimatedRefund / 2)} HUF
                        </span>
                      </div>
                      {listing.userId === user?.id ? (
                        <Button
                          size="sm"
                          className="w-full bg-blue-600"
                          variant="secondary"
                          disabled
                        >
                          Your Listing
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                          onClick={() => setSelectedListing(listing)}
                          disabled={listing.status !== 'open'}
                        >
                          {listing.createdByUserEmail === user.email}
                          {/*{listing.status === 'open' ? 'Offer to Pick Up' : `Status: ${listing.status}`}*/}
                        </Button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Listings Sidebar */}
        <div className="w-80 bg-white border-l border-green-100 overflow-y-auto">
          <div className="p-4 border-b border-green-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by location or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Nearby Bottles ({filteredListings.length})
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Sorted by distance from your location
            </p>

            <div className="space-y-3">
              {filteredListings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No bottles found nearby</p>
                  <p className="text-xs mt-1">Try adjusting your search</p>
                </div>
              ) : (
                filteredListings.map((listing) => {
                  const bottleCount = listing.bottleCount;
                  const location = listing.locationAddress || "Unknown location";
                  const title = listing.title || `${bottleCount} Bottles`;

                  return (
                    <Card
                      key={listing.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedListing?.id === listing.id
                          ? 'border-purple-500 shadow-md bg-purple-50'
                          : 'border-green-100 hover:border-green-300'
                      }`}
                      onClick={() => {
                        setSelectedListing(listing);
                        if (listing.latitude && listing.longitude) {
                          setMapCenter([listing.latitude, listing.longitude]);
                        }
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              selectedListing?.id === listing.id
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600'
                            }`}>
                              {bottleCount}
                            </div>
                            <div>
                              <CardTitle className="text-sm">{title}</CardTitle>
                              <p className="text-xs text-gray-600">{location}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {listing.distance}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500">Your share:</span>
                          <span className="font-medium text-green-600">
                            {Math.round(listing.estimatedRefund / 2)} HUF
                          </span>
                        </div>

                        <div className="text-xs mb-2">
                          <Badge
                            variant={listing.status === 'open' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {listing.status}
                          </Badge>
                        </div>

                        {selectedListing?.id === listing.id && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {listing.userId === user?.id ? (
                              <Button
                                size="sm"
                                className="w-full bg-blue-600"
                                variant="secondary"
                                disabled
                              >
                                Your Listing
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                disabled={listing.status !== 'open'}
                              >
                                {listing.status === 'open' ? 'Offer to Pick Up' : `Status: ${listing.status}`}
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
