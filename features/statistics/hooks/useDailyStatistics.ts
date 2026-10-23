import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { statisticsApi } from '../api/statistics.api';
import { buildStatisticsQueryParams } from '../lib/build-statistics-query';
import type { DailyStatisticsData } from '../types/statistics-response.types';
import { statisticsKeys } from './query-keys';

const EMPTY_DAILY_STATISTICS: DailyStatisticsData = {
  timeFrame: 'week',
  periodLabel: '',
  totalSpent: 0,
  totalIncome: 0,
  netBalance: 0,
  openingBalance: 0,
  closingBalance: 0,
  transactions: [],
};

export const useDailyStatistics = (anchorDate: Date, enabled = true) => {
  const { isAuthenticated, isAuthChecking } = useAuthenticatedSession();
  const queryParams = useMemo(
    () => buildStatisticsQueryParams('week', anchorDate),
    [anchorDate],
  );
  const dailyStatisticsQuery = useQuery({
    queryKey: statisticsKeys.aggregated(queryParams, 'period'),
    queryFn: () => statisticsApi.getDaily(queryParams),
    enabled: isAuthenticated && enabled,
    refetchOnMount: 'always',
    retry: (failureCount, error: AxiosError) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    data: dailyStatisticsQuery.data ?? EMPTY_DAILY_STATISTICS,
    isLoading:
      isAuthChecking || (isAuthenticated && enabled && dailyStatisticsQuery.isLoading),
    isError: dailyStatisticsQuery.isError,
    refetch: dailyStatisticsQuery.refetch,
  };
};
