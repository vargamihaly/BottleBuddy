import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {BottomNav} from "@/components/ui/bottom-nav";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {ArrowLeft, Bell, Settings, Trash2} from "lucide-react";
import {useAuth} from "@/contexts/AuthContext";
import {
    useDeleteActivity,
    useMarkActivityAsRead,
    useMarkAllActivitiesAsRead,
    useUserActivities,
} from "@/hooks/api/useUserActivities";
import {UserActivityCategory} from "@/types";
import {formatDistanceToNow} from "date-fns";
import {Skeleton} from "@/components/ui/skeleton";
import {getActivityMessage} from "@/utils/activityTemplates";

const Notifications = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {user} = useAuth();

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [categoryFilter, setCategoryFilter] = useState<UserActivityCategory>(UserActivityCategory.All);
    const pageSize = 20;

    const {data, isLoading} = useUserActivities({
        page,
        pageSize,
        isRead: filter === "unread" ? false : undefined,
        category: categoryFilter !== UserActivityCategory.All ? categoryFilter : undefined,
    });

    const markAsRead = useMarkActivityAsRead();
    const deleteActivity = useDeleteActivity();
    const markAllAsRead = useMarkAllActivitiesAsRead();

    const handleMarkAsRead = (activityId: string) => {
        markAsRead.mutate(activityId);
    };

    const handleDelete = (activityId: string) => {
        deleteActivity.mutate(activityId);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead.mutate();
    };

    const getActivityIcon = (type: string) => {
        const iconMap: Record<string, string> = {
            listingCreated: "📦",
            listingDeleted: "🗑️",
            listingReceivedOffer: "📬",
            pickupRequestReceived: "📥",
            pickupRequestAcceptedByOwner: "✅",
            pickupRequestRejectedByOwner: "❌",
            pickupRequestCompletedByOwner: "✅",
            pickupRequestCreated: "🚗",
            pickupRequestAccepted: "✅",
            pickupRequestRejected: "❌",
            pickupRequestCompleted: "🎉",
            pickupRequestCancelled: "🚫",
            transactionCompleted: "💰",
            ratingReceived: "⭐",
            ratingPrompt: "💭",
            nearbyListingAvailable: "📍",
            pickupOpportunityNearby: "🗺️"
        };
        return iconMap[type] || "🔔";
    };


    if (!user) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="pt-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("common.signInRequired")}</h2>
                        <p className="text-gray-600 mb-6">{t("common.signInMessage")}</p>
                        <Button onClick={() => navigate("/auth")} className="w-full">
                            {t("common.signIn")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-5 w-5"/>
                            </Button>
                            <div className="flex items-center gap-2">
                                <Bell className="h-6 w-6 text-green-600"/>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {t("notifications.title", {defaultValue: "Notifications"})}
                                </h1>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/settings/notifications")}
                            title={t("notifications.settings", {defaultValue: "Notification Settings"})}
                        >
                            <Settings className="h-5 w-5"/>
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        {/* All/Unread Toggle */}
                        <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
                            <TabsList>
                                <TabsTrigger value="all">
                                    {t("notifications.all", {defaultValue: "All"})}
                                </TabsTrigger>
                                <TabsTrigger value="unread">
                                    {t("notifications.unread", {defaultValue: "Unread"})}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Category Filter */}
                        <Select
                            value={categoryFilter}
                            onValueChange={(v) => setCategoryFilter(v as UserActivityCategory)}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue
                                    placeholder={t("notifications.filterByType", {defaultValue: "Filter by type"})}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    value={UserActivityCategory.All}>{t("notifications.allTypes", {defaultValue: "All Types"})}</SelectItem>
                                <SelectItem value={UserActivityCategory.Listings}>
                                    {t("notifications.listings", {defaultValue: "Listings"})}
                                </SelectItem>
                                <SelectItem value={UserActivityCategory.Pickups}>
                                    {t("notifications.pickups", {defaultValue: "Pickups"})}
                                </SelectItem>
                                <SelectItem value={UserActivityCategory.Transactions}>
                                    {t("notifications.transactions", {defaultValue: "Transactions"})}
                                </SelectItem>
                                <SelectItem value={UserActivityCategory.Ratings}>
                                    {t("notifications.ratings", {defaultValue: "Ratings"})}
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Mark all as read */}
                        {filter === "unread" && data && data.pagination.totalCount > 0 && (
                            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                                {t("notifications.markAllRead", {defaultValue: "Mark all as read"})}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-10 w-10 rounded-full"/>
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4"/>
                                            <Skeleton className="h-4 w-full"/>
                                            <Skeleton className="h-3 w-24"/>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : data && data.data.length > 0 ? (
                    <>
                        <div className="space-y-3">
                            {data.data.map((activity) => (
                                <Card
                                    key={activity.id}
                                    className={`transition-colors ${!activity.isRead ? "bg-green-50 border-green-200" : ""}`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            {/* Icon */}
                                            <div
                                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                    !activity.isRead ? "bg-green-100" : "bg-gray-100"
                                                }`}
                                            >
                                                <span className="text-xl">{getActivityIcon(activity.type)}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="font-semibold text-gray-900">{getActivityMessage(activity.type, activity.templateData, t).title}</h3>
                                                    {!activity.isRead && (
                                                        <Badge variant="default" className="bg-green-600 flex-shrink-0">
                                                            {t("notifications.new", {defaultValue: "New"})}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 mt-1">{getActivityMessage(activity.type, activity.templateData, t).description}</p>

                                                {/* Show rating details if present */}
                                                {activity.rating && (
                                                    <div
                                                        className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span
                                                                className="text-lg">{"⭐".repeat(activity.rating.value)}</span>
                                                            <span className="text-sm text-gray-600">
                                {activity.rating.value}/5 from {activity.rating.raterName}
                              </span>
                                                        </div>
                                                        {activity.rating.comment && (
                                                            <p className="text-sm text-gray-700 italic mt-2">"{activity.rating.comment}"</p>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-sm text-gray-500 mt-2">
                                                    {formatDistanceToNow(new Date(activity.createdAtUtc), {addSuffix: true})}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                {!activity.isRead && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(activity.id)}
                                                        title={t("notifications.markAsRead", {defaultValue: "Mark as read"})}
                                                    >
                                                        {t("notifications.markRead", {defaultValue: "Mark read"})}
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(activity.id)}
                                                    title={t("notifications.delete", {defaultValue: "Delete"})}
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {data.pagination.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={!data.pagination.hasPrevious}
                                >
                                    {t("common.previous", {defaultValue: "Previous"})}
                                </Button>
                                <span className="text-sm text-gray-600">
                  {t("common.pageOf", {
                      defaultValue: "Page {{current}} of {{total}}",
                      current: data.pagination.page,
                      total: data.pagination.totalPages,
                  })}
                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={!data.pagination.hasNext}
                                >
                                    {t("common.next", {defaultValue: "Next"})}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {t("notifications.empty", {defaultValue: "No notifications"})}
                            </h3>
                            <p className="text-gray-600">
                                {t("notifications.emptyDesc", {
                                    defaultValue: "You're all caught up! Check back later for new notifications."
                                })}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <BottomNav/>
        </div>
    );
};

export default Notifications;
