import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { BottomNav } from "@/shared/components/ui/bottom-nav";
import { ArrowLeft, Mail, Bell } from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/features/notifications";
import { UpdateNotificationPreferences } from "@/types";
import { Skeleton } from "@/shared/components/ui/skeleton";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const handleToggle = (field: keyof UpdateNotificationPreferences, value: boolean) => {
    updatePreferences.mutate({ [field]: value });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("common.signInRequired")}</h2>
            <p className="text-gray-600 mb-6">{t("common.signInMessage")}</p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              {t("common.signIn")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {t("settings.notifications.title", { defaultValue: "Notification Settings" })}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : preferences ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                {t("settings.notifications.emailTitle", { defaultValue: "Email Notifications" })}
              </CardTitle>
              <CardDescription>
                {t("settings.notifications.emailDescription", {
                  defaultValue: "Manage your email notification preferences for critical updates"
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Global Email Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1 flex-1">
                  <Label htmlFor="emailNotificationsEnabled" className="text-base font-medium">
                    {t("settings.notifications.enableEmail", { defaultValue: "Enable Email Notifications" })}
                  </Label>
                  <p className="text-sm text-gray-600">
                    {t("settings.notifications.enableEmailDesc", {
                      defaultValue: "Master toggle for all email notifications"
                    })}
                  </p>
                </div>
                <Switch
                  id="emailNotificationsEnabled"
                  checked={preferences.emailNotificationsEnabled}
                  onCheckedChange={(checked) => handleToggle('emailNotificationsEnabled', checked)}
                  disabled={updatePreferences.isPending}
                />
              </div>

              {/* Individual Email Preferences */}
              <div className="space-y-4 pl-2">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor="pickupRequestReceivedEmail"
                      className={!preferences.emailNotificationsEnabled ? "text-gray-400" : ""}
                    >
                      {t("settings.notifications.pickupRequestReceived", {
                        defaultValue: "Pickup Request Received"
                      })}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {t("settings.notifications.pickupRequestReceivedDesc", {
                        defaultValue: "When someone wants to pick up your bottles"
                      })}
                    </p>
                  </div>
                  <Switch
                    id="pickupRequestReceivedEmail"
                    checked={preferences.pickupRequestReceivedEmail}
                    onCheckedChange={(checked) => handleToggle('pickupRequestReceivedEmail', checked)}
                    disabled={!preferences.emailNotificationsEnabled || updatePreferences.isPending}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor="pickupRequestAcceptedEmail"
                      className={!preferences.emailNotificationsEnabled ? "text-gray-400" : ""}
                    >
                      {t("settings.notifications.pickupRequestAccepted", {
                        defaultValue: "Pickup Request Accepted"
                      })}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {t("settings.notifications.pickupRequestAcceptedDesc", {
                        defaultValue: "When your pickup request is accepted"
                      })}
                    </p>
                  </div>
                  <Switch
                    id="pickupRequestAcceptedEmail"
                    checked={preferences.pickupRequestAcceptedEmail}
                    onCheckedChange={(checked) => handleToggle('pickupRequestAcceptedEmail', checked)}
                    disabled={!preferences.emailNotificationsEnabled || updatePreferences.isPending}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor="transactionCompletedEmail"
                      className={!preferences.emailNotificationsEnabled ? "text-gray-400" : ""}
                    >
                      {t("settings.notifications.transactionCompleted", {
                        defaultValue: "Transaction Completed"
                      })}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {t("settings.notifications.transactionCompletedDesc", {
                        defaultValue: "When you receive earnings from a completed transaction"
                      })}
                    </p>
                  </div>
                  <Switch
                    id="transactionCompletedEmail"
                    checked={preferences.transactionCompletedEmail}
                    onCheckedChange={(checked) => handleToggle('transactionCompletedEmail', checked)}
                    disabled={!preferences.emailNotificationsEnabled || updatePreferences.isPending}
                  />
                </div>
              </div>

              {/* Info Note */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  {t("settings.notifications.info", {
                    defaultValue:
                      "Email notifications are sent only for critical updates. You'll still receive in-app notifications for all activities."
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <BottomNav />
    </div>
  );
};

export default NotificationSettings;
