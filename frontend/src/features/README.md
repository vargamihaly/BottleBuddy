# API Hooks Documentation

This directory contains custom React hooks for all API interactions in the BottleBuddy application. All components should use these hooks instead of calling `apiClient` directly.

## Architecture Overview

```
┌─────────────────┐
│   Components    │ ← Use custom hooks
└────────┬────────┘
         │
┌────────▼────────┐
│  Custom Hooks   │ ← This directory
│  /hooks/api/    │
└────────┬────────┘
         │
┌────────▼────────┐
│  API Services   │ ← Centralized endpoints
│ /api/services/  │
└────────┬────────┘
         │
┌────────▼────────┐
│   apiClient     │ ← HTTP client
└─────────────────┘
```

## Benefits

✅ **Centralized API Logic** - All API calls in one place
✅ **Automatic Caching** - React Query handles caching automatically
✅ **Error Handling** - Consistent error handling with toasts
✅ **Loading States** - Built-in `isLoading`, `isPending` states
✅ **Type Safety** - Full TypeScript support
✅ **Reusability** - DRY principle, reuse across components
✅ **Testability** - Easy to mock hooks in tests

## Available Hooks

### Bottle Listings

#### Queries
```typescript
import { useBottleListings, useBottleListing, useMyBottleListings } from '@/hooks/api';

// Get all listings
const { data: listings, isLoading } = useBottleListings();

// Get single listing
const { data: listing } = useBottleListing(id);

// Get current user's listings
const { data: myListings } = useMyBottleListings();
```

#### Mutations
```typescript
import {
  useCreateBottleListing,
  useUpdateBottleListing,
  useDeleteBottleListing
} from '@/hooks/api';

// Create listing
const createMutation = useCreateBottleListing();
createMutation.mutate(data, {
  onSuccess: () => navigate('/'),
});

// Update listing
const updateMutation = useUpdateBottleListing();
updateMutation.mutate({ id, data });

// Delete listing
const deleteMutation = useDeleteBottleListing();
deleteMutation.mutate(id);
```

### Pickup Requests

```typescript
import {
  usePickupRequestsByListing,
  useMyPickupRequests,
  useCreatePickupRequest,
  useUpdatePickupRequestStatus
} from '@/hooks/api';

// Get requests for a listing
const { data: requests } = usePickupRequestsByListing(listingId, enabled);

// Get my requests (as volunteer)
const { data: myRequests } = useMyPickupRequests();

// Create request
const createMutation = useCreatePickupRequest();
createMutation.mutate({ listingId });

// Update status
const updateMutation = useUpdatePickupRequestStatus();
updateMutation.mutate({ requestId, status: 'accepted' });
```

### Transactions

```typescript
import {
  useMyTransactions,
  useTransactionByPickupRequest,
  useTransaction
} from '@/hooks/api';

// Get my transactions
const { data: transactions } = useMyTransactions();

// Get transaction by pickup request
const { data: transaction } = useTransactionByPickupRequest(requestId);

// Get transaction by ID
const { data: transaction } = useTransaction(transactionId);
```

### Ratings

```typescript
import {
  useRatingByTransaction,
  useRatingsByUser,
  useCreateRating
} from '@/hooks/api';

// Get rating for transaction
const { data: rating } = useRatingByTransaction(transactionId);

// Get all ratings for user
const { data: ratings } = useRatingsByUser(userId);

// Create rating
const createMutation = useCreateRating();
createMutation.mutate({ transactionId, value: 5, comment: 'Great!' });
```

### Statistics

```typescript
import { useGlobalStatistics } from '@/hooks/api';

const { data: stats, isLoading } = useGlobalStatistics();
```

## Usage Patterns

### Basic Query

```typescript
import { useBottleListings } from '@/hooks/api';

const MyComponent = () => {
  const { data, isLoading, isError, error } = useBottleListings();

  if (isLoading) return <Loading />;
  if (isError) return <Error message={error.message} />;

  return <div>{data.map(listing => ...)}</div>;
};
```

### Conditional Query (enabled)

```typescript
const { data: transaction } = useTransactionByPickupRequest(
  pickupRequestId || '',
  !!pickupRequestId  // Only fetch when ID exists
);
```

### Mutation with Callback

```typescript
const createMutation = useCreateBottleListing();

const handleSubmit = (data) => {
  createMutation.mutate(data, {
    onSuccess: () => {
      navigate('/');
      // Custom success handling
    },
    onError: (error) => {
      // Custom error handling
    },
  });
};
```

### Using Loading State

```typescript
const deleteMutation = useDeleteBottleListing();

<Button
  onClick={() => deleteMutation.mutate(id)}
  disabled={deleteMutation.isPending}
>
  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
</Button>
```

## Query Keys

Each hook uses standardized query keys for cache management:

```typescript
// Bottle Listings
['bottleListings']
['bottleListings', 'list', { filters }]
['bottleListings', 'detail', id]
['bottleListings', 'my-listings']

// Pickup Requests
['pickupRequests']
['pickupRequests', 'listing', listingId]
['pickupRequests', 'my-requests']

// Transactions
['transactions']
['transactions', 'my-transactions']
['transactions', 'pickup-request', pickupRequestId]

// Ratings
['ratings']
['ratings', 'transaction', transactionId]
['ratings', 'user', userId]

// Statistics
['statistics', 'global']
```

## Cache Invalidation

Hooks automatically invalidate related caches after mutations:

```typescript
// When creating a listing, these are invalidated:
- ['bottleListings']

// When updating pickup request status:
- ['pickupRequests']
- ['bottleListings']
```

## Error Handling

All mutations include automatic error handling with toast notifications:

- Success toasts with internationalized messages
- Error toasts with API error messages or fallbacks
- Automatic query invalidation on success

## Best Practices

### ✅ DO

```typescript
// Use hooks in components
const { data: listings } = useBottleListings();

// Use enabled flag for conditional queries
const { data } = useTransaction(id, !!id);

// Use mutation callbacks for navigation
createMutation.mutate(data, {
  onSuccess: () => navigate('/'),
});
```

### ❌ DON'T

```typescript
// Don't call apiClient directly
const data = await apiClient.get('/api/listings'); // ❌

// Don't create inline queries
const { data } = useQuery({
  queryKey: ['listings'],
  queryFn: () => apiClient.get('/api/listings'), // ❌
});

// Don't forget enabled flag for optional IDs
useTransaction(id || ''); // ❌ - will error if id is undefined
useTransaction(id || '', !!id); // ✅
```

## Adding New Hooks

When adding new API endpoints:

1. **Create Service** in `/api/services/`:
```typescript
// /api/services/newFeature.service.ts
export const newFeatureService = {
  getAll: () => apiClient.get<Feature[]>('/api/features'),
  create: (data: CreateFeature) => apiClient.post('/api/features', data),
};
```

2. **Create Hook** in `/hooks/api/`:
```typescript
// /hooks/api/useFeatures.ts
export const useFeatures = () => {
  return useQuery({
    queryKey: ['features'],
    queryFn: newFeatureService.getAll,
  });
};

export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: newFeatureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast({ title: t('success') });
    },
  });
};
```

3. **Export** from index files
4. **Use** in components

## Migration Guide

To migrate existing code:

**Before:**
```typescript
const { data } = useQuery({
  queryKey: ['listings'],
  queryFn: () => apiClient.get('/api/bottlelistings'),
});

const mutation = useMutation({
  mutationFn: (data) => apiClient.post('/api/bottlelistings', data),
  onSuccess: () => {
    queryClient.invalidateQueries(['listings']);
    toast({ title: 'Success' });
  },
});
```

**After:**
```typescript
const { data } = useBottleListings();
const createMutation = useCreateBottleListing();
```

## Related Documentation

- [React Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [API Services](/api/services/README.md) (if exists)
- [Type Definitions](/types/index.ts)
