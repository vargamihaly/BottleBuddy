import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { BottleListingCard } from "@/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { BottleListing } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MyListingsSectionProps {
  listings: BottleListing[];
  isLoading: boolean;
}

export const MyListingsSection = ({ listings, isLoading }: MyListingsSectionProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user || listings.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-blue-50/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">My Active Listings</h3>
            <p className="text-sm text-gray-600 mt-1">Your bottles available for pickup</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate("/my-listings")}>
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
        {isLoading ? (
          <BottleListingsGridSkeleton count={3} />
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