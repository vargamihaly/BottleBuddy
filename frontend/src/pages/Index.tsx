import { useState } from "react";
import { UserDashboard } from "@/components/UserDashboard";
import { MapView } from "@/components/MapView";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useBottleListings } from "@/hooks/useBottleListings";
import {
  Header,
  HeroSection,
  StatsSection,
  HowItWorksSection,
  MyListingsSection,
  MyPickupTasksSection,
  AvailableBottlesSection,
  CTASection,
  Footer
} from "@/components/HomePage";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header
        onMapClick={() => setActiveTab("map")}
        onDashboardClick={() => setActiveTab("dashboard")}
      />

      <HeroSection onMapClick={() => setActiveTab("map")} />

      <StatsSection />

      <HowItWorksSection />

      <MyListingsSection
        listings={myListings}
        isLoading={isLoading}
      />

      <MyPickupTasksSection
        activeListings={myPickupTaskListings}
        completedListings={myCompletedPickupTaskListings}
        pickupRequests={myPickupRequests}
        isLoading={isLoading}
      />

      <AvailableBottlesSection
        listings={availableListings}
        pickupRequests={myPickupRequests}
        isLoading={isLoading}
        isError={isError}
        onMapClick={() => setActiveTab("map")}
      />

      <CTASection onDashboardClick={() => setActiveTab("dashboard")} />

      <Footer />
    </div>
  );
};

export default Index;