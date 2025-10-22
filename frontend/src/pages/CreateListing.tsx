import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Info, Coins, Wallet } from "lucide-react";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import { LocationPicker } from "@/components/LocationPicker";

interface CreateListingRequest {
  title?: string;
  bottleCount: number;
  locationAddress: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  estimatedRefund: number;
  splitPercentage: number;
  pickupDeadline?: string;
}

const CreateListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    bottleCount: "",
    locationAddress: "",
    description: "",
    latitude: 0,
    longitude: 0,
    pickupDeadline: "",
  });

  const [hasLocation, setHasLocation] = useState(false);
  const [splitPercentage, setSplitPercentage] = useState(50);

  // Auto-calculate estimated refund (bottles × 50 HUF)
  const bottleCount = parseInt(formData.bottleCount) || 0;
  const estimatedRefund = bottleCount * 50;
  const yourShare = Math.round((estimatedRefund * splitPercentage) / 100);
  const volunteerShare = estimatedRefund - yourShare;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      locationAddress: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
    setHasLocation(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a listing",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!hasLocation || !formData.locationAddress) {
      toast({
        title: "Location required",
        description: "Please select a location on the map",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const requestBody: CreateListingRequest = {
        bottleCount,
        locationAddress: formData.locationAddress,
        estimatedRefund,
        splitPercentage,
      };

      // Add optional fields if provided
      if (formData.title) requestBody.title = formData.title;
      if (formData.description) requestBody.description = formData.description;
      if (hasLocation) {
        requestBody.latitude = formData.latitude;
        requestBody.longitude = formData.longitude;
      }
      if (formData.pickupDeadline) requestBody.pickupDeadline = new Date(formData.pickupDeadline).toISOString();

      await apiClient.post("/api/bottlelistings", requestBody);

      toast({
        title: "Success!",
        description: "Your bottle listing has been created",
      });

      navigate("/");
    } catch (error: unknown) {
      console.error("Failed to create listing:", error);
      toast({
        title: "Error",
        description:
          error instanceof ApiRequestError
            ? error.getUserMessage()
            : error instanceof Error
            ? error.message
            : "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl">List Your Bottles</CardTitle>
            <CardDescription>
              Share your bottle collection details and connect with volunteers who can help return them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., 50 bottles near City Center"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength={200}
                />
              </div>

              {/* Bottle Count (Required) */}
              <div className="space-y-2">
                <Label htmlFor="bottleCount">
                  Number of Bottles <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bottleCount"
                  name="bottleCount"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.bottleCount}
                  onChange={handleInputChange}
                  required
                  min={1}
                  max={10000}
                />
              </div>

              {/* Location Picker (Required) */}
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={
                  hasLocation
                    ? {
                        address: formData.locationAddress,
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                      }
                    : undefined
                }
              />

              {/* Description (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add any additional details about the bottles, pickup instructions, etc."
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={1000}
                  rows={4}
                />
              </div>

              {/* How It Works Information */}
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-900">
                  <strong>How payment works:</strong> The volunteer who picks up your bottles will return them to a collection point and receive the full refund.
                  They will then pay you your agreed share in cash when picking up the bottles. You both benefit from recycling together!
                </AlertDescription>
              </Alert>

              {/* Estimated Refund (Auto-calculated) */}
              <div className="space-y-2">
                <Label>
                  <Coins className="w-4 h-4 inline mr-1" />
                  Total Bottle Refund
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={`${estimatedRefund} HUF`}
                    readOnly
                    className="bg-gray-50 font-semibold text-lg"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    ({bottleCount} × 50 HUF)
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Automatically calculated: Each bottle refund is 50 HUF in Hungary
                </p>
              </div>

              {/* Split Percentage Slider */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    <Wallet className="w-4 h-4 inline mr-1" />
                    Your Share: {splitPercentage}%
                  </Label>
                  <Slider
                    value={[splitPercentage]}
                    onValueChange={(value) => setSplitPercentage(value[0])}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <p className="text-xs text-gray-600 mb-1">You receive (cash)</p>
                      <p className="text-2xl font-bold text-green-700">{yourShare} HUF</p>
                      <p className="text-xs text-gray-500 mt-1">{splitPercentage}% of total</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="text-xs text-gray-600 mb-1">Volunteer keeps</p>
                      <p className="text-2xl font-bold text-blue-700">{volunteerShare} HUF</p>
                      <p className="text-xs text-gray-500 mt-1">{100 - splitPercentage}% of total</p>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-xs text-center text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  💡 <strong>Tip:</strong> Most users choose 50/50 split. Adjust to attract more volunteers or get a bigger share!
                </p>
              </div>

              {/* Pickup Deadline (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="pickupDeadline">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Pickup Deadline (Optional)
                </Label>
                <Input
                  id="pickupDeadline"
                  name="pickupDeadline"
                  type="datetime-local"
                  value={formData.pickupDeadline}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Listing"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateListing;
