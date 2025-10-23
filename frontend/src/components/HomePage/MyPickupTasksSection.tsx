import { Badge } from "@/components/ui/badge";
import { BottleListingCard } from "@/components/BottleListingCard";
import { BottleListingsGridSkeleton } from "@/components/BottleListingSkeleton";
import { BottleListing, PickupRequest } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface MyPickupTasksSectionProps {
  listings: BottleListing[];
  pickupRequests: PickupRequest[];
  isLoading: boolean;
}

export const MyPickupTasksSection = ({ listings, pickupRequests, isLoading }: MyPickupTasksSectionProps) => {
  const { user } = useAuth();

  if (!user || listings.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-emerald-50/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">My Pickup Tasks</h3>
            <p className="text-sm text-gray-600 mt-1">Bottles you've offered to pick up</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {listings.length} {listings.length === 1 ? 'task' : 'tasks'}
          </Badge>
        </div>
        {isLoading ? (
          <BottleListingsGridSkeleton count={3} />
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