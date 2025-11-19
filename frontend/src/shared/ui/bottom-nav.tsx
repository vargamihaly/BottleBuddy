import {useLocation, useNavigate} from "react-router-dom";
import {Home, MapPin, MessageCircle, Package, User} from "lucide-react";
import {useTranslation} from "react-i18next";
import {useTotalUnreadCount} from "@/features/messaging/hooks";
import {Badge} from "@/shared/ui/badge";
import {cn} from "@/shared/lib/utils";

interface BottomNavProps {
  onHomeClick?: () => void;
  onMapClick?: () => void;
  onDashboardClick?: () => void;
  activeTab?: string;
}

export const BottomNav = ({
  onHomeClick,
  onMapClick,
  onDashboardClick,
  activeTab
}: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const totalUnreadCount = useTotalUnreadCount();

  const navItems = [
    {
      id: "home",
      label: t("common.home"),
      icon: Home,
      onClick: () => {
        if (onHomeClick) {
          onHomeClick();
        } else {
          navigate("/");
        }
      },
      isActive: location.pathname === "/" && (!activeTab || activeTab === "home"),
    },
    {
      id: "map",
      label: t("common.exploreMap"),
      icon: MapPin,
      onClick: () => {
        if (onMapClick) {
          onMapClick();
        } else {
          navigate("/");
        }
      },
      isActive: activeTab === "map",
    },
    {
      id: "listings",
      label: t("dashboard.quickActions.myListings.label"),
      icon: Package,
      onClick: () => navigate("/my-listings"),
      isActive: location.pathname === "/my-listings",
    },
    {
      id: "messages",
      label: t("messages.title"),
      icon: MessageCircle,
      onClick: () => navigate("/messages"),
      isActive: location.pathname === "/messages",
      badge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
    },
    {
      id: "profile",
      label: t("common.profile"),
      icon: User,
      onClick: () => {
        if (onDashboardClick) {
          onDashboardClick();
        } else {
          navigate("/");
        }
      },
      isActive: activeTab === "dashboard",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full relative transition-colors",
                "min-w-0 px-1",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset rounded-lg",
                item.isActive
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-500"
              )}
              aria-label={item.label}
              aria-current={item.isActive ? "page" : undefined}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <Badge className="absolute -top-2 -right-2 h-4 min-w-4 bg-red-500 text-white text-[10px] px-1 flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-medium truncate w-full text-center",
                item.isActive && "font-semibold"
              )}>
                {item.label}
              </span>
              {item.isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
