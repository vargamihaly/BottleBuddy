import {useQuery} from "@tanstack/react-query";
import {statisticsService} from "@/features/dashboard/api";

/**
 * Query keys for statistics
 */
export const statisticsKeys = {
  all: ['statistics'] as const,
  global: () => [...statisticsKeys.all, 'global'] as const,
};

/**
 * Hook to fetch global platform statistics
 */
export const useGlobalStatistics = () => {
  return useQuery({
    queryKey: statisticsKeys.global(),
    queryFn: statisticsService.getGlobal,
    staleTime: 60000, // 1 minute
  });
};
