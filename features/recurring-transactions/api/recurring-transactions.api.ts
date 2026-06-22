import { apiClient } from '@/lib/axios';
import {
  normalizeRecurringTransaction,
  normalizeRecurringTransactionList,
} from '../lib/normalize-recurring-transaction';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import type { UpdateRecurringTransactionRequest } from '../types/update-recurring-transaction.types';

export const recurringTransactionsApi = {
  list: async (): Promise<RecurringTransaction[]> => {
    const response = await apiClient.get<unknown>('/recurring-transactions');
    return normalizeRecurringTransactionList(response.data);
  },

  getById: async (id: string): Promise<RecurringTransaction> => {
    const response = await apiClient.get<unknown>(`/recurring-transactions/${id}`);
    const normalized = normalizeRecurringTransaction(response.data);

    if (!normalized) {
      throw new Error('Recurring transaction not found');
    }

    return normalized;
  },

  update: async (
    id: string,
    data: UpdateRecurringTransactionRequest,
  ): Promise<RecurringTransaction> => {
    const response = await apiClient.patch<unknown>(
      `/recurring-transactions/${id}`,
      data,
    );
    const normalized = normalizeRecurringTransaction(response.data);

    if (!normalized) {
      throw new Error('Invalid recurring transaction response');
    }

    return normalized;
  },

  deactivate: async (id: string): Promise<void> => {
    await apiClient.delete(`/recurring-transactions/${id}`);
  },
};
