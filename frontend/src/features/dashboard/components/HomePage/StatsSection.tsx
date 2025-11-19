import {useTranslation} from "react-i18next";
import {useGlobalStatistics} from "@/features/dashboard/hooks";

export const StatsSection = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError } = useGlobalStatistics();

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