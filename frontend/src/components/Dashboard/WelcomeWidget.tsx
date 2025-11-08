import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const WelcomeWidget = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.name || user?.email?.split("@")[0] || "Friend";

  return (
    <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">
              {getGreeting()}, {userName}!
            </h2>
            <p className="text-white/90 mt-1">
              Ready to make a difference today?
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
