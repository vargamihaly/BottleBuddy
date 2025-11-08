import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Coins, Recycle, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";

interface UserStats {
  totalBottles: number;
  totalEarnings: number;
  completedPickups: number;
  averageRating: number;
}

export const EarningsWidget = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      // Fetch user's transactions
      const transactions = await apiClient.get(`/api/transactions/my-transactions`);

      // Calculate stats from transactions
      const totalEarnings = transactions.reduce(
        (sum: number, t: any) => sum + (t.ownerRefundAmount || 0) + (t.volunteerRefundAmount || 0),
        0
      );

      const totalBottles = transactions.reduce(
        (sum: number, t: any) => sum + (t.bottleCount || 0),
        0
      );

      return {
        totalBottles,
        totalEarnings,
        completedPickups: transactions.length,
        averageRating: user?.averageRating || 0
      };
    },
    enabled: !!user,
    initialData: {
      totalBottles: 0,
      totalEarnings: 0,
      completedPickups: 0,
      averageRating: 0
    }
  });

  const statCards = [
    {
      icon: Coins,
      label: "Total Earnings",
      value: `${stats?.totalEarnings.toLocaleString()} HUF`,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Recycle,
      label: "Bottles Returned",
      value: stats?.totalBottles.toLocaleString() || "0",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: TrendingUp,
      label: "Completed Pickups",
      value: stats?.completedPickups.toLocaleString() || "0",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Star,
      label: "Your Rating",
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : "N/A",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Impact</CardTitle>
        <CardDescription>Track your recycling journey</CardDescription>
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
