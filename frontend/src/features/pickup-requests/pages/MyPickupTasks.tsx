import {useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/shared/ui/button";
import {Card, CardContent} from "@/shared/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {Badge} from "@/shared/ui/badge";
import {BottomNav} from "@/shared/ui/bottom-nav";
import {ArrowLeft, Plus} from "lucide-react";
import {BottleListingCard, BottleListingsGridSkeleton} from "@/features/listings/components";
import {useAuth} from "@/contexts/AuthContext";
import {useBottleListingOverview} from "@/features/listings/hooks";
import {useTranslation} from "react-i18next";

const MyPickupTasks = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");

    const {
        myPickupTaskListings,
        myCompletedPickupTaskListings,
        myPickupRequests,
        isLoading,
        isError,
    } = useBottleListingOverview();

    // Count by status
    const counts = useMemo(
        () => ({
            all: myPickupTaskListings.length + myCompletedPickupTaskListings.length,
            active: myPickupTaskListings.length,
            completed: myCompletedPickupTaskListings.length,
        }),
        [myPickupTaskListings, myCompletedPickupTaskListings]
    );

    if (!user) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
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
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/")}
                                className="lg:hidden"
                            >
                                <ArrowLeft className="w-5 h-5"/>
                            </Button>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    {t("myPickupTasks.title")}
                                </h1>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {t("myPickupTasks.subtitle")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-20 md:pb-8 space-y-6">
                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "all" | "active" | "completed")}
                    className="space-y-4"
                >
                    {/* Tabs */}
                    <TabsList className="bg-card/80 backdrop-blur-sm border border-border p-1 h-auto">
                        {(["all", "active", "completed"] as const).map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="capitalize gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                {tab === "all"
                                    ? t("myPickupTasks.tabs.all")
                                    : t(`myPickupTasks.tabs.${tab}`)}
                                <Badge
                                    variant="secondary"
                                    className="h-5 px-1.5 text-xs data-[state=active]:bg-primary-foreground/20"
                                >
                                    {counts[tab]}
                                </Badge>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Tab Contents */}
                    {/* All Tab */}
                    <TabsContent value="all" className="mt-0">
                        {isLoading ? (
                            <BottleListingsGridSkeleton count={6}/>
                        ) : isError ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{t("myPickupTasks.error.title")}</p>
                                <Button onClick={() => window.location.reload()} variant="outline">
                                    {t("myPickupTasks.error.button")}
                                </Button>
                            </div>
                        ) : counts.all === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Plus className="w-8 h-8 text-muted-foreground"/>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {t("myPickupTasks.empty.active.title")}
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs mb-4">
                                    {t("myPickupTasks.empty.active.message")}
                                </p>
                                <Button
                                    onClick={() => navigate("/")}
                                    className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                >
                                    {t("myPickupTasks.empty.active.button")}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
                                {[...myPickupTaskListings, ...myCompletedPickupTaskListings].map((listing) => (
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

                    {/* Active Tab */}
                    <TabsContent value="active" className="mt-0">
                        {isLoading ? (
                            <BottleListingsGridSkeleton count={6}/>
                        ) : isError ? (
                            <div className="text-center py-12">
                                <p className="text-red-600 mb-4">{t("myPickupTasks.error.title")}</p>
                                <Button onClick={() => window.location.reload()} variant="outline">
                                    {t("myPickupTasks.error.button")}
                                </Button>
                            </div>
                        ) : myPickupTaskListings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Plus className="w-8 h-8 text-muted-foreground"/>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {t("myPickupTasks.empty.active.title")}
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs mb-4">
                                    {t("myPickupTasks.empty.active.message")}
                                </p>
                                <Button
                                    onClick={() => navigate("/")}
                                    className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                                >
                                    {t("myPickupTasks.empty.active.button")}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
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

                    {/* Completed Tab */}
                    <TabsContent value="completed" className="mt-0">
                        {isLoading ? (
                            <BottleListingsGridSkeleton count={6}/>
                        ) : myCompletedPickupTaskListings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <Plus className="w-8 h-8 text-muted-foreground"/>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-1">
                                    {t("myPickupTasks.empty.completed.title")}
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    {t("myPickupTasks.empty.completed.message")}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 lg:gap-5 md:grid-cols-2 lg:grid-cols-3">
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
            <BottomNav/>
        </div>
    );
};

export default MyPickupTasks;