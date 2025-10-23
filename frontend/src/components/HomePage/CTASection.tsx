import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  onDashboardClick: () => void;
}

export const CTASection = ({ onDashboardClick }: CTASectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-6">Ready to Start Sharing?</h3>
        <p className="text-xl mb-8 opacity-90">
          Join Hungary's growing community of eco-conscious bottle sharers today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Button size="lg" variant="secondary" onClick={() => navigate("/create-listing")}>
                List Your Bottles
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" onClick={onDashboardClick}>
                View Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Sign Up Free
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                Learn More
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};