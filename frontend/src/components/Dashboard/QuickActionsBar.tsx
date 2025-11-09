import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MessageCircle, MapPin } from "lucide-react";
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

  const actions = [
    {
      icon: Plus,
      label: t("dashboard.quickActions.listBottles.label"),
      description: t("dashboard.quickActions.listBottles.description"),
      onClick: () => navigate("/create-listing"),
      variant: "default" as const,
      className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
    },
    {
      icon: Search,
      label: t("dashboard.quickActions.findBottles.label"),
      description: t("dashboard.quickActions.findBottles.description"),
      onClick: onMapClick,
      variant: "outline" as const,
      className: ""
    },
    {
      icon: MessageCircle,
      label: t("dashboard.quickActions.messages.label"),
      description: t("dashboard.quickActions.messages.description"),
      onClick: () => navigate("/messages"),
      variant: "outline" as const,
      className: "",
      badge: totalUnreadCount > 0 ? totalUnreadCount : undefined
    },
    {
      icon: MapPin,
      label: t("dashboard.quickActions.myListings.label"),
      description: t("dashboard.quickActions.myListings.description"),
      onClick: () => navigate("/my-listings"),
      variant: "outline" as const,
      className: ""
    }
  ];

  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t("dashboard.quickActions.title")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              className={`h-auto flex-col gap-2 py-4 relative ${action.className}`}
            >
              <action.icon className="w-6 h-6" />
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
  );
};
