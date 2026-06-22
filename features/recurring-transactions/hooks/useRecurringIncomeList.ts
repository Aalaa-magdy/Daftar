import { useTransactionAuth } from '@/features/transactions/hooks/useTransactionAuth';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { recurringTransactionsApi } from '../api/recurring-transactions.api';
import { mapRecurringIncomeListItems } from '../lib/map-recurring-income-list-item';
import type { RecurringIncomeListItem } from '../types/recurring-transaction.types';
import { recurringTransactionKeys } from './query-keys';

export const useRecurringIncomeList = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, isGuest, isAuthChecking } = useTransactionAuth();

  const query = useQuery({
    queryKey: recurringTransactionKeys.all,
    queryFn: () => recurringTransactionsApi.list(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error: AxiosError) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  const items = useMemo<RecurringIncomeListItem[]>(() => {
    if (!query.data) return [];

    return mapRecurringIncomeListItems(query.data, t, i18n.language);
  }, [query.data, t, i18n.language]);

  const isLoading = isAuthChecking || (isAuthenticated && query.isLoading);

  return {
    items,
    isLoading,
    isError: query.isError,
    isGuest,
    isEmpty: !isGuest && !isLoading && !query.isError && items.length === 0,
    refetch: query.refetch,
  };
};
