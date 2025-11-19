import {Badge} from "@/shared/ui/badge";
import {BottleListingCard, BottleListingsGridSkeleton} from "@/features/listings/components";
import {BottleListing, PickupRequest} from "@/shared/types";
import {useAuth} from "@/contexts/AuthContext";
import {useTranslation} from "react-i18next";

interface MyCompletedPickupTasksSectionProps {
    listings: BottleListing[];
    pickupRequests: PickupRequest[];
    isLoading: boolean;
}

export const MyCompletedPickupTasksSection = ({
                                                  listings,
                                                  pickupRequests,
                                                  isLoading
                                              }: MyCompletedPickupTasksSectionProps) => {
    const {user} = useAuth();
    const {t} = useTranslation();

    if (!user || listings.length === 0) {
        return null;
    }

    return (
        <section className="py-12 px-4 bg-gray-50/60 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{t("homeSections.completedPickups.title")}</h3>
                        <p className="text-sm text-gray-600 mt-1">{t("homeSections.completedPickups.subtitle")}</p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {t("homeSections.completedPickups.count", {count: listings.length})}
                    </Badge>
                </div>
                {isLoading ? (
                    <BottleListingsGridSkeleton count={3}/>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <BottleListingCard
                                key={listing.id}
                                listing={listing}
                                isOwnListing={false}
                                myPickupRequests={pickupRequests}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};