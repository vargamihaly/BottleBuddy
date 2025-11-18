import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { Badge } from "@/components/badge";
import { BottomNav } from "@/components/bottom-nav";
import { ArrowLeft, Plus } from "lucide-react";
import { BottleListingCard } from "@/features/bottle-listings/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/features/bottle-listings/components/BottleListingSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBottleListings } from "@/hooks/api";

const MyListings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  const {
    data: bottleListings = [],
    isLoading,
    isError,
  } = useMyBottleListings({ enabled: !!user });

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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("myListingsPage.signInRequired")}</h2>
            <p className="text-gray-600 mb-6">{t("myListingsPage.signInMessage")}</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              {t("myListingsPage.signIn")}
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
                <h1 className="text-2xl font-bold text-gray-900">{t("myListingsPage.title")}</h1>
                <p className="text-sm text-gray-600">{t("myListingsPage.subtitle")}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/create-listing")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("myListingsPage.newListing")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="active" className="relative">
              {t("myListingsPage.tabs.active")}
              {activeListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                  {activeListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="claimed" className="relative">
              {t("myListingsPage.tabs.claimed")}
              {claimedListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                  {claimedListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              {t("myListingsPage.tabs.completed")}
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
                {t("myListingsPage.descriptions.active")}
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{t("myListingsPage.error.title")}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  {t("myListingsPage.error.button")}
                </Button>
              </div>
            ) : activeListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("myListingsPage.empty.active.title")}</h3>
                  <p className="text-gray-600 mb-4">{t("myListingsPage.empty.active.message")}</p>
                  <Button
                    onClick={() => navigate("/create-listing")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("myListingsPage.empty.active.button")}
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
                {t("myListingsPage.descriptions.claimed")}
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : claimedListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("myListingsPage.empty.claimed.title")}</h3>
                  <p className="text-gray-600">
                    {t("myListingsPage.empty.claimed.message")}
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
                {t("myListingsPage.descriptions.completed")}
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : completedListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("myListingsPage.empty.completed.title")}</h3>
                  <p className="text-gray-600">
                    {t("myListingsPage.empty.completed.message")}
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
      <BottomNav />
    </div>
  );
};

export default MyListings;