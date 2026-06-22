import { useTransactionAuth } from '@/features/transactions/hooks/useTransactionAuth';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { recurringTransactionsApi } from '../api/recurring-transactions.api';
import { recurringTransactionKeys } from './query-keys';

export const useRecurringTransaction = (id: string | null) => {
  const { isAuthenticated } = useTransactionAuth();

  return useQuery({
    queryKey: id ? recurringTransactionKeys.detail(id) : ['recurring-transactions', 'detail', 'none'],
    queryFn: () => recurringTransactionsApi.getById(id!),
    enabled: Boolean(id) && isAuthenticated,
    retry: (failureCount, error: AxiosError) =>
      error.response?.status !== 401 && failureCount < 1,
  });
};
