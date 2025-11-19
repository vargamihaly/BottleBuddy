import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../providers/AppProviders";
import { Index } from "@/features/dashboard/pages";
import { Auth } from "@/features/auth/pages";
import { CreateListing, MyListings } from "@/features/listings/pages";
import { MyPickupTasks } from "@/features/pickup-requests/pages";
import { Messages } from "@/features/messaging/pages";
import { Notifications, NotificationSettings } from "@/features/notifications/pages";
import About from "@/app/pages/About";
import FAQ from "@/app/pages/FAQ";
import TermsOfService from "@/app/pages/TermsOfService";
import NotFound from "@/app/pages/NotFound";

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/success" element={<Auth />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route
        path="/create-listing"
        element={<ProtectedRoute><CreateListing /></ProtectedRoute>}
      />
      <Route
        path="/my-listings"
        element={<ProtectedRoute><MyListings /></ProtectedRoute>}
      />
      <Route
        path="/my-pickup-tasks"
        element={<ProtectedRoute><MyPickupTasks /></ProtectedRoute>}
      />
      <Route
        path="/messages"
        element={<ProtectedRoute><Messages /></ProtectedRoute>}
      />
      <Route
        path="/notifications"
        element={<ProtectedRoute><Notifications /></ProtectedRoute>}
      />
      <Route
        path="/settings/notifications"
        element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
