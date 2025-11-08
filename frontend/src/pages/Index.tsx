import { useState } from "react";
import { UserDashboard } from "@/components/UserDashboard";
import { MapView } from "@/components/MapView";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useBottleListings } from "@/hooks/useBottleListings";
import { useAuth } from "@/contexts/AuthContext";
import {
  Header,
  HeroSection,
  StatsSection,
  HowItWorksSection,
  MyListingsSection,
  AvailableBottlesSection,
  CTASection,
  Footer
} from "@/components/HomePage";
import {
  WelcomeWidget,
  QuickActionsBar,
  MyActivePickupsWidget,
  EarningsWidget
} from "@/components/Dashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user } = useAuth();

  const {
    bottleListings,
    myListings,
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    availableListings,
    myPickupRequests,
    isLoading,
    isError,
  } = useBottleListings();

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

  // Authenticated User - Dashboard View
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header
          onMapClick={() => setActiveTab("map")}
          onDashboardClick={() => setActiveTab("dashboard")}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Welcome Section */}
            <WelcomeWidget />

            {/* Quick Actions */}
            <QuickActionsBar onMapClick={() => setActiveTab("map")} />

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Active Pickups */}
              <MyActivePickupsWidget
                pickupRequests={myPickupRequests}
                listings={bottleListings}
              />

              {/* Earnings Widget */}
              <EarningsWidget />
            </div>

            {/* My Listings Section */}
            <MyListingsSection
              listings={myListings}
              isLoading={isLoading}
            />

            {/* Available Bottles Section */}
            <AvailableBottlesSection
              listings={availableListings}
              pickupRequests={myPickupRequests}
              isLoading={isLoading}
              isError={isError}
              onMapClick={() => setActiveTab("map")}
            />
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Non-Authenticated User - Marketing View
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header
        onMapClick={() => setActiveTab("map")}
        onDashboardClick={() => setActiveTab("dashboard")}
      />

      <HeroSection onMapClick={() => setActiveTab("map")} />

      <StatsSection />

      <HowItWorksSection />

      <CTASection onDashboardClick={() => setActiveTab("dashboard")} />

      <Footer />
    </div>
  );
};

export default Index;