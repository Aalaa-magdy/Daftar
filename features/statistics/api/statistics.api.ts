import { apiClient } from '@/lib/axios';
import { buildStatisticsRequestParams } from '../lib/build-statistics-query';
import { normalizeStatistics } from '../lib/normalize-statistics';
import type { StatisticsQueryParams } from '../types/statistics-query.types';
import type { StatisticsData } from '../types/statistics-response.types';

export const statisticsApi = {
  get: async (params: StatisticsQueryParams): Promise<StatisticsData> => {
    const response = await apiClient.get<unknown>('/statistics', {
      params: buildStatisticsRequestParams(params),
    });

    return normalizeStatistics(response.data);
  },
};
