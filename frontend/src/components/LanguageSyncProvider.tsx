import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/api/useUserSettings';

/**
 * Component that synchronizes user's preferred language from the backend
 * with the i18n library when user is authenticated
 */
export const LanguageSyncProvider = ({ children }: { children: React.ReactNode }) => {
    const { i18n } = useTranslation();
    const { user } = useAuth();
    const { data: settings } = useUserSettings();

    useEffect(() => {
        if (user && settings?.preferredLanguage) {
            // Only change language if it's different from current
            if (i18n.language !== settings.preferredLanguage) {
                i18n.changeLanguage(settings.preferredLanguage);
                // Also update localStorage as backup
                localStorage.setItem('preferredLanguage', settings.preferredLanguage);
            }
        }
    }, [user, settings, i18n]);

    return <>{children}</>;
};
