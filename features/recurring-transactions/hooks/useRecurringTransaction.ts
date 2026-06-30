import { useTransactionAuth } from '@/features/transactions/hooks/useTransactionAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { recurringTransactionsApi } from '../api/recurring-transactions.api';
import { mergeRecurringTransactionUpdate } from '../lib/merge-recurring-transaction-update';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import { recurringTransactionKeys } from './query-keys';

export const useRecurringTransaction = (id: string | null) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useTransactionAuth();

  return useQuery({
    queryKey: id ? recurringTransactionKeys.detail(id) : ['recurring-transactions', 'detail', 'none'],
    queryFn: async () => {
      const fresh = await recurringTransactionsApi.getById(id!);
      const cached = queryClient.getQueryData<RecurringTransaction>(
        recurringTransactionKeys.detail(id!),
      );

      return mergeRecurringTransactionUpdate(cached, fresh);
    },
    enabled: Boolean(id) && isAuthenticated,
    retry: (failureCount, error: AxiosError) =>
      error.response?.status !== 401 && failureCount < 1,
  });
};
