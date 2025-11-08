import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export const WelcomeWidget = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const getGreetingKey = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "dashboard.welcome.greetings.morning";
    if (hour < 18) return "dashboard.welcome.greetings.afternoon";
    return "dashboard.welcome.greetings.evening";
  };

  const userName = user?.name || user?.email?.split("@")[0] || t("dashboard.welcome.defaultName");

  return (
    <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">
              {t(getGreetingKey())}, {userName}!
            </h2>
            <p className="text-white/90 mt-1">
              {t("dashboard.welcome.cta")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
