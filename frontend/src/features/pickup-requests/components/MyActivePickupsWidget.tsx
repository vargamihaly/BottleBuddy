import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Badge} from "@/shared/ui/badge";
import {ArrowRight, Calendar, CheckCircle, MapPin, Package} from "lucide-react";
import {BottleListing, PickupRequest} from "@/shared/types";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useUpdatePickupRequestStatus} from "@/features/pickup-requests/hooks";
import {useMessages} from "@/features/messaging/hooks";

interface MyActivePickupsWidgetProps {
    pickupRequests: PickupRequest[];
    listings: BottleListing[];
}

// Helper component for individual pickup card to properly use hooks
interface PickupCardProps {
    pickup: PickupRequest;
    listing: BottleListing;
    statusColor: Record<string, string>;
    onComplete: (requestId: string) => void;
    isUpdating: boolean;
}

const PickupCard = ({pickup, listing, statusColor, onComplete, isUpdating}: PickupCardProps) => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const {unreadCount} = useMessages(pickup.id, {fetchMessages: false});

    const handleCardClick = () => {
        navigate(`/messages?conversation=${pickup.id}`);
    };

    const handleCompleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation
        onComplete(pickup.id);
    };

    return (
        <div className="space-y-2">
            <div
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={handleCardClick}
            >
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600"/>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">
                            {t("dashboard.activePickups.bottleCount", {count: listing.bottleCount})}
                        </h4>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <Badge className="h-5 min-w-5 bg-red-500 text-white text-xs px-1.5">
                                    {unreadCount}
                                </Badge>
                            )}
                            <Badge
                                variant="outline"
                                className={`text-xs ${statusColor[pickup.status as keyof typeof statusColor]}`}
                            >
                                {t(`dashboard.activePickups.status.${pickup.status}`)}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3"/>
                        <span className="truncate">{listing.location}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                        {pickup.message || t("dashboard.activePickups.noMessage")}
                    </p>
                </div>
            </div>
            {pickup.status === 'accepted' && (
                <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleCompleteClick}
                    disabled={isUpdating}
                >
                    <CheckCircle className="w-3 h-3 mr-1"/>
                    {t('listing.markAsCompleted')}
                </Button>
            )}
        </div>
    );
};

export const MyActivePickupsWidget = ({pickupRequests, listings}: MyActivePickupsWidgetProps) => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const updatePickupRequestStatusMutation = useUpdatePickupRequestStatus();

    // Filter active pickups (pending or accepted)
    const activePickups = pickupRequests.filter(
        req => req.status === "pending" || req.status === "accepted"
    );

    const getListingForPickup = (pickupRequest: PickupRequest) => {
        return listings.find(l => l.id === pickupRequest.listingId);
    };

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
        accepted: "bg-green-100 text-green-800 border-green-300",
    };

    const handleCompletePickup = (requestId: string) => {
        if (window.confirm(t('listing.confirmComplete'))) {
            updatePickupRequestStatusMutation.mutate({requestId, status: "completed"});
        }
    };

    if (activePickups.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600"/>
                        {t("dashboard.activePickups.title")}
                    </CardTitle>
                    <CardDescription>{t("dashboard.activePickups.emptyDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-6">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
                        <p className="text-sm text-gray-600 mb-4">
                            {t("dashboard.activePickups.emptyCtaDescription")}
                        </p>
                        <Button onClick={() => navigate("/my-pickup-tasks")} variant="outline">
                            {t("dashboard.activePickups.emptyButton")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-green-600"/>
                            {t("dashboard.activePickups.title")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.activePickups.description")}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {activePickups.length}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activePickups.slice(0, 3).map((pickup) => {
                        const listing = getListingForPickup(pickup);
                        if (!listing) return null;

                        return (
                            <PickupCard
                                key={pickup.id}
                                pickup={pickup}
                                listing={listing}
                                statusColor={statusColor}
                                onComplete={handleCompletePickup}
                                isUpdating={updatePickupRequestStatusMutation.isPending}
                            />
                        );
                    })}
                </div>
                <div className="mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/my-pickup-tasks")}
                        className="w-full text-green-600 hover:text-green-700"
                    >
                        {t("dashboard.activePickups.viewAll")} ({activePickups.length})
                        <ArrowRight className="w-4 h-4 ml-2"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
