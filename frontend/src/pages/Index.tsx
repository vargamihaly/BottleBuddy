import { useState } from "react";
import { UserDashboard } from "@/components/UserDashboard";
import { MapView } from "@/components/MapView";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/ui/bottom-nav";
import { useIndex } from "@/hooks/useIndex";
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
  MyActiveListingsWidget,
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
  } = useIndex();

  if (activeTab === "dashboard") {
    return (
      <>
        <UserDashboard onBackToHome={() => setActiveTab("home")} />
        <BottomNav
          onHomeClick={() => setActiveTab("home")}
          onMapClick={() => setActiveTab("map")}
          onDashboardClick={() => setActiveTab("dashboard")}
          activeTab={activeTab}
        />
      </>
    );
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
      <>
        <MapView
          listings={bottleListings}
          onBackToHome={() => setActiveTab("home")}
        />
        <BottomNav
          onHomeClick={() => setActiveTab("home")}
          onMapClick={() => setActiveTab("map")}
          onDashboardClick={() => setActiveTab("dashboard")}
          activeTab={activeTab}
        />
      </>
    );
  }

  // Authenticated User - Dashboard View
  if (user) {
    // Filter active listings (open or claimed status)
    const activeListings = myListings.filter(
      listing => listing.status === 'open' || listing.status === 'claimed'
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header
          onMapClick={() => setActiveTab("map")}
          onDashboardClick={() => setActiveTab("dashboard")}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
          <div className="space-y-6">
            {/* Primary CTA Section - Full Width */}
            <div className="space-y-4">
              <WelcomeWidget />
              <QuickActionsBar onMapClick={() => setActiveTab("map")} />
            </div>

            {/* In-Progress Section - Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: Active Pickups */}
              <MyActivePickupsWidget
                pickupRequests={myPickupRequests}
                listings={bottleListings}
              />

              {/* Right: My Active Listings */}
              <MyActiveListingsWidget />
            </div>

            {/* Motivation Section - Full Width */}
            <EarningsWidget />

            {/* Discovery Section - Full Width */}
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
        <BottomNav
          onHomeClick={() => setActiveTab("home")}
          onMapClick={() => setActiveTab("map")}
          onDashboardClick={() => setActiveTab("dashboard")}
          activeTab={activeTab}
        />
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
      <BottomNav
        onHomeClick={() => setActiveTab("home")}
        onMapClick={() => setActiveTab("map")}
        onDashboardClick={() => setActiveTab("dashboard")}
        activeTab={activeTab}
      />
    </div>
  );
};

export default Index;