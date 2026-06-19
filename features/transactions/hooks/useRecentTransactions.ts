import { useCategories } from '@/features/categories/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mapTransactionsToListItems } from '../lib/map-transaction-list-item';
import { sortTransactionsByRecent } from '../lib/sort-transactions-by-recent';
import type { TransactionListItem } from '../types/transactions.types';
import { useTransactions } from './useTransactions';

export const RECENT_TRANSACTIONS_LIMIT = 5;

export const useRecentTransactions = () => {
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
    const recent = sortTransactionsByRecent(transactions).slice(
      0,
      RECENT_TRANSACTIONS_LIMIT,
    );

    return mapTransactionsToListItems(
      recent,
      categories,
      t,
      i18n.language,
    );
  }, [transactions, categories, t, i18n.language]);

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
