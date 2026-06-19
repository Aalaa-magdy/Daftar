import type { HistoryQueryParams } from '@/features/transactions/types/history-query.types';

export const statisticsKeys = {
  all: ['statistics'] as const,
  period: (params: HistoryQueryParams, scope: 'period' | 'trend') =>
    ['statistics', scope, params] as const,
};
