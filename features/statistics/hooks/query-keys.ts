import type { StatisticsQueryParams } from '../types/statistics-query.types';

export const statisticsKeys = {
  all: ['statistics'] as const,
  aggregated: (params: StatisticsQueryParams, scope: 'period' | 'trend') =>
    ['statistics', scope, params] as const,
};
