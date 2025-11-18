
import { Toaster } from "@/components/toaster";
import { Toaster as Sonner } from "@/components/sonner";
import { TooltipProvider } from "@/components/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SignalRProvider } from "@/contexts/SignalRContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LanguageSyncProvider } from "@/components/LanguageSyncProvider";
import Index from "./features/home/pages/Index";
import Auth from "./features/auth/pages/Auth";
import About from "./features/static-pages/pages/About";
import FAQ from "./features/static-pages/pages/FAQ";
import TermsOfService from "./features/static-pages/pages/TermsOfService";
import CreateListing from "./features/bottle-listings/pages/CreateListing";
import MyListings from "./features/bottle-listings/pages/MyListings";
import MyPickupTasks from "./features/pickup-requests/pages/MyPickupTasks";
import Messages from "./features/messaging/pages/Messages";
import NotificationSettings from "./features/notifications/pages/NotificationSettings";
import Notifications from "./features/notifications/pages/Notifications";
import NotFound from "./features/static-pages/pages/NotFound";

// Configure React Query with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageSyncProvider>
            <SignalRProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/success" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/create-listing" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
                  <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                  <Route path="/my-pickup-tasks" element={<ProtectedRoute><MyPickupTasks /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                  <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </SignalRProvider>
          </LanguageSyncProvider>
        </AuthProvider>
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
