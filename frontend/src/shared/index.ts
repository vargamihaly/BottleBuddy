// API
export { apiClient, ApiRequestError } from './api/apiClient';

// Contexts
export { AuthProvider, useAuth } from './contexts/AuthContext';
export { SignalRProvider, useSignalRContext } from './contexts/SignalRContext';

// Hooks
export { useToast } from './hooks/use-toast';
export { useMobile } from './hooks/use-mobile';
export { useSignalRStatus } from './hooks/useSignalRStatus';

// Lib
export { getUserIdFromToken, isValidToken } from './lib/tokenUtils';
export { cn } from './lib/utils';
export * from './lib/mapUtils';

// Layout Components
export { ProtectedRoute } from './components/layout/ProtectedRoute';
export { ErrorBoundary } from './components/layout/ErrorBoundary';
export { LanguageSwitcher } from './components/layout/LanguageSwitcher';
export { LanguageSyncProvider } from './components/layout/LanguageSyncProvider';
export { LoadingSpinner } from './components/layout/LoadingSpinner';

// Re-export all UI components
export * from './components/ui/button';
export * from './components/ui/card';
export * from './components/ui/input';
export * from './components/ui/label';
export * from './components/ui/badge';
export * from './components/ui/separator';
export * from './components/ui/dialog';
export * from './components/ui/dropdown-menu';
export * from './components/ui/select';
export * from './components/ui/textarea';
export * from './components/ui/form';
export * from './components/ui/checkbox';
export * from './components/ui/avatar';
export * from './components/ui/skeleton';
export * from './components/ui/alert';
export * from './components/ui/progress';
export * from './components/ui/tabs';
export * from './components/ui/pagination';
export * from './components/ui/tooltip';
export * from './components/ui/popover';
export * from './components/ui/calendar';
export * from './components/ui/slider';
export * from './components/ui/switch';
export * from './components/ui/radio-group';
export * from './components/ui/table';
export * from './components/ui/breadcrumb';
export * from './components/ui/navigation-menu';
export * from './components/ui/sheet';
export * from './components/ui/drawer';
export * from './components/ui/alert-dialog';
export * from './components/ui/toggle';
export * from './components/ui/toggle-group';
export * from './components/ui/bottom-nav';
export * from './components/ui/sidebar';
export * from './components/ui/command';
export * from './components/ui/carousel';
export * from './components/ui/aspect-ratio';
export * from './components/ui/scroll-area';
export * from './components/ui/hover-card';
export * from './components/ui/resizable';
export * from './components/ui/menubar';
export * from './components/ui/context-menu';
export * from './components/ui/input-otp';
export * from './components/ui/chart';
export * from './components/ui/sonner';
export * from './components/ui/toaster';
