import type { HistoryTransaction } from '../data/mock-transactions';
import type { HistoryFilterState } from '../types/history-filter';
import type { TransactionFilter } from '@/features/transaction/components/TransactionTypeToggle';
import { endOfDay, getActiveDateRange, startOfDay } from './date-ranges';

export function applyHistoryFilter(
  transactions: HistoryTransaction[],
  typeFilter: TransactionFilter,
  historyFilter: HistoryFilterState,
): HistoryTransaction[] {
  let result = transactions;

  if (typeFilter !== 'all') {
    result = result.filter((item) => item.type === typeFilter);
  }

  const { from, to } = getActiveDateRange(
    historyFilter.preset,
    historyFilter.fromDate,
    historyFilter.toDate,
  );

  if (from || to) {
    result = result.filter((item) => {
      const date = startOfDay(item.date);
      if (from && date < startOfDay(from)) return false;
      if (to && date > endOfDay(to)) return false;
      return true;
    });
  }

  if (historyFilter.categoryIds.length > 0) {
    result = result.filter(
      (item) =>
        item.type === 'expense' &&
        item.categoryId != null &&
        historyFilter.categoryIds.includes(item.categoryId),
    );
  }

  return result;
}
