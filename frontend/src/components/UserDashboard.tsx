
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, Star, MapPin, Users, Plus, ArrowLeft, TrendingUp, Recycle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface UserDashboardProps {
  onBackToHome: () => void;
}

export const UserDashboard = ({ onBackToHome }: UserDashboardProps) => {
  const { user, loading } = useAuth();

  // Debug: Log user data
  console.log('[UserDashboard] User data:', user);

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to home
  if (!user) {
    onBackToHome();
    return null;
  }

  // Placeholder stats - these would come from API in the future
  const userStats = {
    totalBottles: 156,
    totalEarnings: 3900,
    completedExchanges: 23,
    rating: user.rating ?? null,
    totalRatings: user.totalRatings ?? 0,
    level: "Eco Champion"
  };

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Display name priority: fullName > username > email
  const displayName = user.fullName || user.username || user.email || "User";

  const recentActivity = [
    {
      id: 1,
      type: "pickup",
      bottles: 15,
      earnings: 375,
      partner: "Anna K.",
      location: "District V",
      date: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "listing",
      bottles: 8,
      earnings: 200,
      partner: "Péter M.",
      location: "District XIII",
      date: "1 day ago",
      status: "in progress"
    },
    {
      id: 3,
      type: "pickup",
      bottles: 22,
      earnings: 550,
      partner: "Eszter L.",
      location: "District II",
      date: "3 days ago",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onBackToHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
                <p className="text-sm text-gray-600">Track your recycling impact</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {userStats.level}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Profile Card */}
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <div className="flex items-center space-x-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(user.fullName || user.username)}
                </div>
              )}
              <div>
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <CardDescription className="flex items-center space-x-2">
                  {userStats.rating !== null && userStats.rating > 0 && (
                    <>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{userStats.rating.toFixed(1)} rating</span>
                      <span className="text-xs">({userStats.totalRatings} reviews)</span>
                      <span>•</span>
                    </>
                  )}
                  {userStats.totalRatings === 0 && (
                    <>
                      <span className="text-xs text-gray-500">No ratings yet</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{userStats.completedExchanges} completed exchanges</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Recycle className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Total Bottles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{userStats.totalBottles}</div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <ArrowUp className="w-3 h-3 text-green-500" />
                <span>+12 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Total Earnings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{userStats.totalEarnings} HUF</div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <ArrowUp className="w-3 h-3 text-green-500" />
                <span>+375 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Success Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <Progress value={98} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="w-5 h-5 mr-2" />
            List New Bottles
          </Button>
          <Button size="lg" variant="outline">
            <MapPin className="w-5 h-5 mr-2" />
            Find Bottles to Pick Up
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest bottle exchanges and listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      {activity.type === "pickup" ? "🚗" : "📦"}
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {activity.type === "pickup" ? "Picked up bottles" : "Listed bottles"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activity.bottles} bottles • {activity.location} • with {activity.partner}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">+{activity.earnings} HUF</div>
                    <div className="text-sm text-gray-500">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
