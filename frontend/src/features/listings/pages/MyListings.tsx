import {useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Button} from "@/shared/ui/button";
import {Card, CardContent} from "@/shared/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {Badge} from "@/shared/ui/badge";
import {BottomNav} from "@/shared/ui/bottom-nav";
import {ArrowLeft, Plus} from "lucide-react";
import {BottleListingsGridSkeleton} from "@/features/listings/components";
import {ListingStats} from "@/features/listings/components/ListingStats";
import {ListingFilters, FilterState} from "@/features/listings/components/ListingFilters";
import {CompactListingCard} from "@/features/listings/components/CompactListingCard";
import {useAuth} from "@/contexts/AuthContext";
import {useMyListingsEnhanced} from "@/features/listings/hooks/useMyListingsEnhanced";
import {useDeleteBottleListing} from "@/features/listings/hooks";
import {ListingStatus} from "@/shared/types";

const MyListings = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState<ListingStatus | "all">("all");

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "date",
    sortDesc: true,
    bottleRange: "all",
    hasRequests: null,
    deadlineFilter: "all",
  });

  // Fetch enhanced data (listings + stats)
  const {listings, stats, isLoading, isError} = useMyListingsEnhanced();

  // Delete mutation
  const deleteMutation = useDeleteBottleListing();

  // Client-side filtering and sorting
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Filter by tab (status)
    if (activeTab !== "all") {
      result = result.filter((l) => l.status === activeTab);
    }

    // Filter by bottle range
    if (filters.bottleRange !== "all") {
      result = result.filter((l) => {
        if (filters.bottleRange === "1-10") return l.bottleCount >= 1 && l.bottleCount <= 10;
        if (filters.bottleRange === "11-50") return l.bottleCount >= 11 && l.bottleCount <= 50;
        if (filters.bottleRange === "50+") return l.bottleCount > 50;
        return true;
      });
    }

    // Filter by has requests
    if (filters.hasRequests !== null) {
      result = result.filter((l) =>
        filters.hasRequests ? l.pendingRequests > 0 : l.pendingRequests === 0
      );
    }

    // Filter by deadline
    if (filters.deadlineFilter !== "all") {
      result = result.filter((l) => {
        if (filters.deadlineFilter === "past") {
          return l.deadline && new Date(l.deadline) < new Date();
        }
        if (filters.deadlineFilter === "upcoming") {
          return l.deadline && new Date(l.deadline) > new Date();
        }
        return true;
      });
    }

    // Sort
    switch (filters.sortBy) {
      case "date":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "bottles":
        result.sort((a, b) => b.bottleCount - a.bottleCount);
        break;
      case "refund":
        result.sort((a, b) => b.estimatedRefund - a.estimatedRefund);
        break;
      case "deadline":
        result.sort((a, b) => {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        break;
    }

    // Apply sort direction
    if (!filters.sortDesc) {
      result.reverse();
    }

    return result;
  }, [listings, filters, activeTab]);

  // Count by status
  const counts = useMemo(
    () => ({
      all: listings.length,
      open: listings.filter((l) => l.status === "open").length,
      claimed: listings.filter((l) => l.status === "claimed").length,
      completed: listings.filter((l) => l.status === "completed").length,
    }),
    [listings]
  );

  // Action handlers
  const handleDelete = (id: string) => {
    if (confirm(t("listing.deleteConfirm"))) {
      deleteMutation.mutate(id);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("myListingsPage.signInRequired")}
            </h2>
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="lg:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {t("myListingsPage.title")}
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  {t("myListingsPage.subtitle")}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/create-listing")}
              className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t("myListingsPage.newListing")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8 space-y-6">
        {/* Stats Section */}
        <ListingStats stats={stats} isLoading={isLoading} />

        {/* Tabs + Filters */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as ListingStatus | "all")}
          className="space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Tabs on the left */}
            <TabsList className="bg-card/80 backdrop-blur-sm border border-border p-1 h-auto">
              {(["all", "open", "claimed", "completed"] as const).map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab === "all"
                    ? t("myListingsPage.tabs.all")
                    : tab === "open"
                    ? t("myListingsPage.tabs.active")
                    : t(`myListingsPage.tabs.${tab}`)}
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-xs data-[state=active]:bg-primary-foreground/20"
                  >
                    {counts[tab]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Filters on the right */}
            <ListingFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Tab Contents */}
          {(["all", "open", "claimed", "completed"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              {isLoading ? (
                <BottleListingsGridSkeleton count={6} />
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">{t("myListingsPage.error.title")}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    {t("myListingsPage.error.button")}
                  </Button>
                </div>
              ) : filteredListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {filters.bottleRange !== "all" ||
                    filters.hasRequests !== null ||
                    filters.deadlineFilter !== "all"
                      ? t("myListingsPage.emptyWithFilters")
                      : tab === "all"
                      ? "No listings found"
                      : t(`myListingsPage.empty.${tab === "open" ? "active" : tab}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {filters.bottleRange !== "all" ||
                    filters.hasRequests !== null ||
                    filters.deadlineFilter !== "all"
                      ? "Try adjusting your filters"
                      : tab === "all"
                      ? "Create your first listing to start collecting bottles"
                      : `No ${tab} listings match your filters`}
                  </p>
                  {tab === "all" &&
                    filters.bottleRange === "all" &&
                    filters.hasRequests === null &&
                    filters.deadlineFilter === "all" && (
                      <Button
                        onClick={() => navigate("/create-listing")}
                        className="mt-4 gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <Plus className="w-4 h-4" />
                        {t("myListingsPage.empty.active.button")}
                      </Button>
                    )}
                </div>
              ) : (
                <div className="grid gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filteredListings.map((listing) => (
                    <CompactListingCard
                      key={listing.id}
                      listing={listing}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default MyListings;