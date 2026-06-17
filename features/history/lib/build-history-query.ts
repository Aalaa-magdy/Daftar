import type { HistoryQueryParams } from '@/features/transactions/types/history-query.types';
import type { TransactionFilter } from '@/features/transaction/components/TransactionTypeToggle';
import type { HistoryFilterState, TimeRangePreset } from '../types/history-filter';

const PRESET_TO_API: Record<TimeRangePreset, HistoryQueryParams['preset']> = {
  'this-week': 'this_week',
  'this-month': 'this_month',
  'last-month': 'last_month',
  'this-year': 'this_year',
};

export function buildHistoryQueryParams(
  typeFilter: TransactionFilter,
  historyFilter: HistoryFilterState,
): HistoryQueryParams {
  const params: HistoryQueryParams = {};

  if (typeFilter !== 'all') {
    params.transactionType = typeFilter;
  }

  if (historyFilter.preset) {
    params.preset = PRESET_TO_API[historyFilter.preset];
  } else {
    if (historyFilter.fromDate) {
      params.startDate = historyFilter.fromDate.toISOString();
    }
    if (historyFilter.toDate) {
      params.endDate = historyFilter.toDate.toISOString();
    }
  }

  if (historyFilter.categoryIds.length === 1) {
    params.categoryId = historyFilter.categoryIds[0];
  }

  return params;
}
