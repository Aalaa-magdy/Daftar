import { formatApiDate } from '@/features/transactions/lib/format-api-date';
import type { StatisticsQueryParams } from '../types/statistics-query.types';
import type { StatisticsPeriod } from '../types/statistics.types';
import { getPeriodRange } from './period-range';

export function buildStatisticsQueryParams(
  period: StatisticsPeriod,
  anchor: Date,
): StatisticsQueryParams {
  if (period === 'week') {
    const { from, to } = getPeriodRange(anchor, 'week');

    return {
      timeFrame: 'week',
      startDate: formatApiDate(from),
      endDate: formatApiDate(to),
    };
  }

  if (period === 'month') {
    return {
      timeFrame: 'month',
      year: anchor.getFullYear(),
      month: anchor.getMonth() + 1,
    };
  }

  return {
    timeFrame: 'year',
    year: anchor.getFullYear(),
  };
}

export function buildStatisticsRequestParams(
  params: StatisticsQueryParams,
): Record<string, string | number> {
  const query: Record<string, string | number> = {
    timeFrame: params.timeFrame,
  };

  if (params.year != null) {
    query.year = params.year;
  }
  if (params.month != null) {
    query.month = params.month;
  }
  if (params.startDate) {
    query.startDate = params.startDate;
  }
  if (params.endDate) {
    query.endDate = params.endDate;
  }

  return query;
}
