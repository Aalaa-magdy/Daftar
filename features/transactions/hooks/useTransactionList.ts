import { useCategories } from '@/features/categories/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mapTransactionsToListItems } from '../lib/map-transaction-list-item';
import { sortTransactionsByRecent } from '../lib/sort-transactions-by-recent';
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
    isAuthChecking,
    refetch,
  } = useTransactions();
  const { data: categories = [] } = useCategories();

  const items = useMemo(() => {
    let sorted = sortTransactionsByRecent(transactions);

    if (options?.limit != null) {
      sorted = sorted.slice(0, options.limit);
    }

    return mapTransactionsToListItems(
      sorted,
      categories,
      t,
      i18n.language,
    );
  }, [transactions, categories, t, i18n.language, options?.limit]);

  const isLoading = isAuthChecking || isTransactionsLoading;

  return {
    items,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && items.length === 0,
    refetch,
  };
};

export type { TransactionListItem };
