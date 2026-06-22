import { apiClient } from '@/lib/axios';
import { normalizeRecurringTransactionList } from '../lib/normalize-recurring-transaction';
import type { RecurringTransaction } from '../types/recurring-transaction.types';

export const recurringTransactionsApi = {
  list: async (): Promise<RecurringTransaction[]> => {
    const response = await apiClient.get<unknown>('/recurring-transactions');
    return normalizeRecurringTransactionList(response.data);
  },
};
