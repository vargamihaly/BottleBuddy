import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Statistics } from "@/types";
import { useTranslation } from "react-i18next";

const fetchStatistics = async (): Promise<Statistics> => {
  const response = await apiClient.get<Statistics>('/api/statistics');
  return response;
};

export const StatsSection = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["statistics"],
    queryFn: fetchStatistics,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Show placeholders while loading or on error
  const displayStats = {
    totalBottlesReturned: stats?.totalBottlesReturned ?? 0,
    totalHufShared: stats?.totalHufShared ?? 0,
    activeUsers: stats?.activeUsers ?? 0,
  };

  // Format numbers with thousand separators
  const formatNumber = (num: number) => {
    return num.toLocaleString('hu-HU');
  };

  return (
    <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className={`text-4xl font-bold text-green-600 mb-2 ${isLoading ? 'animate-pulse' : ''}`}>
              {formatNumber(displayStats.totalBottlesReturned)}
            </div>
            <p className="text-gray-600">{t("stats.bottlesReturned")}</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold text-green-600 mb-2 ${isLoading ? 'animate-pulse' : ''}`}>
              {formatNumber(displayStats.totalHufShared)}
            </div>
            <p className="text-gray-600">{t("stats.hufShared")}</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold text-green-600 mb-2 ${isLoading ? 'animate-pulse' : ''}`}>
              {formatNumber(displayStats.activeUsers)}
            </div>
            <p className="text-gray-600">{t("stats.activeUsers")}</p>
          </div>
        </div>
        {isError && (
          <p className="text-center text-sm text-gray-500 mt-4">
            {t("common.statisticsUnavailable")}
          </p>
        )}
      </div>
    </section>
  );
};