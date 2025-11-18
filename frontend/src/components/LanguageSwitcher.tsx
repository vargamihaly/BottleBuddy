import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateUserSettings } from "@/hooks/api/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps = {}) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const updateSettings = useUpdateUserSettings();

  const changeLanguage = async (lng: string) => {
    // Update i18n immediately for instant UI feedback
    i18n.changeLanguage(lng);
    // Save to localStorage as fallback
    localStorage.setItem('preferredLanguage', lng);

    // If user is authenticated, save to backend
    if (user) {
      try {
        await updateSettings.mutateAsync({
          preferredLanguage: lng
        });
      } catch (error) {
        console.error('Failed to save language preference to backend:', error);
        // Don't show error toast - localStorage fallback is sufficient
      }
    }
  };

  const languages = [
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`gap-2 ${className || ''}`}>
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage.flag} {currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={i18n.language === language.code ? 'bg-green-50' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
