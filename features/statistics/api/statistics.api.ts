import { apiClient } from '@/lib/axios';
import { buildStatisticsRequestParams } from '../lib/build-statistics-query';
import { normalizeStatistics } from '../lib/normalize-statistics';
import type { StatisticsQueryParams } from '../types/statistics-query.types';
import type {
  DailyStatisticsData,
  StatisticsData,
} from '../types/statistics-response.types';

export const statisticsApi = {
  getDaily: async (
    params: StatisticsQueryParams,
  ): Promise<DailyStatisticsData> => {
    const response = await apiClient.get<DailyStatisticsData>('/statistics', {
      params: buildStatisticsRequestParams(params),
    });

    return response.data;
  },
  get: async (params: StatisticsQueryParams): Promise<StatisticsData> => {
    const response = await apiClient.get<unknown>('/statistics', {
      params: buildStatisticsRequestParams(params),
    });

    return normalizeStatistics(response.data);
  },
};
