import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, DollarSign, Percent } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { LocationPicker } from "@/components/LocationPicker";

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
    estimatedRefund: "",
    pickupDeadline: "",
    splitPercentage: "50",
  });

  const [hasLocation, setHasLocation] = useState(false);

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
      const requestBody: any = {
        bottleCount: parseInt(formData.bottleCount),
        locationAddress: formData.locationAddress,
        estimatedRefund: parseFloat(formData.estimatedRefund),
      };

      // Add optional fields if provided
      if (formData.title) requestBody.title = formData.title;
      if (formData.description) requestBody.description = formData.description;
      if (hasLocation) {
        requestBody.latitude = formData.latitude;
        requestBody.longitude = formData.longitude;
      }
      if (formData.pickupDeadline) requestBody.pickupDeadline = new Date(formData.pickupDeadline).toISOString();
      if (formData.splitPercentage) requestBody.splitPercentage = parseFloat(formData.splitPercentage);

      await apiClient.post("/api/bottlelistings", requestBody);

      toast({
        title: "Success!",
        description: "Your bottle listing has been created",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Failed to create listing:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create listing. Please try again.",
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

              {/* Estimated Refund (Required) */}
              <div className="space-y-2">
                <Label htmlFor="estimatedRefund">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Estimated Refund (HUF) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="estimatedRefund"
                  name="estimatedRefund"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1250 (50 HUF × 25 bottles)"
                  value={formData.estimatedRefund}
                  onChange={handleInputChange}
                  required
                  min={0}
                />
                <p className="text-xs text-gray-500">
                  In Hungary, each bottle refund is typically 50 HUF
                </p>
              </div>

              {/* Split Percentage (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="splitPercentage">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Your Share (%) (Optional)
                </Label>
                <Input
                  id="splitPercentage"
                  name="splitPercentage"
                  type="number"
                  step="1"
                  placeholder="50"
                  value={formData.splitPercentage}
                  onChange={handleInputChange}
                  min={0}
                  max={100}
                />
                <p className="text-xs text-gray-500">
                  Default is 50% - you and the volunteer split the refund equally
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
