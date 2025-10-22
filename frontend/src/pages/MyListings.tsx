import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { BottleListingCard } from "@/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { BottleListing, PaginatedResponse } from "@/types";
import { apiClient } from "@/lib/apiClient";

const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  const fetchBottleListings = async (): Promise<BottleListing[]> => {
    const response = await apiClient.get<PaginatedResponse<BottleListing>>('/api/bottlelistings');
    return response.data;
  };

  const {
    data: bottleListings = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["bottleListings"], queryFn: fetchBottleListings });

  // Filter user's own listings
  const myListings = bottleListings.filter(listing => listing.createdByUserEmail === user?.email);

  // Categorize listings by status
  const activeListings = myListings.filter(listing => listing.status === 'open');
  const claimedListings = myListings.filter(listing => listing.status === 'claimed');
  const completedListings = myListings.filter(listing => listing.status === 'completed');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your listings.</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
                <p className="text-sm text-gray-600">Manage all your bottle listings</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/create-listing")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Listing
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="active" className="relative">
              Active
              {activeListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                  {activeListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="claimed" className="relative">
              Claimed
              {claimedListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                  {claimedListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              {completedListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                  {completedListings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Listings available for pickup requests
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load listings.</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : activeListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active listings</h3>
                  <p className="text-gray-600 mb-4">Create a new listing to get started!</p>
                  <Button
                    onClick={() => navigate("/create-listing")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Listing
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeListings.map((listing) => (
                  <BottleListingCard key={listing.id} listing={listing} isOwnListing={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="claimed" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Listings with accepted pickup requests
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : claimedListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No claimed listings</h3>
                  <p className="text-gray-600">
                    Listings appear here when you accept a pickup request.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {claimedListings.map((listing) => (
                  <BottleListingCard key={listing.id} listing={listing} isOwnListing={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Successfully completed bottle exchanges
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : completedListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed listings</h3>
                  <p className="text-gray-600">
                    Completed exchanges will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedListings.map((listing) => (
                  <BottleListingCard key={listing.id} listing={listing} isOwnListing={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyListings;