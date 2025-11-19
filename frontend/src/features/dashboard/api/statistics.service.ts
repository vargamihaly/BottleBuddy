import { apiClient } from "@/shared/lib/apiClient";
import { Statistics } from "@/shared/types";

// Backend wraps responses in { data: ... }
interface ApiResponse<T> {
  data: T;
}

export const statisticsService = {
  /**
   * Get global platform statistics
   */
  getGlobal: async () => {
    const response = await apiClient.get<ApiResponse<Statistics>>('/api/statistics');
    return response.data;
  },
};
