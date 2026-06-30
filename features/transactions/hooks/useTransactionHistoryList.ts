import { applyCategoryFilter } from '@/features/history/lib/apply-category-filter';
import { buildHistoryQueryParams } from '@/features/history/lib/build-history-query';
import type { HistoryFilterState } from '@/features/history/types/history-filter';
import type { TransactionFilter } from '@/features/transaction/components/TransactionTypeToggle';
import { useCategories } from '@/features/categories/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { mapTransactionsToListItems } from '../lib/map-transaction-list-item';
import type { TransactionListItem } from '../types/transactions.types';
import { useTransactionsHistory } from './useTransactionsHistory';

type Options = {
  typeFilter: TransactionFilter;
  historyFilter: HistoryFilterState;
};

export const useTransactionHistoryList = ({
  typeFilter,
  historyFilter,
}: Options) => {
  const { t, i18n } = useTranslation();
  const params = useMemo(
    () => buildHistoryQueryParams(typeFilter, historyFilter),
    [typeFilter, historyFilter],
  );

  const {
    data: transactions = [],
    isLoading: isTransactionsLoading,
    isError,
    isAuthChecking,
    refetch,
  } = useTransactionsHistory(params);

  const { data: categories = [] } = useCategories();

  const items = useMemo(() => {
    const mapped = mapTransactionsToListItems(
      transactions,
      categories,
      t,
      i18n.language,
    );

    return applyCategoryFilter(mapped, historyFilter.categoryIds);
  }, [transactions, categories, t, i18n.language, historyFilter.categoryIds]);

  const isLoading = isAuthChecking || isTransactionsLoading;

  const hasActiveFilters =
    typeFilter !== 'all' ||
    historyFilter.preset != null ||
    historyFilter.fromDate != null ||
    historyFilter.toDate != null ||
    historyFilter.categoryIds.length > 0;

  return {
    items,
    isLoading,
    isError,
    isEmpty: !isLoading && !isError && items.length === 0,
    hasActiveFilters,
    refetch,
  };
};

export type { TransactionListItem };
