# BottleBuddy Frontend Documentation

**Role**: Production-Grade Frontend Architecture
**Stack**: React 18 + TypeScript + Vite
**State Management**: TanStack Query (React Query) v5
**UI Framework**: Radix UI + Tailwind CSS + shadcn/ui
**Forms**: React Hook Form + Zod
**Real-time**: SignalR (@microsoft/signalr)
**i18n**: i18next + react-i18next

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Data Layer Architecture](#data-layer-architecture)
3. [API Client](#api-client)
4. [Authentication](#authentication)
5. [Routing & Navigation](#routing--navigation)
6. [Forms & Validation](#forms--validation)
7. [Real-time Features](#real-time-features)
8. [Internationalization](#internationalization)
9. [Code Samples](#code-samples)
10. [Best Practices](#best-practices)

---

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── services/          # API service layer (HTTP endpoints)
│   │       ├── bottleListings.service.ts
│   │       ├── pickupRequests.service.ts
│   │       ├── transactions.service.ts
│   │       ├── ratings.service.ts
│   │       ├── messages.service.ts
│   │       ├── statistics.service.ts
│   │       └── index.ts       # Barrel export
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives (Radix UI)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...            # 30+ components
│   │   ├── HomePage/          # Page-specific components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   └── ...
│   │   ├── Dashboard/         # Dashboard widgets
│   │   │   ├── WelcomeWidget.tsx
│   │   │   ├── QuickActionsBar.tsx
│   │   │   └── EarningsWidget.tsx
│   │   ├── BottleListingCard.tsx
│   │   ├── MapView.tsx
│   │   ├── LocationPicker.tsx
│   │   ├── ChatBox.tsx
│   │   ├── RatingDialog.tsx
│   │   ├── ProtectedRoute.tsx # Route guard
│   │   └── ErrorBoundary.tsx  # Error handling
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx    # Global auth state
│   │
│   ├── hooks/
│   │   ├── api/               # React Query custom hooks
│   │   │   ├── useBottleListings.ts
│   │   │   ├── usePickupRequests.ts
│   │   │   ├── useTransactions.ts
│   │   │   ├── useRatings.ts
│   │   │   ├── index.ts       # Barrel export
│   │   │   └── README.md      # Hook documentation
│   │   ├── useBottleListingOverview.ts  # Legacy composite hook
│   │   ├── useMessages.ts     # SignalR hook
│   │   └── use-toast.ts       # Toast notifications
│   │
│   ├── lib/
│   │   ├── apiClient.ts       # HTTP client + error handling
│   │   ├── mapUtils.ts        # Leaflet map utilities
│   │   ├── tokenUtils.ts      # JWT utilities
│   │   ├── i18n.ts            # i18n configuration
│   │   └── utils.ts           # General utilities (cn, etc.)
│   │
│   ├── pages/
│   │   ├── Index.tsx          # Home page (dashboard/landing)
│   │   ├── Auth.tsx           # Login/Register
│   │   ├── About.tsx
│   │   ├── FAQ.tsx
│   │   ├── TermsOfService.tsx
│   │   ├── CreateListing.tsx
│   │   ├── MyListings.tsx
│   │   ├── MyPickupTasks.tsx
│   │   ├── Messages.tsx       # Real-time chat
│   │   └── NotFound.tsx
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript type definitions
│   │
│   ├── App.tsx                # Root component + routing
│   ├── main.tsx               # Entry point
│   ├── config.ts              # Environment config
│   └── index.css              # Global styles
│
├── public/                    # Static assets
├── docs/                      # Documentation (this file)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### Why This Structure?

| Folder | Purpose | Ownership | Boundaries |
|--------|---------|-----------|------------|
| **api/services/** | Centralized HTTP endpoints. Single source of truth for all API calls. | Backend Team API contract | Never import from `hooks/`. Only uses `apiClient`. |
| **components/ui/** | Reusable Radix UI primitives (shadcn/ui). Design system foundation. | Frontend Team | Never imports from `pages/` or `hooks/api/`. |
| **components/** | Feature components. Stateful, domain-specific. | Feature Teams | Can import from `hooks/api/`, `ui/`, `contexts/`. |
| **contexts/** | Global state (auth, theme). React Context API for cross-cutting concerns. | Core Team | Minimal dependencies. No API calls (use hooks). |
| **hooks/api/** | React Query hooks wrapping services. Data fetching layer. | Frontend Team | Only imports from `api/services/`. Exports to components. |
| **hooks/** | Reusable logic (non-data). Custom hooks for side effects, state, effects. | Frontend Team | Can import from `hooks/api/`. No direct `apiClient` calls. |
| **lib/** | Pure utilities, no side effects. | Core Team | Zero external deps (except tiny libs like `clsx`). |
| **pages/** | Route-level components. Top-level views. | Feature Teams | Composes components. Uses hooks. No business logic. |
| **types/** | Shared TypeScript types. | Backend + Frontend | Ideally auto-generated from backend schema. |

---

## Data Layer Architecture

### React Query (TanStack Query) Patterns

We use **React Query v5** for all server state management.

#### Query Hook Pattern

```typescript
// File: hooks/api/useBottleListings.ts
import { useQuery } from "@tanstack/react-query";
import { bottleListingService } from "@/api/services";

export const bottleListingKeys = {
  all: ['bottleListings'] as const,
  lists: () => [...bottleListingKeys.all, 'list'] as const,
  list: (filters?: unknown) => [...bottleListingKeys.lists(), { filters }] as const,
  details: () => [...bottleListingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bottleListingKeys.details(), id] as const,
};

export const useBottleListings = () => {
  return useQuery({
    queryKey: bottleListingKeys.list(),
    queryFn: bottleListingService.getAll,
    staleTime: 30000, // 30 seconds
  });
};

export const useBottleListing = (id: string) => {
  return useQuery({
    queryKey: bottleListingKeys.detail(id),
    queryFn: () => bottleListingService.getById(id),
    enabled: !!id, // Only fetch when ID exists
  });
};
```

#### Mutation Hook Pattern

```typescript
// File: hooks/api/useBottleListings.ts (continued)
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { ApiRequestError } from "@/lib/apiClient";

export const useCreateBottleListing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateBottleListingRequest) =>
      bottleListingService.create(data),

    onSuccess: () => {
      // Invalidate all bottle listing queries
      queryClient.invalidateQueries({ queryKey: bottleListingKeys.all });

      toast({
        title: t('listing.createSuccess'),
        description: t('listing.createSuccess'),
      });
    },

    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : error instanceof Error
          ? error.message
          : t('common.error');

      toast({
        title: t('common.error'),
        description,
        variant: "destructive",
      });
    },
  });
};
```

### Cache Invalidation Matrix

| Mutation | Invalidates | Reason |
|----------|-------------|--------|
| `createBottleListing` | `['bottleListings']` | New listing added, refresh all lists |
| `updateBottleListing` | `['bottleListings']`, `['bottleListings', 'detail', id]` | Listing changed, refresh lists + detail |
| `deleteBottleListing` | `['bottleListings']` | Listing removed, refresh lists |
| `createPickupRequest` | `['pickupRequests']`, `['bottleListings']` | New request, affects listing state |
| `updatePickupRequestStatus` | `['pickupRequests']`, `['bottleListings']` | Status change, affects both |
| `createRating` | `['ratings']`, `['ratings', 'transaction', txnId]` | New rating, refresh all + specific |

### Error Taxonomy

Errors are classified and handled via `ApiRequestError`:

```typescript
// File: lib/apiClient.ts
export class ApiRequestError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiRequestError";
  }

  public getUserMessage(): string {
    if (this.statusCode === 401) return 'Invalid credentials.';
    if (this.statusCode === 403) return 'Permission denied.';
    if (this.statusCode === 404) return 'Resource not found.';
    if (this.statusCode === 429) return 'Too many requests.';
    if (this.statusCode && this.statusCode >= 500) return 'Server error.';
    return this.message || 'An unexpected error occurred.';
  }
}
```

### Query Cancellation

React Query automatically cancels queries when:
- Component unmounts
- Query key changes
- Manual `queryClient.cancelQueries()`

For manual cancellation:

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Cancel all queries
await queryClient.cancelQueries({ queryKey: ['bottleListings'] });

// Cancel specific query
await queryClient.cancelQueries({
  queryKey: bottleListingKeys.detail(id)
});
```

---

## API Client

### Architecture

```typescript
// File: lib/apiClient.ts
import config from "@/config";

const API_BASE_URL = config.api.baseUrl; // Vite env var

interface RequestOptions extends RequestInit {
  token?: string;
  skipAuth?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, skipAuth, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers ?? {});

  // Add auth header
  if (!skipAuth) {
    const authToken = token || localStorage.getItem('token');
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
  }

  // Set content type
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Parse response
  let body: unknown;
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    body = await response.json();
  } else {
    const text = await response.text();
    body = text ? JSON.parse(text) : { message: text };
  }

  // Handle errors
  if (!response.ok) {
    throw ApiRequestError.fromResponse(response, body);
  }

  return body as T;
}
```

### Retry Logic with Exponential Backoff

```typescript
async function requestWithRetry<T>(
  endpoint: string,
  options: RequestOptions = {},
  maxRetries = 3
): Promise<T> {
  let lastError: ApiRequestError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await request<T>(endpoint, options);
    } catch (error) {
      lastError = error as ApiRequestError;

      // Don't retry client errors (4xx)
      if (lastError.statusCode && lastError.statusCode >= 400 && lastError.statusCode < 500) {
        throw lastError;
      }

      // Don't retry on last attempt
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw lastError!;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    requestWithRetry<T>(endpoint, { ...options, method: "DELETE" }),

  // Non-retrying version for auth
  postNoRetry: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),
};
```

### Interceptors (Auth)

Handled via `RequestOptions`:

```typescript
// Auto-inject token
const authToken = token || localStorage.getItem('token');
if (authToken) {
  headers.set('Authorization', `Bearer ${authToken}`);
}

// Skip auth for public endpoints
apiClient.post('/api/auth/login', data, { skipAuth: true });
```

### Pagination

Not yet implemented. Recommended pattern:

```typescript
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export const useBottleListingsPaginated = (page = 1, pageSize = 20) => {
  return useQuery({
    queryKey: bottleListingKeys.list({ page, pageSize }),
    queryFn: () => bottleListingService.getAllPaginated(page, pageSize),
    staleTime: 30000,
  });
};
```

### Timeouts

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s

try {
  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
} catch (error) {
  if (error.name === 'AbortError') {
    throw new ApiRequestError('Request timeout');
  }
} finally {
  clearTimeout(timeoutId);
}
```

### Schema Validation

Not yet implemented. Recommended with Zod:

```typescript
import { z } from "zod";

const BottleListingSchema = z.object({
  id: z.string(),
  bottleCount: z.number(),
  locationAddress: z.string(),
  // ...
});

// Validate API response
const data = await apiClient.get<unknown>('/api/bottlelistings');
const validated = BottleListingSchema.array().parse(data);
```

---

## Authentication

### JWT Token Storage

Stored in `localStorage` (consider `httpOnly` cookies for production):

```typescript
// Store token
localStorage.setItem('token', authResponse.token);

// Retrieve token
const token = localStorage.getItem('token');

// Remove token
localStorage.removeItem('token');
```

### Auth Context

```typescript
// File: contexts/AuthContext.tsx
interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string, ...) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Protected Routes

```typescript
// File: components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
```

Usage in `App.tsx`:

```typescript
<Route
  path="/create-listing"
  element={
    <ProtectedRoute>
      <CreateListing />
    </ProtectedRoute>
  }
/>
```

### Google OAuth

```typescript
import { GoogleLogin } from "@react-oauth/google";

<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  useOneTap
  text="continue_with"
/>

const handleGoogleSuccess = async (credentialResponse) => {
  await signInWithGoogle(credentialResponse.credential);
  navigate("/");
};
```

---

## Routing & Navigation

### React Router v6

```typescript
// File: App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Protected Routes */}
        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MyListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate
navigate("/my-listings");

// Navigate with state
navigate("/messages", { state: { conversationId: "123" } });

// Replace history
navigate("/auth", { replace: true });

// Go back
navigate(-1);
```

### Route Guards

```typescript
// Conditional rendering based on auth
const { isAuthenticated } = useAuth();

{isAuthenticated ? (
  <Button onClick={() => navigate("/create-listing")}>
    Create Listing
  </Button>
) : (
  <Button onClick={() => navigate("/auth")}>
    Sign In
  </Button>
)}
```

---

## Forms & Validation

### React Hook Form + Zod

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define validation schema
const createListingSchema = z.object({
  bottleCount: z
    .number()
    .min(1, "Must have at least 1 bottle")
    .max(1000, "Cannot exceed 1000 bottles"),

  locationAddress: z
    .string()
    .min(5, "Address must be at least 5 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  estimatedRefund: z
    .number()
    .min(0, "Refund cannot be negative"),

  splitPercentage: z
    .number()
    .min(0, "Percentage cannot be negative")
    .max(100, "Percentage cannot exceed 100"),
});

type CreateListingFormData = z.infer<typeof createListingSchema>;

// 2. Create form component
const CreateListingForm = () => {
  const navigate = useNavigate();
  const createMutation = useCreateBottleListing();

  const form = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      bottleCount: 10,
      locationAddress: "",
      description: "",
      estimatedRefund: 500,
      splitPercentage: 50,
    },
  });

  const onSubmit = (data: CreateListingFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/my-listings");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Bottle Count */}
        <FormField
          control={form.control}
          name="bottleCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bottle Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Address */}
        <FormField
          control={form.control}
          name="locationAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St, Budapest"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Split Percentage */}
        <FormField
          control={form.control}
          name="splitPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Share (%)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="50"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full"
        >
          {createMutation.isPending ? "Creating..." : "Create Listing"}
        </Button>
      </form>
    </Form>
  );
};
```

### Dynamic Forms

```typescript
import { useFieldArray } from "react-hook-form";

const form = useForm({
  defaultValues: {
    items: [{ name: "", quantity: 0 }],
  },
});

const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "items",
});

return (
  <>
    {fields.map((field, index) => (
      <div key={field.id}>
        <Input {...form.register(`items.${index}.name`)} />
        <Input {...form.register(`items.${index}.quantity`)} />
        <Button onClick={() => remove(index)}>Remove</Button>
      </div>
    ))}
    <Button onClick={() => append({ name: "", quantity: 0 })}>
      Add Item
    </Button>
  </>
);
```

---

## Real-time Features (SignalR)

### Architecture Overview

The BottleBuddy frontend uses **SignalR (@microsoft/signalr)** for real-time messaging and notifications. The architecture follows a **Context Provider pattern** to maintain a **single global WebSocket connection** shared across all components.

#### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `SignalRProvider` | Maintains global WebSocket connection | `contexts/SignalRContext.tsx` |
| `useSignalR` | Hook to access connection | `hooks/useSignalR.ts` |
| `useMessages` | React Query + SignalR integration for messages | `hooks/useMessages.ts` |
| `useTypingIndicator` | Real-time typing indicators | `hooks/useTypingIndicator.ts` |
| `useSignalRStatus` | Connection status helper | `hooks/useSignalRStatus.ts` |

---

### SignalR Context Provider

The `SignalRProvider` creates and manages a **single global WebSocket connection** that all components share. This prevents multiple connections from being created when multiple components need real-time updates.

```typescript
// File: contexts/SignalRContext.tsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import config from "@/config";
import { useAuth } from "@/contexts/AuthContext";

interface SignalRContextValue {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  connectionError: string | null;
}

const SignalRContext = createContext<SignalRContextValue | undefined>(undefined);

/**
 * Creates a SignalR connection with proper configuration
 * Always fetches the latest token to handle token refresh scenarios
 */
const createSignalRConnection = (initialToken: string) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${config.api.baseUrl}/hubs/messages`, {
      accessTokenFactory: () => {
        // Always get the latest token to handle token refresh
        return localStorage.getItem("token") || initialToken || "";
      },
      withCredentials: false,
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        // Exponential backoff: 0s, 2s, 10s, 30s, then 60s
        if (retryContext.previousRetryCount === 0) return 0;
        if (retryContext.previousRetryCount === 1) return 2000;
        if (retryContext.previousRetryCount === 2) return 10000;
        if (retryContext.previousRetryCount === 3) return 30000;
        return 60000;
      },
    })
    .configureLogging(
      import.meta.env.DEV
        ? signalR.LogLevel.Information
        : signalR.LogLevel.Warning
    )
    .build();
};

export const SignalRProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const cleanupConnection = () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      isStartingRef.current = false;

      const currentConnection = connectionRef.current;
      if (currentConnection) {
        currentConnection.stop()
          .then(() => console.log("SignalR connection stopped"))
          .catch((error) => console.error("Error stopping SignalR:", error));
      }

      connectionRef.current = null;
      if (isMounted) {
        setConnection(null);
        setIsConnected(false);
      }
    };

    if (!token) {
      setConnectionError("No authentication token found");
      cleanupConnection();
      return () => {
        isMounted = false;
      };
    }

    setConnectionError(null);

    const newConnection = createSignalRConnection(token);
    connectionRef.current = newConnection;
    setConnection(newConnection);

    // Event handlers
    newConnection.onreconnecting((error) => {
      console.log("SignalR reconnecting...", error);
      setIsConnected(false);
      setConnectionError("Connection lost, attempting to reconnect...");
    });

    newConnection.onreconnected((connectionId) => {
      console.log("SignalR reconnected:", connectionId);
      setIsConnected(true);
      setConnectionError(null);
    });

    newConnection.onclose((error) => {
      console.log("SignalR connection closed:", error);
      setIsConnected(false);
      if (error) {
        setConnectionError(`Connection closed: ${error.message}`);
      }
    });

    // Start connection
    const startConnection = async () => {
      if (!connectionRef.current || isStartingRef.current) {
        return;
      }

      isStartingRef.current = true;
      try {
        await connectionRef.current.start();
        if (!isMounted) return;

        console.log("SignalR connected successfully");
        setIsConnected(true);
        setConnectionError(null);
      } catch (error) {
        console.error("SignalR connection failed:", error);
        if (!isMounted) return;

        setConnectionError(
          error instanceof Error ? error.message : "Failed to connect"
        );

        // Retry after 5 seconds
        retryTimeoutRef.current = setTimeout(() => {
          isStartingRef.current = false;
          startConnection();
        }, 5000);
        return;
      }
      isStartingRef.current = false;
    };

    startConnection();

    return () => {
      isMounted = false;
      cleanupConnection();
    };
  }, [token]);

  const value = useMemo(
    () => ({ connection, isConnected, connectionError }),
    [connection, isConnected, connectionError]
  );

  return (
    <SignalRContext.Provider value={value}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalRContext = () => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error("useSignalRContext must be used within a SignalRProvider");
  }
  return context;
};
```

#### Key Features:
1. **Single Global Connection**: Only one WebSocket connection for the entire app
2. **Token Refresh Support**: Always fetches latest token from localStorage
3. **Automatic Reconnection**: Exponential backoff (0s → 2s → 10s → 30s → 60s)
4. **Environment-aware Logging**: Verbose in dev, warnings only in prod
5. **Proper Cleanup**: Handles unmount, token changes, and connection errors

---

### useSignalR Hook

Simple hook to access the global SignalR connection from any component.

```typescript
// File: hooks/useSignalR.ts
import { useContext } from "react";
import { SignalRContext } from "@/contexts/SignalRContext";

export const useSignalR = () => {
  const context = useContext(SignalRContext);

  if (!context) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }

  return context;
};
```

**Usage:**
```typescript
const { connection, isConnected, connectionError } = useSignalR();
```

---

### useMessages Hook (React Query + SignalR Integration)

The `useMessages` hook combines **React Query** for HTTP requests with **SignalR** for real-time updates.

```typescript
// File: hooks/useMessages.ts
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message, CreateMessage } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useSignalR } from "@/hooks/useSignalR";
import { messageService } from "@/api/services";
import { ApiRequestError } from "@/lib/apiClient";

const messageKeys = {
  all: ['messages'] as const,
  byPickupRequest: (pickupRequestId: string) =>
    [...messageKeys.all, 'pickup-request', pickupRequestId] as const,
  unreadCount: (pickupRequestId: string) =>
    [...messageKeys.byPickupRequest(pickupRequestId), 'unread-count'] as const,
  totalUnread: () => [...messageKeys.all, 'total-unread'] as const,
};

export interface UseMessagesOptions {
  enabled?: boolean;
  subscribeToHub?: boolean;
  fetchMessages?: boolean;
  fetchUnreadCount?: boolean;
}

export const useMessages = (
  pickupRequestId: string | null,
  options: UseMessagesOptions = {}
) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { connection, isConnected } = useSignalR();

  const {
    enabled = true,
    subscribeToHub = true,
    fetchMessages = true,
    fetchUnreadCount = true,
  } = options;

  const hasPickupRequest = !!pickupRequestId;
  const shouldFetchMessages = Boolean(fetchMessages && enabled && hasPickupRequest);
  const shouldFetchUnreadCount = Boolean(fetchUnreadCount && enabled && hasPickupRequest);
  const shouldSubscribeToHub = Boolean(subscribeToHub && enabled && hasPickupRequest);

  // Fetch messages via HTTP
  const {
    data: messages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: messageKeys.byPickupRequest(pickupRequestId ?? ''),
    queryFn: () => messageService.getByPickupRequestId(pickupRequestId ?? ''),
    enabled: shouldFetchMessages,
    staleTime: 30000,
  });

  // Fetch unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: messageKeys.unreadCount(pickupRequestId ?? ''),
    queryFn: () => messageService.getUnreadCount(pickupRequestId ?? ''),
    enabled: shouldFetchUnreadCount,
  });

  // Subscribe to SignalR events
  useEffect(() => {
    const conversationId = pickupRequestId;

    if (!shouldSubscribeToHub || !connection || !isConnected || !conversationId) {
      return;
    }

    let joinedConversation = false;
    let isCleaningUp = false;

    // Join conversation
    connection
      .invoke("JoinConversation", conversationId)
      .then(() => {
        if (!isCleaningUp) {
          joinedConversation = true;
        }
      })
      .catch((err) => console.error("Error joining conversation:", err));

    // Handle incoming messages
    const handleReceiveMessage = (message: Message) => {
      if (fetchMessages) {
        queryClient.setQueryData<Message[] | undefined>(
          messageKeys.byPickupRequest(conversationId),
          (oldMessages) => {
            if (!oldMessages) return [message];

            const exists = oldMessages.some((m) => m.id === message.id);
            if (exists) return oldMessages;

            return [...oldMessages, message];
          }
        );
      } else {
        queryClient.invalidateQueries({ queryKey: messageKeys.byPickupRequest(conversationId) });
      }

      if (fetchUnreadCount) {
        queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(conversationId) });
      }
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
    };

    // Handle message read events
    const handleMessageRead = (data: { messageId: string; readAtUtc?: string }) => {
      if (fetchMessages) {
        queryClient.setQueryData<Message[] | undefined>(
          messageKeys.byPickupRequest(conversationId),
          (oldMessages) => {
            if (!oldMessages) return oldMessages;

            return oldMessages.map((msg) =>
              msg.id === data.messageId
                ? { ...msg, isRead: true, readAtUtc: data.readAtUtc }
                : msg
            );
          }
        );
      } else {
        queryClient.invalidateQueries({ queryKey: messageKeys.byPickupRequest(conversationId) });
      }

      if (fetchUnreadCount) {
        queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(conversationId) });
      }
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
    };

    connection.on("ReceiveMessage", handleReceiveMessage);
    connection.on("MessageRead", handleMessageRead);

    return () => {
      isCleaningUp = true;
      connection.off("ReceiveMessage", handleReceiveMessage);
      connection.off("MessageRead", handleMessageRead);

      if (joinedConversation) {
        connection
          .invoke("LeaveConversation", conversationId)
          .catch((err) => console.error("Error leaving conversation:", err));
      }
    };
  }, [
    connection,
    fetchMessages,
    fetchUnreadCount,
    isConnected,
    pickupRequestId,
    shouldSubscribeToHub,
  ]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data: CreateMessage) => messageService.sendMessage(pickupRequestId ?? '', data),
    onSuccess: () => {
      if (!pickupRequestId) return;
      queryClient.invalidateQueries({ queryKey: messageKeys.byPickupRequest(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
    },
    onError: (error: unknown) => {
      const description = error instanceof ApiRequestError
        ? error.getUserMessage()
        : error instanceof Error
          ? error.message
          : "Please try again.";

      toast({
        title: "Failed to send message",
        description,
        variant: "destructive",
      });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => messageService.markAsRead(pickupRequestId ?? ''),
    onSuccess: () => {
      if (!pickupRequestId) return;
      queryClient.invalidateQueries({ queryKey: messageKeys.byPickupRequest(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount(pickupRequestId) });
      queryClient.invalidateQueries({ queryKey: messageKeys.totalUnread() });
    },
  });

  return {
    messages,
    isLoading,
    isError,
    unreadCount,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    refetch,
  };
};

export const useTotalUnreadCount = () => {
  const { data: totalUnreadCount = 0 } = useQuery({
    queryKey: messageKeys.totalUnread(),
    queryFn: messageService.getTotalUnreadCount,
    staleTime: 60000,
  });

  return totalUnreadCount;
};
```

#### Options API:

| Option | Default | Purpose |
|--------|---------|---------|
| `enabled` | `true` | Enable/disable all queries |
| `subscribeToHub` | `true` | Subscribe to SignalR events |
| `fetchMessages` | `true` | Fetch full message list |
| `fetchUnreadCount` | `true` | Fetch unread count |

**Usage Examples:**

```typescript
// Full messages view (ChatBox)
const { messages, sendMessage, unreadCount } = useMessages(pickupRequestId);

// Only unread count (ConversationList)
const { unreadCount } = useMessages(pickupRequest.id, { fetchMessages: false });

// Disabled until user selects conversation
const { messages } = useMessages(selectedId, { enabled: !!selectedId });
```

---

### useTypingIndicator Hook

Real-time typing indicators for chat conversations.

```typescript
// File: hooks/useTypingIndicator.ts
import { useEffect, useRef, useCallback, useState } from "react";
import { useSignalR } from "@/hooks/useSignalR";

interface UseTypingIndicatorOptions {
  pickupRequestId: string | null;
  currentUserId: string | null;
}

const TYPING_DEBOUNCE_DELAY = 500; // ms
const TYPING_TIMEOUT = 3000; // ms

export const useTypingIndicator = ({
  pickupRequestId,
  currentUserId,
}: UseTypingIndicatorOptions) => {
  const { connection, isConnected } = useSignalR();
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sendTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCurrentlyTypingRef = useRef(false);
  const typingUsersMapRef = useRef<Map<string, { userId: string; timestamp: number }>>(new Map());

  // Clean up stale typing indicators
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const updatedMap = new Map(typingUsersMapRef.current);
      let hasChanges = false;

      updatedMap.forEach((typingUser, userId) => {
        if (now - typingUser.timestamp > TYPING_TIMEOUT + 1000) {
          updatedMap.delete(userId);
          hasChanges = true;
        }
      });

      if (hasChanges) {
        typingUsersMapRef.current = updatedMap;
        setTypingUsers(Array.from(updatedMap.keys()));
      }
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Listen for typing events
  useEffect(() => {
    if (!connection || !isConnected || !pickupRequestId) {
      return;
    }

    const handleUserTyping = (data: { userId: string; isTyping: boolean }) => {
      // Don't show current user's typing status
      if (data.userId === currentUserId) {
        return;
      }

      const updatedMap = new Map(typingUsersMapRef.current);

      if (data.isTyping) {
        updatedMap.set(data.userId, {
          userId: data.userId,
          timestamp: Date.now(),
        });
      } else {
        updatedMap.delete(data.userId);
      }

      typingUsersMapRef.current = updatedMap;
      setTypingUsers(Array.from(updatedMap.keys()));
    };

    connection.on("UserTyping", handleUserTyping);

    return () => {
      connection.off("UserTyping", handleUserTyping);
    };
  }, [connection, isConnected, pickupRequestId, currentUserId]);

  // Send typing indicator (debounced)
  const startTyping = useCallback(() => {
    if (!connection || !isConnected || !pickupRequestId) return;

    // Clear existing debounce timeout
    if (sendTypingTimeoutRef.current) {
      clearTimeout(sendTypingTimeoutRef.current);
    }

    // If not currently typing, wait for debounce delay
    if (!isCurrentlyTypingRef.current) {
      sendTypingTimeoutRef.current = setTimeout(() => {
        isCurrentlyTypingRef.current = true;
        connection
          .invoke("SendTypingIndicator", pickupRequestId, true)
          .catch((err) => console.error("Error sending typing indicator:", err));
      }, TYPING_DEBOUNCE_DELAY);
    }

    // Reset auto-stop timer
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isCurrentlyTypingRef.current) {
        isCurrentlyTypingRef.current = false;
        connection
          .invoke("SendTypingIndicator", pickupRequestId, false)
          .catch((err) => console.error("Error stopping typing:", err));
      }
    }, TYPING_TIMEOUT);
  }, [connection, isConnected, pickupRequestId]);

  // Stop typing immediately
  const stopTyping = useCallback(() => {
    if (!connection || !isConnected || !pickupRequestId) return;

    // Clear all timeouts
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (sendTypingTimeoutRef.current) {
      clearTimeout(sendTypingTimeoutRef.current);
      sendTypingTimeoutRef.current = null;
    }

    // Send stop typing if currently typing
    if (isCurrentlyTypingRef.current) {
      isCurrentlyTypingRef.current = false;
      connection
        .invoke("SendTypingIndicator", pickupRequestId, false)
        .catch((err) => console.error("Error stopping typing:", err));
    }
  }, [connection, isConnected, pickupRequestId]);

  return {
    typingUsers,
    startTyping,
    stopTyping,
  };
};
```

**Usage:**
```typescript
const { typingUsers, startTyping, stopTyping } = useTypingIndicator({
  pickupRequestId,
  currentUserId: user?.id || null,
});

<Input
  onChange={(e) => {
    startTyping();
    // ... handle input change
  }}
  onBlur={stopTyping}
/>

{typingUsers.length > 0 && (
  <div>{typingUsers.join(", ")} is typing...</div>
)}
```

---

### useSignalRStatus Hook

Helper hook for connection status UI indicators.

```typescript
// File: hooks/useSignalRStatus.ts
import { useSignalR } from "./useSignalR";

export const useSignalRStatus = () => {
  const { isConnected, connectionError } = useSignalR();

  return {
    isConnected,
    hasError: !!connectionError,
    errorMessage: connectionError,
    isDisconnected: !isConnected && !connectionError,
    isReconnecting: !isConnected && !!connectionError,
  };
};
```

**Usage:**
```typescript
const { isConnected, hasError, errorMessage, isReconnecting } = useSignalRStatus();

{isReconnecting && (
  <Alert variant="warning">
    <AlertCircle className="h-4 h-4" />
    <AlertDescription>Reconnecting to chat...</AlertDescription>
  </Alert>
)}
```

---

### App Setup

The `SignalRProvider` must wrap the entire app and be placed **inside** `AuthProvider` (so it can access the token).

```typescript
// File: App.tsx
import { AuthProvider } from "@/contexts/AuthContext";
import { SignalRProvider } from "@/contexts/SignalRContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SignalRProvider>
        <BrowserRouter>
          <Routes>
            {/* ... routes */}
          </Routes>
        </BrowserRouter>
      </SignalRProvider>
    </AuthProvider>
  </QueryClientProvider>
);
```

**Provider Hierarchy:**
```
ErrorBoundary
└── QueryClientProvider
    └── AuthProvider (provides token)
        └── SignalRProvider (uses token)
            └── BrowserRouter
                └── Routes
```

---

### Backend SignalR Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `JoinConversation` | Client → Server | Join a conversation group |
| `LeaveConversation` | Client → Server | Leave a conversation group |
| `SendTypingIndicator` | Client → Server | Send typing status |
| `ReceiveMessage` | Server → Client | Receive new message |
| `MessageRead` | Server → Client | Message marked as read |
| `UserTyping` | Server → Client | Other user typing status |

---

### Performance Considerations

1. **Single Connection**: Only one WebSocket connection for entire app (not per component)
2. **Optimistic Updates**: Messages appear instantly via `setQueryData` before HTTP response
3. **Conditional Fetching**: Components can opt-out of fetching messages (`fetchMessages: false`)
4. **Debounced Typing**: 500ms debounce prevents excessive SignalR calls
5. **Environment Logging**: Verbose logs only in development

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| **Multiple connections** | Ensure `SignalRProvider` wraps app only once |
| **401 Unauthorized** | Check `accessTokenFactory` returns valid token |
| **Connection keeps retrying** | Token likely expired, check auth flow |
| **Messages not updating** | Verify `queryClient.invalidateQueries` is called |
| **Typing indicator stuck** | Check TYPING_TIMEOUT (3s) cleanup logic |

---

## Internationalization

### i18next Setup

```typescript
// File: lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      common: {
        brandName: "BottleBuddy",
        signIn: "Sign In",
        signOut: "Sign Out",
        // ...
      },
      listing: {
        createSuccess: "Listing created successfully!",
        deleteConfirm: "Are you sure you want to delete this listing?",
        // ...
      },
    },
  },
  hu: {
    translation: {
      common: {
        brandName: "BottleBuddy",
        signIn: "Bejelentkezés",
        signOut: "Kijelentkezés",
        // ...
      },
      listing: {
        createSuccess: "Hirdetés sikeresen létrehozva!",
        deleteConfirm: "Biztosan törölni szeretnéd ezt a hirdetést?",
        // ...
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "hu",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### Usage

```typescript
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <h1>{t('common.brandName')}</h1>
      <Button onClick={() => i18n.changeLanguage('en')}>
        English
      </Button>
      <Button onClick={() => i18n.changeLanguage('hu')}>
        Magyar
      </Button>
    </>
  );
};
```

---

## Code Samples

### Add New Query Hook

```typescript
// 1. Create service (api/services/notifications.service.ts)
export const notificationService = {
  getAll: async () => {
    return await apiClient.get<Notification[]>('/api/notifications');
  },

  markAsRead: async (id: string) => {
    return await apiClient.patch(`/api/notifications/${id}/read`);
  },
};

// 2. Create hook (hooks/api/useNotifications.ts)
export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
};

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationService.getAll,
    staleTime: 10000, // 10 seconds
  });
};

// 3. Export from index (hooks/api/index.ts)
export { useNotifications } from './useNotifications';

// 4. Use in component
const { data: notifications, isLoading } = useNotifications();
```

### Add New Mutation Hook

```typescript
// In hooks/api/useNotifications.ts
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast({ title: "Marked as read" });
    },

    onError: (error: unknown) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Usage
const markAsReadMutation = useMarkNotificationAsRead();
markAsReadMutation.mutate(notificationId);
```

### Create Route Guard

```typescript
// File: components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Usage in App.tsx
<Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>
```

### Form with RHF + Zod (Complete Example)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  fullName: z.string().max(100).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data.email, data.password, data.fullName);
      navigate("/");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Sign up failed",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-red-500">{form.formState.errors.root.message}</p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
};
```

---

## Best Practices

### ✅ DO

```typescript
// Use custom hooks from hooks/api/
const { data: listings } = useBottleListings();

// Use enabled flag for conditional queries
const { data } = useTransaction(id, !!id);

// Use mutation callbacks for navigation
createMutation.mutate(data, {
  onSuccess: () => navigate('/'),
});

// Destructure only what you need
const { data, isLoading, isError } = useQuery(...);

// Use proper TypeScript types
const listings: BottleListing[] = data ?? [];

// Use translation keys
{t('listing.createSuccess')}

// Use shadcn/ui components
<Button variant="outline" size="lg">Click me</Button>
```

### ❌ DON'T

```typescript
// Don't call apiClient directly in components
const data = await apiClient.get('/api/listings'); // ❌

// Don't create inline queries
const { data } = useQuery({
  queryKey: ['listings'],
  queryFn: () => apiClient.get('/api/listings'), // ❌
});

// Don't forget enabled flag for optional IDs
useTransaction(id || ''); // ❌ - will error if id is undefined

// Don't hardcode strings
<h1>Welcome to BottleBuddy</h1> // ❌
<h1>{t('common.welcome')}</h1>  // ✅

// Don't use any
const data: any = response; // ❌
const data: BottleListing = response; // ✅

// Don't mutate state directly
state.count++; // ❌
setState({ count: state.count + 1 }); // ✅
```

### Code Review Checklist

- [ ] All API calls use custom hooks from `hooks/api/`
- [ ] Query keys follow naming convention
- [ ] Mutations invalidate correct caches
- [ ] Forms use React Hook Form + Zod validation
- [ ] Components use i18n translation keys
- [ ] TypeScript types are properly defined
- [ ] Error handling with `ApiRequestError`
- [ ] Loading states handled with `isLoading`
- [ ] Protected routes use `<ProtectedRoute>`
- [ ] No direct `apiClient` calls in components
- [ ] shadcn/ui components used consistently
- [ ] Tailwind classes follow conventions (`cn()` utility)

---

## Performance Optimization

### React Query Optimizations

```typescript
// Prefetch data
const queryClient = useQueryClient();
queryClient.prefetchQuery({
  queryKey: bottleListingKeys.detail(id),
  queryFn: () => bottleListingService.getById(id),
});

// Set stale time to reduce refetches
const { data } = useBottleListings({
  staleTime: 60000, // 1 minute
});

// Use select to derive state
const { data: bottleCount } = useBottleListings({
  select: (data) => data.length,
});

// Disable refetch on window focus for static data
const { data } = useGlobalStatistics({
  refetchOnWindowFocus: false,
});
```

### Code Splitting

```typescript
// Lazy load pages
import { lazy, Suspense } from "react";

const Messages = lazy(() => import("./pages/Messages"));

<Route
  path="/messages"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <Messages />
    </Suspense>
  }
/>
```

---

## Testing

### Mock Custom Hooks

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBottleListings } from "@/hooks/api";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test("fetches bottle listings", async () => {
  const { result } = renderHook(() => useBottleListings(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toHaveLength(10);
});
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Query not updating after mutation** | Check if mutation invalidates correct query key |
| **401 Unauthorized** | Verify token in localStorage, check auth header |
| **CORS errors** | Add frontend URL to backend CORS whitelist |
| **SignalR not connecting** | Check `accessTokenFactory` returns valid token |
| **Type errors in forms** | Ensure Zod schema matches TypeScript types |
| **Translation missing** | Check `i18n.ts` for translation key |
| **Button stays disabled** | Verify `isPending` state is being used correctly |

### Debug React Query

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

## Migration Path (Legacy → New Architecture)

### Step 1: Create Service

```typescript
// api/services/myFeature.service.ts
export const myFeatureService = {
  getAll: () => apiClient.get<MyFeature[]>('/api/my-features'),
};
```

### Step 2: Create Hook

```typescript
// hooks/api/useMyFeature.ts
export const useMyFeatures = () => {
  return useQuery({
    queryKey: ['myFeatures'],
    queryFn: myFeatureService.getAll,
  });
};
```

### Step 3: Replace Component Code

**Before:**
```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  apiClient.get('/api/my-features')
    .then(setData)
    .finally(() => setLoading(false));
}, []);
```

**After:**
```typescript
const { data, isLoading } = useMyFeatures();
```

---

## Related Documentation

- [Backend API Documentation](./backend.md)
- [Deployment Guide](./AZURE_DEPLOYMENT.md)
- [API Hooks README](../frontend/src/hooks/api/README.md)
- [Terms of Service](../frontend/src/pages/TermsOfService.tsx)

---

**Last Updated:** 2025-01-10
**Maintained by:** Frontend Architecture Team
**Questions?** Open an issue or contact: misi@protonmail.ch
