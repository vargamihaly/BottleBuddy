import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MapPin, Users, Bell, LogOut, Info, Recycle, MessageCircle, HelpCircle, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTotalUnreadCount } from "@/hooks/useMessages";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useState } from "react";

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
                      <Button variant="ghost" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="justify-start">
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
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Bell className="w-4 h-4" />
                </Button>
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