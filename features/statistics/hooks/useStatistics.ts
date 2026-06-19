import { useCategories } from '@/features/categories/hooks';
import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { statisticsApi } from '../api/statistics.api';
import { buildStatisticsQueryParams } from '../lib/build-statistics-query';
import { mapStatisticsToPeriodStatistics } from '../lib/map-statistics-to-ui';
import type {
  PeriodStatistics,
  StatisticsPeriod,
} from '../types/statistics.types';
import { statisticsKeys } from './query-keys';

const EMPTY_STATS: PeriodStatistics = {
  dateLabel: '',
  totalSpent: 0,
  totalIncome: 0,
  periodTotalSpent: 0,
  categories: [],
  titleKey: 'statistics.monthlyTrend',
  trendSubtitle: '',
  trendMax: 1000,
  trend: [],
};

export const useStatistics = (
  period: StatisticsPeriod,
  anchorDate: Date,
) => {
  const { i18n } = useTranslation();
  const { isAuthenticated, isGuest, isAuthChecking } =
    useAuthenticatedSession();

  const queryParams = useMemo(
    () => buildStatisticsQueryParams(period, anchorDate),
    [period, anchorDate],
  );

  const statisticsQuery = useQuery({
    queryKey: statisticsKeys.aggregated(queryParams, 'period'),
    queryFn: () => statisticsApi.get(queryParams),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error: AxiosError) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  const stats = useMemo(() => {
    if (!isAuthenticated || !statisticsQuery.data) {
      return EMPTY_STATS;
    }

    return mapStatisticsToPeriodStatistics({
      data: statisticsQuery.data,
      categories,
      period,
      anchorDate,
      language: i18n.language,
    });
  }, [
    isAuthenticated,
    statisticsQuery.data,
    categories,
    period,
    anchorDate,
    i18n.language,
  ]);

  const isLoading =
    isAuthChecking ||
    (isAuthenticated &&
      (statisticsQuery.isLoading || isCategoriesLoading));

  return {
    stats,
    isLoading,
    isGuest,
    isError: statisticsQuery.isError,
    refetch: () => {
      void statisticsQuery.refetch();
    },
  };
};
