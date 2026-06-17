import type { HistoryQueryParams } from '../types/history-query.types';

export const transactionKeys = {
  all: ['transactions'] as const,
  history: (params: HistoryQueryParams) =>
    ['transactions', 'history', params] as const,
};
