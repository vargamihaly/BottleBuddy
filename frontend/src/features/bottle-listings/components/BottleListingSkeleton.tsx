import { Card, CardContent, CardHeader } from '@/components/card';
import { Skeleton } from '@/components/skeleton';

export const BottleListingSkeleton = () => (
  <Card className="border-green-100">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="h-20 w-full rounded-lg" />

      <Skeleton className="h-10 w-full rounded-md" />
    </CardContent>
  </Card>
);

export const BottleListingsGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <BottleListingSkeleton key={index} />
    ))}
  </div>
);
