import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Star, Bell, Plus, ArrowRight, LogOut, Info, Recycle } from "lucide-react";
import { BottleListingCard } from "@/components/BottleListingCard";
import { UserDashboard } from "@/components/UserDashboard";
import { MapView } from "@/components/MapView";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BottleListing, PaginatedResponse, PickupRequest } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { FullPageLoader } from "@/components/LoadingSpinner";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchBottleListings = async (): Promise<BottleListing[]> => {
    const response = await apiClient.get<PaginatedResponse<BottleListing>>('/api/bottlelistings');
    return response.data; // Extract the data array from the paginated response
  };

  const fetchMyPickupRequests = async (): Promise<PickupRequest[]> => {
    if (!user) return [];
    const response = await apiClient.get<PickupRequest[]>('/api/pickuprequests/my-requests');
    return response;
  };

  const {
    data: bottleListings = [],
    isLoading,
    isError,
  } = useQuery({ queryKey: ["bottleListings"], queryFn: fetchBottleListings });

  const {
    data: myPickupRequests = [],
  } = useQuery({
    queryKey: ["myPickupRequests"],
    queryFn: fetchMyPickupRequests,
    enabled: !!user
  });

  // Separate user's own listings from others (exclude completed ones from homepage)
  const myListings = bottleListings.filter(
    listing => listing.createdByUserEmail === user?.email && listing.status !== 'completed'
  );

  // Get IDs of listings with accepted pickup requests by this user
  const acceptedListingIds = myPickupRequests
    .filter(request => request.status === 'accepted')
    .map(request => request.listingId);

  // Separate other listings into accepted and available
  const acceptedPickupListings = bottleListings.filter(
    listing => listing.createdByUserEmail !== user?.email && acceptedListingIds.includes(listing.id)
  );

  const otherListings = bottleListings.filter(
    listing => listing.createdByUserEmail !== user?.email && !acceptedListingIds.includes(listing.id) && listing.status !== 'completed',
  );

  if (activeTab === "dashboard") {
    return <UserDashboard onBackToHome={() => setActiveTab("home")} />;
  }

  if (activeTab === "map") {
    if (isLoading) {
      return <FullPageLoader text="Loading bottle listings..." />;
    }
    if (isError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">Failed to load bottle listings.</p>
            <Button onClick={() => setActiveTab("home")} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      );
    }
    return (
      <MapView
        listings={bottleListings}
        onBackToHome={() => setActiveTab("home")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                <Recycle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">BottleBuddy</h1>
                <p className="text-xs text-gray-600">Share. Return. Recycle.</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-700 hover:text-green-600">
                Home
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab("map")} className="text-gray-700 hover:text-green-600">
                <MapPin className="w-4 h-4 mr-2" />
                Explore Map
              </Button>
              <Button variant="ghost" onClick={() => navigate("/about")} className="text-gray-700 hover:text-green-600">
                <Info className="w-4 h-4 mr-2" />
                About
              </Button>
            </nav>

            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("dashboard")} className="hidden sm:flex">
                    <Users className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/about")} className="md:hidden">
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md">
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Your Bottles Into
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Shared Profit</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with your community to return plastic bottles together. Split the 50 HUF refund and help Hungary recycle more efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <>
                <Button size="lg" onClick={() => navigate("/create-listing")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  List Your Bottles
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab("map")}>
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Nearby Bottles
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" onClick={() => navigate("/auth")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2,847</div>
              <p className="text-gray-600">Bottles Returned</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">142,350</div>
              <p className="text-gray-600">HUF Shared</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">523</div>
              <p className="text-gray-600">Active Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How BottleShare Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-green-200 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <CardTitle className="text-xl">List Your Bottles</CardTitle>
                <CardDescription>
                  Post how many bottles you have and your location. Set your preferred split arrangement.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚗</span>
                </div>
                <CardTitle className="text-xl">Get Matched</CardTitle>
                <CardDescription>
                  Nearby volunteers see your listing and can offer to pick up and return your bottles.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:border-green-300 transition-colors">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <CardTitle className="text-xl">Split the Refund</CardTitle>
                <CardDescription>
                  The 50 HUF per bottle refund is split as agreed. Both parties benefit from the exchange.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* My Listings Section (only show if user has listings) */}
      {user && myListings.length > 0 && (
        <section className="py-12 px-4 bg-blue-50/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">My Active Listings</h3>
                <p className="text-sm text-gray-600 mt-1">Your bottles available for pickup</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {myListings.length} {myListings.length === 1 ? 'listing' : 'listings'}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => navigate("/my-listings")}>
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map((listing) => (
                  <BottleListingCard key={listing.id} listing={listing} isOwnListing={true} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* My Accepted Pickup Tasks Section */}
      {user && acceptedPickupListings.length > 0 && (
        <section className="py-12 px-4 bg-emerald-50/60 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">My Accepted Pickup Tasks</h3>
                <p className="text-sm text-gray-600 mt-1">Bottles you've committed to pick up</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                {acceptedPickupListings.length} {acceptedPickupListings.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={3} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedPickupListings.map((listing) => (
                  <BottleListingCard
                    key={listing.id}
                    listing={listing}
                    isOwnListing={false}
                    myPickupRequests={myPickupRequests}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Other Active Listings */}
      <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {user ? 'Available Bottles to Pick Up' : 'Active Bottle Listings'}
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                {user
                  ? 'Help others by picking up and returning their bottles'
                  : 'Sign in to start picking up bottles and earning'}
              </p>
            </div>
            <Button variant="outline" onClick={() => setActiveTab("map")}>
              View on Map
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {isLoading ? (
            <BottleListingsGridSkeleton count={6} />
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Failed to load bottle listings.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : otherListings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No listings available</h4>
              <p className="text-gray-500">
                {user
                  ? 'Be the first to list your bottles!'
                  : 'Sign in to see available bottle listings'}
              </p>
              {user && (
                <Button
                  className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600"
                  onClick={() => navigate("/create-listing")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  List Your Bottles
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherListings.map((listing) => (
                <BottleListingCard
                  key={listing.id}
                  listing={listing}
                  isOwnListing={false}
                  myPickupRequests={myPickupRequests}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Start Sharing?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join Hungary's growing community of eco-conscious bottle sharers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button size="lg" variant="secondary" onClick={() => navigate("/create-listing")}>
                  List Your Bottles
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" onClick={() => setActiveTab("dashboard")}>
                  View Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                  Sign Up Free
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Learn More
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Recycle className="w-6 h-6 text-green-500" />
                <span className="font-bold text-lg">BottleBuddy</span>
              </div>
              <p className="text-gray-400">
                Making recycling profitable and community-driven across Hungary.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate("/about")}>About Us</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>How it Works</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Safety Guidelines</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-green-400 cursor-pointer transition-colors">User Stories</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Environmental Impact</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Local Partners</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-green-400 cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-green-400 cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BottleBuddy. Made with 💚 in Hungary.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
