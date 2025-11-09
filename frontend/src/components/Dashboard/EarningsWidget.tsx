import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Coins, Recycle, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useMyTransactions } from "@/hooks/api";
import { useMemo } from "react";

interface UserStats {
  totalBottles: number;
  totalEarnings: number;
  completedPickups: number;
  averageRating: number;
}

export const EarningsWidget = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { data: transactions = [] } = useMyTransactions();

  const stats: UserStats = useMemo(() => {
    // Calculate stats from transactions
    const totalEarnings = transactions.reduce(
      (sum, transaction) =>
        sum + (transaction.ownerAmount || 0) + (transaction.volunteerAmount || 0),
      0
    );

    const totalBottles = transactions.reduce(
      (sum, transaction) => sum + (transaction.bottleCount || 0),
      0
    );

    return {
      totalBottles,
      totalEarnings,
      completedPickups: transactions.length,
      averageRating: user?.rating || 0
    };
  }, [transactions, user?.rating]);

  const statCards = [
    {
      icon: Coins,
      label: t("dashboard.impact.totalEarnings"),
      value: t("dashboard.impact.earningsValue", {
        amount: stats.totalEarnings.toLocaleString()
      }),
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Recycle,
      label: t("dashboard.impact.bottlesReturned"),
      value: stats.totalBottles.toLocaleString(),
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: TrendingUp,
      label: t("dashboard.impact.completedPickups"),
      value: stats.completedPickups.toLocaleString(),
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Star,
      label: t("dashboard.impact.rating"),
      value: stats.averageRating ? stats.averageRating.toFixed(1) : t("common.notAvailable"),
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("dashboard.impact.title")}</CardTitle>
        <CardDescription>{t("dashboard.impact.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
