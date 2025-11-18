
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, Star, MapPin, Users, Plus, ArrowLeft, TrendingUp, Recycle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUserActivities } from "@/hooks/api/useUserActivities";
import { formatDistanceToNow } from "date-fns";
import { hu, enUS } from "date-fns/locale";
import { getActivityMessage } from "@/utils/activityTemplates";

interface UserDashboardProps {
  onBackToHome: () => void;
}

export const UserDashboard = ({ onBackToHome }: UserDashboardProps) => {
  const { t, i18n } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Fetch recent user activities (limit to 5 most recent)
  const { data: activitiesData, isLoading: activitiesLoading } = useUserActivities(
    { page: 1, pageSize: 5 },
    { refetchInterval: false }
  );

  // Debug: Log user data
  console.log('[UserDashboard] User data:', user);

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('userDashboard.loading')}</p>
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
    level: t('userDashboard.level.ecoChampion')
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

  // Get date-fns locale based on current language
  const dateLocale = i18n.language === 'hu' ? hu : enUS;

  // Helper to format activity date
  const formatActivityDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: dateLocale
      });
    } catch {
      return dateString;
    }
  };

  // Helper to get activity icon
  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      listingCreated: "📦",
      listingDeleted: "🗑️",
      listingReceivedOffer: "📬",
      pickupRequestReceived: "📥",
      pickupRequestAcceptedByOwner: "✅",
      pickupRequestRejectedByOwner: "❌",
      pickupRequestCreated: "🚗",
      pickupRequestAccepted: "✅",
      pickupRequestRejected: "❌",
      transactionCompleted: "🎉",
      earningsReceived: "💰",
      ratingReceived: "⭐",
      ratingPrompt: "💭",
      nearbyListingAvailable: "📍",
      pickupOpportunityNearby: "🗺️"
    };
    return iconMap[type] || "📋";
  };

  const recentActivity = activitiesData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={onBackToHome}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('userDashboard.back')}
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('userDashboard.title')}</h1>
                <p className="text-sm text-gray-600">{t('userDashboard.trackImpact')}</p>
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
                      <span>{userStats.rating.toFixed(1)} {t('userDashboard.profile.rating')}</span>
                      <span className="text-xs">({userStats.totalRatings} {t('userDashboard.profile.reviews')})</span>
                      <span>•</span>
                    </>
                  )}
                  {userStats.totalRatings === 0 && (
                    <>
                      <span className="text-xs text-gray-500">{t('userDashboard.profile.noRatings')}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{userStats.completedExchanges} {t('userDashboard.profile.completedExchanges')}</span>
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
                <CardTitle className="text-lg">{t('userDashboard.stats.totalBottles')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{userStats.totalBottles}</div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <ArrowUp className="w-3 h-3 text-green-500" />
                <span>{t('userDashboard.stats.thisWeekBottles', { count: 12 })}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">{t('userDashboard.stats.totalEarnings')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">{userStats.totalEarnings} HUF</div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <ArrowUp className="w-3 h-3 text-green-500" />
                <span>{t('userDashboard.stats.thisWeekEarnings', { amount: 375 })}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">{t('userDashboard.stats.successRate')}</CardTitle>
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
          <Button size="lg" onClick={() => navigate("/create-listing")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="w-5 h-5 mr-2" />
            {t('userDashboard.actions.listNewBottles')}
          </Button>
          <Button size="lg" variant="outline" onClick={onBackToHome}>
            <MapPin className="w-5 h-5 mr-2" />
            {t('userDashboard.actions.findBottles')}
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>{t('userDashboard.recentActivity.title')}</CardTitle>
            <CardDescription>{t('userDashboard.recentActivity.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity yet. Start by creating a listing or picking up bottles!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{getActivityMessage(activity.type, activity.templateData, t).title}</h4>
                        <p className="text-sm text-gray-600">{getActivityMessage(activity.type, activity.templateData, t).description}</p>

                        {/* Show rating details if present */}
                        {activity.rating && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-yellow-500">{"⭐".repeat(activity.rating.value)}</span>
                            <span className="text-xs text-gray-600">
                              {activity.rating.value}/5 from {activity.rating.raterName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 flex-shrink-0 ml-4">
                      {formatActivityDate(activity.createdAtUtc)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
