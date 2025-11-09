import { apiClient } from "@/lib/apiClient";
import { Statistics } from "@/types";

export const statisticsService = {
  /**
   * Get global platform statistics
   */
  getGlobal: () =>
    apiClient.get<Statistics>('/api/statistics'),
};
