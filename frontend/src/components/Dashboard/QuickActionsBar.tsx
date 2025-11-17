import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MessageCircle, MapPin, ArrowRight, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTotalUnreadCount } from "@/hooks/useMessages";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface QuickActionsBarProps {
  onMapClick: () => void;
}

export const QuickActionsBar = ({ onMapClick }: QuickActionsBarProps) => {
  const navigate = useNavigate();
  const totalUnreadCount = useTotalUnreadCount();
  const { t } = useTranslation();

  const utilityActions = [
    {
      icon: Search,
      label: t("dashboard.quickActions.findBottles.label"),
      description: t("dashboard.quickActions.findBottles.description"),
      onClick: onMapClick,
      variant: "outline" as const,
    },
    {
      icon: MessageCircle,
      label: t("dashboard.quickActions.messages.label"),
      description: t("dashboard.quickActions.messages.description"),
      onClick: () => navigate("/messages"),
      variant: "outline" as const,
      badge: totalUnreadCount > 0 ? totalUnreadCount : undefined
    },
    {
      icon: MapPin,
      label: t("dashboard.quickActions.myListings.label"),
      description: t("dashboard.quickActions.myListings.description"),
      onClick: () => navigate("/my-listings"),
      variant: "outline" as const,
    }
  ];

  return (
    <div className="space-y-4">
      {/* Primary CTA - Separated and Prominent */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t("dashboard.quickActions.primaryCTA.title")}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 md:mb-0">
                {t("dashboard.quickActions.primaryCTA.description")}
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate("/create-listing")}
              className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white font-bold text-base px-8 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t("dashboard.quickActions.primaryCTA.button")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Utility Actions - Separate Row */}
      <Card className="border-2">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("dashboard.quickActions.title")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {utilityActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
                className="h-auto flex-col gap-2 py-4 relative"
              >
                <action.icon className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-semibold text-sm">{action.label}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
                {action.badge && (
                  <Badge className="absolute -top-2 -right-2 h-5 min-w-5 bg-red-500 text-white text-xs px-1.5">
                    {action.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
