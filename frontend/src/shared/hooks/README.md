# API Hooks Documentation

Custom React Query hooks are organized by domain inside `src/features/*/hooks`. Use these feature-level barrels (e.g., `@/features/listings/hooks`) instead of calling the API services directly. Each hook wraps the corresponding service in `src/features/*/api` and handles caching, loading states, and toast-based error feedback.

### Quick reference
- Listings: `@/features/listings/hooks`
- Pickup requests: `@/features/pickup-requests/hooks`
- Messaging: `@/features/messaging/hooks`
- Notifications & user activity: `@/features/notifications/hooks`
- Dashboard metrics & transactions: `@/features/dashboard/hooks`
