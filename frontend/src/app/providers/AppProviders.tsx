import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageSyncProvider, ErrorBoundary, ProtectedRoute } from "@/shared/components";
import { SignalRProvider } from "@/contexts/SignalRContext";
import { queryClient } from "../queryClient";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageSyncProvider>
            <SignalRProvider>
              <Toaster />
              <Sonner />
              {children}
            </SignalRProvider>
          </LanguageSyncProvider>
        </AuthProvider>
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ErrorBoundary>
);

export { ProtectedRoute };
