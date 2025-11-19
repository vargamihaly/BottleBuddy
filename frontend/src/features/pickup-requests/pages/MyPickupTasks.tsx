import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Badge } from "@/shared/ui/badge";
import { BottomNav } from "@/shared/ui/bottom-nav";
import { ArrowLeft } from "lucide-react";
import { BottleListingCard } from "@/features/listings/components";
import { BottleListingsGridSkeleton } from "@/features/listings/components";
import { useAuth } from "@/contexts/AuthContext";
import { useBottleListingOverview } from "@/features/listings/hooks";
import { useTranslation } from "react-i18next";

const MyPickupTasks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("active");

  const {
    myPickupTaskListings,
    myCompletedPickupTaskListings,
    myPickupRequests,
    isLoading,
    isError,
  } = useBottleListingOverview();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("myPickupTasks.signInRequired")}</h2>
            <p className="text-gray-600 mb-6">{t("myPickupTasks.signInMessage")}</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              {t("myPickupTasks.signIn")}
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
                <h1 className="text-2xl font-bold text-gray-900">{t("myPickupTasks.title")}</h1>
                <p className="text-sm text-gray-600">{t("myPickupTasks.subtitle")}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active" className="relative">
              {t("myPickupTasks.tabs.active")}
              {myPickupTaskListings.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                  {myPickupTaskListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="relative">
              {t("myPickupTasks.tabs.completed")}
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
                {t("myPickupTasks.descriptions.active")}
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{t("myPickupTasks.error.title")}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  {t("myPickupTasks.error.button")}
                </Button>
              </div>
            ) : myPickupTaskListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("myPickupTasks.empty.active.title")}</h3>
                  <p className="text-gray-600 mb-4">{t("myPickupTasks.empty.active.message")}</p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    {t("myPickupTasks.empty.active.button")}
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
                {t("myPickupTasks.descriptions.completed")}
              </p>
            </div>
            {isLoading ? (
              <BottleListingsGridSkeleton count={6} />
            ) : myCompletedPickupTaskListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("myPickupTasks.empty.completed.title")}</h3>
                  <p className="text-gray-600">
                    {t("myPickupTasks.empty.completed.message")}
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
      <BottomNav />
    </div>
  );
};

export default MyPickupTasks;