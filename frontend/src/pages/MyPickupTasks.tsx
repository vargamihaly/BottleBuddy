import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { BottleListingCard } from "@/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useBottleListings } from "@/hooks/useBottleListings";

const MyPickupTasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  const {
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    myPickupRequests,
    isLoading,
    isError,
  } = useBottleListings();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your pickup tasks.</p>
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
                <h1 className="text-2xl font-bold text-gray-900">My Pickup Tasks</h1>
                <p className="text-sm text-gray-600">Manage all your pickup tasks</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active" className="relative">
              Active
              {myPickupTaskListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                  {myPickupTaskListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              Completed
              {myCompletedPickupTaskListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                  {myCompletedPickupTaskListings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Pickup tasks pending or in progress
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load pickup tasks.</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : myPickupTaskListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active pickup tasks</h3>
                  <p className="text-gray-600 mb-4">Browse available bottles to start picking up!</p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    Browse Bottles
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPickupTaskListings.map((listing) => (
                  <BottleListingCard
                    key={listing.id}
                    listing={listing}
                    isOwnListing={false}
                    myPickupRequests={myPickupRequests}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Successfully completed bottle pickups
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : myCompletedPickupTaskListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed pickup tasks</h3>
                  <p className="text-gray-600">
                    Completed pickups will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCompletedPickupTaskListings.map((listing) => (
                  <BottleListingCard
                    key={listing.id}
                    listing={listing}
                    isOwnListing={false}
                    myPickupRequests={myPickupRequests}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyPickupTasks;