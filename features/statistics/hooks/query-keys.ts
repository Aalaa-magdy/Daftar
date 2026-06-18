import type { HistoryQueryParams } from '@/features/transactions/types/history-query.types';

export const statisticsKeys = {
  period: (params: HistoryQueryParams, scope: 'period' | 'trend') =>
    ['statistics', scope, params] as const,
};
