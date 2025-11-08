import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { BottleListingCard } from "@/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { BottleListing } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface MyListingsSectionProps {
  listings: BottleListing[];
  isLoading: boolean;
}

export const MyListingsSection = ({ listings, isLoading }: MyListingsSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-blue-50/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{t("homeSections.myListings.title")}</h3>
            <p className="text-sm text-gray-600 mt-1">{t("homeSections.myListings.subtitle")}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {t("homeSections.myListings.count", { count: listings.length })}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate("/my-listings")}>
              {t("homeSections.myListings.viewAll")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        {isLoading ? (
          <BottleListingsGridSkeleton count={3} />
        ) : listings.length === 0 ? (
          <div className="bg-white/80 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">{t("homeSections.myListings.noListings")}</p>
            <Button
              onClick={() => navigate("/create-listing")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {t("homeSections.myListings.createFirst")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <BottleListingCard key={listing.id} listing={listing} isOwnListing={true} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
