import {Wine, Bell, Coins, CheckCircle2, LucideIcon} from "lucide-react";
import {Card} from "@/shared/ui/card";
import {useTranslation} from "react-i18next";
import {ListingStats as ListingStatsType} from "@/shared/types";
import {Skeleton} from "@/shared/ui/skeleton";

interface ListingStatsProps {
  stats: ListingStatsType;
  isLoading?: boolean;
}

interface StatItem {
  key: keyof ListingStatsType;
  translationKey: string;
  icon: LucideIcon;
  format: (v: number) => string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  pulse?: boolean;
}

const statItems: StatItem[] = [
  {
    key: "totalActive",
    translationKey: "totalActive",
    icon: Wine,
    format: (v: number) => v.toString(),
    gradient: "from-primary/10 to-accent/10",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    key: "pendingRequests",
    translationKey: "pendingRequests",
    icon: Bell,
    format: (v: number) => v.toString(),
    gradient: "from-warning/10 to-warning/5",
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    pulse: true,
  },
  {
    key: "totalEarnings",
    translationKey: "totalEarnings",
    icon: Coins,
    format: (v: number) => `${v.toLocaleString()} HUF`,
    gradient: "from-accent/10 to-primary/10",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
  },
  {
    key: "completedPickups",
    translationKey: "completedPickups",
    icon: CheckCircle2,
    format: (v: number) => v.toString(),
    gradient: "from-muted/50 to-muted/30",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
];

export const ListingStats = ({stats, isLoading}: ListingStatsProps) => {
  const {t} = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-4 lg:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        const value = stats[item.key as keyof ListingStatsType];

        return (
          <Card
            key={item.key}
            className={`
              relative overflow-hidden p-4 lg:p-5
              bg-gradient-to-br ${item.gradient}
              border-0 shadow-card
              hover:shadow-card-hover hover:scale-[1.02]
              transition-all duration-300 ease-out
              animate-fade-in stagger-${index + 1}
            `}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">
                  {t(`myListingsPage.stats.${item.translationKey}`)}
                </p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">
                  {item.format(value)}
                </p>
              </div>
              <div
                className={`
                  p-2 lg:p-2.5 rounded-xl ${item.iconBg}
                  ${item.pulse && value > 0 ? "animate-pulse-soft" : ""}
                `}
              >
                <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${item.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};