import type { HistoryQueryParams } from '../types/history-query.types';

export const transactionKeys = {
  all: ['transactions'] as const,
  balanceSummary: ['transactions', 'balance-summary'] as const,
  detail: (id: string) => ['transactions', 'detail', id] as const,
  history: (params: HistoryQueryParams) =>
    ['transactions', 'history', params] as const,
};
