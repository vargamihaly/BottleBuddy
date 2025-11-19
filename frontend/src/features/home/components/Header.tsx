import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { MapPin, Users, Bell, LogOut, Info, Recycle, MessageCircle, HelpCircle, Menu, X, Check } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useToast } from "@/shared/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTotalUnreadCount } from "@/features/messaging";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/shared/components/layout/LanguageSwitcher";
import { useState } from "react";
import { useUnreadActivityCount, useUserActivities, useMarkActivityAsRead, useMarkAllActivitiesAsRead, useDeleteActivity } from "@/features/notifications";
import { formatDistanceToNow } from "date-fns";
import { getActivityMessage } from "@/features/notifications";

interface HeaderProps {
  onMapClick: () => void;
  onDashboardClick: () => void;
}

export const Header = ({ onMapClick, onDashboardClick }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const totalUnreadCount = useTotalUnreadCount();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);

  // User activities with 30-second polling
  const { data: unreadCount = 0 } = useUnreadActivityCount();
  const { data: activitiesData } = useUserActivities(
    { page: 1, pageSize: 10 },
    { enabled: !!user, refetchInterval: 30000 } // Poll every 30 seconds
  );
  const markAsRead = useMarkActivityAsRead();
  const markAllAsRead = useMarkAllActivitiesAsRead();
  const deleteActivity = useDeleteActivity();

  // Group activities into "New" (unread) and "Earlier" (read)
  const newActivities = activitiesData?.data.filter((a) => !a.isRead) || [];
  const earlierActivities = activitiesData?.data.filter((a) => a.isRead) || [];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: t("auth.signOutSuccess"),
        description: t("auth.signOutDescription"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("auth.signOutError"),
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = (activityId: string) => {
    markAsRead.mutate(activityId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDeleteActivity = (activityId: string) => {
    deleteActivity.mutate(activityId);
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{t("common.brandName")}</h1>
              <p className="text-xs text-gray-600">{t("common.tagline")}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-700 hover:text-green-600">
              {t("common.home")}
            </Button>
            {user && (
              <Button variant="ghost" onClick={onMapClick} className="text-gray-700 hover:text-green-600">
                <MapPin className="w-4 h-4 mr-2" />
                {t("common.exploreMap")}
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate("/about")} className="text-gray-700 hover:text-green-600">
              <Info className="w-4 h-4 mr-2" />
              {t("common.about")}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/faq")} className="text-gray-700 hover:text-green-600">
              <HelpCircle className="w-4 h-4 mr-2" />
              {t("common.faq")}
            </Button>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">{t("common.brandName")}</h2>

                  <Button variant="ghost" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} className="justify-start">
                    {t("common.home")}
                  </Button>

                  {user && (
                    <Button variant="ghost" onClick={() => { onMapClick(); setMobileMenuOpen(false); }} className="justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      {t("common.exploreMap")}
                    </Button>
                  )}

                  <Button variant="ghost" onClick={() => { navigate("/about"); setMobileMenuOpen(false); }} className="justify-start">
                    <Info className="w-4 h-4 mr-2" />
                    {t("common.about")}
                  </Button>

                  <Button variant="ghost" onClick={() => { navigate("/faq"); setMobileMenuOpen(false); }} className="justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {t("common.faq")}
                  </Button>

                  {user && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <Button variant="ghost" onClick={() => { onDashboardClick(); setMobileMenuOpen(false); }} className="justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        {t("common.profile")}
                      </Button>
                      <Button variant="ghost" onClick={async () => { await handleSignOut(); setMobileMenuOpen(false); }} className="justify-start">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("common.signOut")}
                      </Button>
                    </>
                  )}

                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-2">
                    <LanguageSwitcher />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <LanguageSwitcher className="hidden md:flex" />
            {user ? (
              <>
                <Button variant="outline" size="sm" onClick={onDashboardClick} className="hidden sm:flex">
                  <Users className="w-4 h-4 mr-2" />
                  {t("common.profile")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/messages")}
                  className="relative hidden md:flex"
                >
                  <MessageCircle className="w-4 h-4" />
                  {totalUnreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 min-w-5 bg-red-500 text-white text-xs px-1.5">
                      {totalUnreadCount}
                    </Badge>
                  )}
                </Button>
                <Popover open={activitiesOpen} onOpenChange={setActivitiesOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="relative hidden md:flex">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 min-w-5 bg-red-500 text-white text-xs px-1.5">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0" align="end">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-semibold text-lg">{t('activities.title', { defaultValue: 'Notifications' })}</h3>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                          <Check className="w-4 h-4 mr-1" />
                          {t('activities.markAllRead', { defaultValue: 'Mark all read' })}
                        </Button>
                      )}
                    </div>
                    <ScrollArea className="max-h-96">
                      {activitiesData && activitiesData.data.length > 0 ? (
                        <div>
                          {/* New (Unread) Section */}
                          {newActivities.length > 0 && (
                            <div>
                              <div className="px-4 py-2 bg-gray-50 border-b">
                                <p className="text-xs font-semibold text-gray-600 uppercase">
                                  {t('activities.new', { defaultValue: 'New' })}
                                </p>
                              </div>
                              <div className="divide-y">
                                {newActivities.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className="p-4 hover:bg-gray-50 transition-colors bg-green-50"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900">{getActivityMessage(activity.type, activity.templateData, t).title}</p>
                                        <p className="text-sm text-gray-600 mt-1">{getActivityMessage(activity.type, activity.templateData, t).description}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                          {formatDistanceToNow(new Date(activity.createdAtUtc), { addSuffix: true })}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-1 ml-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleMarkAsRead(activity.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Check className="w-4 h-4 text-green-600" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteActivity(activity.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <X className="w-4 h-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Earlier (Read) Section */}
                          {earlierActivities.length > 0 && (
                            <div>
                              <div className="px-4 py-2 bg-gray-50 border-b">
                                <p className="text-xs font-semibold text-gray-600 uppercase">
                                  {t('activities.earlier', { defaultValue: 'Earlier' })}
                                </p>
                              </div>
                              <div className="divide-y">
                                {earlierActivities.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className="p-4 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-900">{getActivityMessage(activity.type, activity.templateData, t).title}</p>
                                        <p className="text-sm text-gray-600 mt-1">{getActivityMessage(activity.type, activity.templateData, t).description}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                          {formatDistanceToNow(new Date(activity.createdAtUtc), { addSuffix: true })}
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-1 ml-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleDeleteActivity(activity.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <X className="w-4 h-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>{t('activities.noActivities', { defaultValue: 'No notifications yet' })}</p>
                        </div>
                      )}
                    </ScrollArea>
                    {/* View All Button */}
                    <div className="p-3 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setActivitiesOpen(false);
                          navigate("/notifications");
                        }}
                      >
                        {t('activities.viewAll', { defaultValue: 'View All Notifications' })}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden md:flex">
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t("common.signOut")}</span>
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/auth")} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md">
                  {t("common.signIn")}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};