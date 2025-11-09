import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BottleListingCard } from "@/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { BottleListing, PickupRequest } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface MyPickupTasksSectionProps {
  activeListings: BottleListing[];
  completedListings: BottleListing[];
  pickupRequests: PickupRequest[];
  isLoading: boolean;
}

export const MyPickupTasksSection = ({
  activeListings,
  completedListings,
  pickupRequests,
  isLoading
}: MyPickupTasksSectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Combine active and completed listings
  const allTaskListings = [...activeListings, ...completedListings];

  if (!user || allTaskListings.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-emerald-50/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{t("homeSections.pickupTasks.title")}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {activeListings.length > 0 && completedListings.length > 0
                ? t("homeSections.pickupTasks.activeAndCompleted")
                : activeListings.length > 0
                ? t("homeSections.pickupTasks.activeOnly")
                : t("homeSections.pickupTasks.completedOnly")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {t("homeSections.pickupTasks.count", { count: allTaskListings.length })}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate("/my-pickup-tasks")}>
              {t("homeSections.pickupTasks.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        {isLoading ? (
          <BottleListingsGridSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTaskListings.map((listing) => (
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