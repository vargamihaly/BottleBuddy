import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  getUserLocation,
} from "@/lib/mapUtils";
import L from "leaflet";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
}

// Custom marker icon for the selected location
const createLocationIcon = () => {
  return L.divIcon({
    html: `
      <div class="custom-marker-wrapper">
        <div class="custom-marker selected-marker">
          <div class="marker-content">
            <span class="marker-icon">📍</span>
          </div>
        </div>
        <div class="marker-pulse active"></div>
      </div>
    `,
    className: "custom-div-icon",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });
};

// Component to handle map clicks
function MapClickHandler({
  onLocationChange,
}: {
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export const LocationPicker = ({
  onLocationSelect,
  initialLocation,
}: LocationPickerProps) => {
  const [position, setPosition] = useState<[number, number]>(
    initialLocation
      ? [initialLocation.latitude, initialLocation.longitude]
      : DEFAULT_CENTER
  );
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const { toast } = useToast();

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data.display_name) {
        setAddress(data.display_name);
        onLocationSelect({
          address: data.display_name,
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      toast({
        title: "Address lookup failed",
        description: "Please enter the address manually",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Forward geocode to get coordinates from address search
  const forwardGeocode = async (query: string) => {
    if (!query.trim()) return;

    setIsLoadingAddress(true);
    try {
      // Using Nominatim for forward geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1&countrycodes=hu`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setPosition([lat, lng]);
        setAddress(result.display_name);
        onLocationSelect({
          address: result.display_name,
          latitude: lat,
          longitude: lng,
        });

        toast({
          title: "Location found",
          description: "Click on the map to adjust if needed",
        });
      } else {
        toast({
          title: "Location not found",
          description: "Try a different search or click on the map",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Forward geocoding failed:", error);
      toast({
        title: "Search failed",
        description: "Please try again or click on the map",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  const handleUseMyLocation = () => {
    getUserLocation()
      .then((location) => {
        setPosition(location);
        reverseGeocode(location[0], location[1]);
        toast({
          title: "Location found",
          description: "Using your current location",
        });
      })
      .catch(() => {
        toast({
          title: "Location unavailable",
          description: "Please enable location services or search manually",
          variant: "destructive",
        });
      });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    forwardGeocode(searchQuery);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    onLocationSelect({
      address: newAddress,
      latitude: position[0],
      longitude: position[1],
    });
  };

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-green-600" />
          <span>Pick Location on Map</span>
        </CardTitle>
        <CardDescription>
          Click on the map to select your bottle location, or search for an address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search address in Hungary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline" disabled={isLoadingAddress}>
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleUseMyLocation}
            disabled={isLoadingAddress}
          >
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </Button>
        </form>

        {/* Map Container */}
        <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-green-200">
          <MapContainer
            center={position}
            zoom={DEFAULT_ZOOM}
            className="h-full w-full"
            key={`${position[0]}-${position[1]}`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onLocationChange={handleMapClick} />
            <Marker position={position} icon={createLocationIcon()} />
          </MapContainer>
        </div>

        {/* Address Display/Edit */}
        <div className="space-y-2">
          <Label htmlFor="address-display">
            Selected Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address-display"
            value={address}
            onChange={handleAddressChange}
            placeholder="Address will appear here when you click on the map"
            disabled={isLoadingAddress}
          />
          <p className="text-xs text-gray-500">
            You can edit the address manually if needed
          </p>
        </div>

        {/* Coordinates Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Latitude</Label>
            <Input value={position[0].toFixed(6)} readOnly className="text-sm" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Longitude</Label>
            <Input value={position[1].toFixed(6)} readOnly className="text-sm" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> Click anywhere on the map to set your bottle location.
            The address will be automatically filled in.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
