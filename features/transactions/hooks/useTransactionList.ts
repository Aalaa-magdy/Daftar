import { useCategories } from '@/features/categories/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mapTransactionsToListItems } from '../lib/map-transaction-list-item';
import type { TransactionListItem } from '../types/transactions.types';
import { useTransactions } from './useTransactions';

type Options = {
  limit?: number;
};

export const useTransactionList = (options?: Options) => {
  const { t, i18n } = useTranslation();
  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    isError,
    isGuest,
    isAuthChecking,
    refetch,
  } = useTransactions();
  const { data: categories = [] } = useCategories();

  const items = useMemo(() => {
    const mapped = mapTransactionsToListItems(
      transactions,
      categories,
      t,
      i18n.language,
    );

    if (options?.limit != null) {
      return mapped.slice(0, options.limit);
    }

    return mapped;
  }, [transactions, categories, t, i18n.language, options?.limit]);

  const isLoading = isAuthChecking || isTransactionsLoading;

  return {
    items,
    isLoading,
    isError,
    isGuest,
    isEmpty: !isGuest && !isLoading && !isError && items.length === 0,
    refetch,
  };
};

export type { TransactionListItem };
