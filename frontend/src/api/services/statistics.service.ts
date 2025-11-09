import { apiClient } from "@/lib/apiClient";
import { Statistics } from "@/types";

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
