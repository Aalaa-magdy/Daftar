import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { transactionsApi } from '../api/transactions.api';
import type { BalanceSummary } from '../types/balance-summary.types';
import { transactionKeys } from './query-keys';
import { useTransactionAuth } from './useTransactionAuth';

export const useBalanceSummary = () => {
  const { isAuthenticated, isAuthChecking } = useTransactionAuth();

  const query = useQuery<BalanceSummary, AxiosError>({
    queryKey: transactionKeys.balanceSummary,
    queryFn: () => transactionsApi.balanceSummary(),
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
