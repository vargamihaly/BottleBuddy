import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTotalUnreadCount } from "@/hooks/useMessages";
import { Badge } from "@/components/ui/badge";

interface QuickActionsBarProps {
  onMapClick: () => void;
}

export const QuickActionsBar = ({ onMapClick }: QuickActionsBarProps) => {
  const navigate = useNavigate();
  const totalUnreadCount = useTotalUnreadCount();

  const actions = [
    {
      icon: Plus,
      label: "List Bottles",
      description: "Create new listing",
      onClick: () => navigate("/create-listing"),
      variant: "default" as const,
      className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
    },
    {
      icon: Search,
      label: "Find Bottles",
      description: "Browse available",
      onClick: onMapClick,
      variant: "outline" as const,
      className: ""
    },
    {
      icon: MessageCircle,
      label: "Messages",
      description: "View conversations",
      onClick: () => navigate("/messages"),
      variant: "outline" as const,
      className: "",
      badge: totalUnreadCount > 0 ? totalUnreadCount : undefined
    },
    {
      icon: MapPin,
      label: "My Listings",
      description: "Manage bottles",
      onClick: () => navigate("/my-listings"),
      variant: "outline" as const,
      className: ""
    }
  ];

  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
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
