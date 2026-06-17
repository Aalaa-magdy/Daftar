import { apiClient } from '@/lib/axios';
import { normalizeBalanceSummary } from '../lib/normalize-balance-summary';
import { normalizeTransactionList } from '../lib/normalize-transaction';
import type { BalanceSummary } from '../types/balance-summary.types';
import type { HistoryQueryParams } from '../types/history-query.types';
import type { Transaction } from '../types/transactions.types';

function buildHistoryParams(params: HistoryQueryParams) {
  const query: Record<string, string> = {};

  if (params.transactionType) {
    query.transactionType = params.transactionType;
  }
  if (params.incomeType) {
    query.incomeType = params.incomeType;
  }
  if (params.preset) {
    query.preset = params.preset;
  }
  if (params.startDate) {
    query.startDate = params.startDate;
  }
  if (params.endDate) {
    query.endDate = params.endDate;
  }
  if (params.categoryId) {
    query.categoryId = params.categoryId;
  }

  return query;
}

export const transactionsApi = {
  /** Recent transactions for the home screen (no filters). */
  list: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<unknown>('/transactions');
    return normalizeTransactionList(response.data);
  },

  balanceSummary: async (): Promise<BalanceSummary> => {
    const response = await apiClient.get<unknown>(
      '/transactions/balances/summary',
    );
    return normalizeBalanceSummary(response.data);
  },

  /** Filtered history list — supports type, preset/custom dates, and category. */
  history: async (params: HistoryQueryParams = {}): Promise<Transaction[]> => {
    const response = await apiClient.get<unknown>('/transactions/history', {
      params: buildHistoryParams(params),
    });
    return normalizeTransactionList(response.data);
  },
};
