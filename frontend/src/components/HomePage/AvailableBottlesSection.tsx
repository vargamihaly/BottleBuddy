import { Button } from "@/components/ui/button";
import { MapPin, Plus, ArrowRight } from "lucide-react";
import { BottleListingCard } from "@/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { BottleListing, PickupRequest } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AvailableBottlesSectionProps {
  listings: BottleListing[];
  pickupRequests: PickupRequest[];
  isLoading: boolean;
  isError: boolean;
  onMapClick: () => void;
}

export const AvailableBottlesSection = ({
  listings,
  pickupRequests,
  isLoading,
  isError,
  onMapClick
}: AvailableBottlesSectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-white/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">
              {t("homeSections.availableBottles.title")}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {t("homeSections.availableBottles.subtitle")}
            </p>
          </div>
          <Button variant="outline" onClick={onMapClick}>
            {t("homeSections.availableBottles.viewMap")}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        {isLoading ? (
          <BottleListingsGridSkeleton count={6} />
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{t("common.error")}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t("common.retry")}
            </Button>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">{t("homeSections.availableBottles.noBottles")}</h4>
            <p className="text-gray-500">
              {t("homeSections.availableBottles.checkBack")}
            </p>
            {user && (
              <Button
                className="mt-4 bg-gradient-to-r from-green-600 to-emerald-600"
                onClick={() => navigate("/create-listing")}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("homeSections.cta.listBottles")}
              </Button>
            )}
          </div>
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
