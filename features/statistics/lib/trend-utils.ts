import type { ApiStatisticsTrendPoint } from '../types/statistics-response.types';
import type { StatisticsTrend } from '../types/statistics-trend.types';

const EMPTY_TREND: StatisticsTrend = { data: [] };

/** Ensures trend is always `{ selectedIndex?, data: [] }` regardless of API/cache shape. */
export function normalizeTrendShape(
  trend: StatisticsTrend | ApiStatisticsTrendPoint[] | undefined | null,
): StatisticsTrend {
  if (!trend) {
    return EMPTY_TREND;
  }

  if (Array.isArray(trend)) {
    return { data: trend };
  }

  return {
    selectedIndex: trend.selectedIndex,
    data: Array.isArray(trend.data) ? trend.data : [],
  };
}

export function getTrendPoints(
  trend: StatisticsTrend | ApiStatisticsTrendPoint[] | undefined | null,
): ApiStatisticsTrendPoint[] {
  return normalizeTrendShape(trend).data;
}

export function getTrendSelectedIndex(
  trend: StatisticsTrend | ApiStatisticsTrendPoint[] | undefined | null,
): number | undefined {
  const normalized = normalizeTrendShape(trend);
  return normalized.selectedIndex;
}
