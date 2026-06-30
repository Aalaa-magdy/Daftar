import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { transactionsApi } from '../api/transactions.api';
import type { HistoryQueryParams } from '../types/history-query.types';
import type { Transaction } from '../types/transactions.types';
import { transactionKeys } from './query-keys';
import { useTransactionAuth } from './useTransactionAuth';

export const useTransactionsHistory = (params: HistoryQueryParams) => {
  const { isAuthenticated, isAuthChecking } = useTransactionAuth();

  const query = useQuery<Transaction[], AxiosError>({
    queryKey: transactionKeys.history(params),
    queryFn: () => transactionsApi.history(params),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    ...query,
    data: isAuthenticated ? query.data : undefined,
    isAuthChecking,
    isLoading:
      isAuthChecking || (isAuthenticated && query.isLoading),
  };
};
