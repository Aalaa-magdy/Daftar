import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { transactionsApi } from '../api/transactions.api';
import type { Transaction } from '../types/transactions.types';
import { transactionKeys } from './query-keys';

function findTransactionInCache(
  queryClient: QueryClient,
  id: string,
): Transaction | undefined {
  const fromList = queryClient.getQueryData<Transaction[]>(transactionKeys.all);
  const fromRecent = fromList?.find((item) => item.id === id);
  if (fromRecent) return fromRecent;

  const historyQueries = queryClient.getQueriesData<Transaction[]>({
    queryKey: ['transactions', 'history'],
  });

  for (const [, data] of historyQueries) {
    const match = data?.find((item) => item.id === id);
    if (match) return match;
  }

  return undefined;
}

async function resolveTransaction(
  id: string,
  queryClient: QueryClient,
): Promise<Transaction> {
  const fromCache = findTransactionInCache(queryClient, id);
  if (fromCache) return fromCache;

  const list = await transactionsApi.list();
  const fromList = list.find((item) => item.id === id);
  if (fromList) return fromList;

  const history = await transactionsApi.history();
  const fromHistory = history.find((item) => item.id === id);

  if (!fromHistory) {
    throw new Error('Transaction not found');
  }

  return fromHistory;
}

export const useTransaction = (id: string | null) => {
  const queryClient = useQueryClient();
  const { isAuthenticated, isAuthChecking } = useAuthenticatedSession();

  const query = useQuery<Transaction, AxiosError>({
    queryKey: transactionKeys.detail(id ?? ''),
    queryFn: () => resolveTransaction(id!, queryClient),
    enabled: Boolean(id) && isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    ...query,
    isAuthChecking,
    isLoading: isAuthChecking || (isAuthenticated && query.isLoading),
  };
};
