import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onMapClick: () => void;
}

export const HeroSection = ({ onMapClick }: HeroSectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Turn Your Bottles Into
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Shared Profit</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with your community to return plastic bottles together. Split the 50 HUF refund and help Hungary recycle more efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <>
              <Button size="lg" onClick={() => navigate("/create-listing")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                List Your Bottles
              </Button>
              <Button size="lg" variant="outline" onClick={onMapClick}>
                <MapPin className="w-5 h-5 mr-2" />
                Find Nearby Bottles
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate("/auth")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};