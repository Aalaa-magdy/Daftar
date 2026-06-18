import { useCategories } from '@/features/categories/hooks';
import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { transactionsApi } from '@/features/transactions/api/transactions.api';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { computePeriodStatistics } from '../lib/compute-statistics';
import { getPeriodRange, getYearRange, getMonthRange } from '../lib/period-range';
import type {
  PeriodStatistics,
  StatisticsPeriod,
} from '../types/statistics.types';
import { statisticsKeys } from './query-keys';

const EMPTY_STATS: PeriodStatistics = {
  dateLabel: '',
  totalSpent: 0,
  totalIncome: 0,
  categories: [],
  titleKey: 'statistics.monthlyTrend',
  trendSubtitle: '',
  trendMax: 1000,
  trend: [],
};

function toQueryParams(from: Date, to: Date) {
  return {
    startDate: from.toISOString(),
    endDate: to.toISOString(),
  };
}

function getTrendRange(anchor: Date, period: StatisticsPeriod) {
  if (period === 'week') {
    return getMonthRange(anchor);
  }

  if (period === 'month') {
    return getYearRange(anchor);
  }

  return getPeriodRange(anchor, period);
}

export const useStatistics = (
  period: StatisticsPeriod,
  anchorDate: Date,
) => {
  const { i18n } = useTranslation();
  const { isAuthenticated, isGuest, isAuthChecking } =
    useAuthenticatedSession();

  const periodRange = useMemo(
    () => getPeriodRange(anchorDate, period),
    [anchorDate, period],
  );
  const trendRange = useMemo(
    () => getTrendRange(anchorDate, period),
    [anchorDate, period],
  );

  const periodParams = useMemo(
    () => toQueryParams(periodRange.from, periodRange.to),
    [periodRange],
  );
  const trendParams = useMemo(
    () => toQueryParams(trendRange.from, trendRange.to),
    [trendRange],
  );

  const periodQuery = useQuery({
    queryKey: statisticsKeys.period(periodParams, 'period'),
    queryFn: () => transactionsApi.history(periodParams),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error: AxiosError) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  const trendQuery = useQuery({
    queryKey: statisticsKeys.period(trendParams, 'trend'),
    queryFn: () => transactionsApi.history(trendParams),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error: AxiosError) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  const stats = useMemo(() => {
    if (!isAuthenticated) return EMPTY_STATS;

    return computePeriodStatistics(
      periodQuery.data ?? [],
      trendQuery.data ?? [],
      categories,
      period,
      anchorDate,
      i18n.language,
    );
  }, [
    isAuthenticated,
    periodQuery.data,
    trendQuery.data,
    categories,
    period,
    anchorDate,
    i18n.language,
  ]);

  const isLoading =
    isAuthChecking ||
    (isAuthenticated &&
      (periodQuery.isLoading || trendQuery.isLoading || isCategoriesLoading));

  return {
    stats,
    isLoading,
    isGuest,
    isError: periodQuery.isError || trendQuery.isError,
    refetch: () => {
      void periodQuery.refetch();
      void trendQuery.refetch();
    },
  };
};
