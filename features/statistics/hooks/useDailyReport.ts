import { useCategories } from '@/features/categories/hooks';
import { useBalanceSummary, useTransactionsHistory } from '@/features/transactions/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { buildDailyReport } from '../lib/build-daily-report';
import { formatPeriodLabel } from '../lib/format-period-label';
import { getDayRange } from '../lib/period-range';
import type { DailyReport } from '../types/daily-report.types';

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const EMPTY_REPORT: DailyReport = {
  dateLabel: '',
  isToday: true,
  totalSpent: 0,
  topCategoryName: null,
  expenseCount: 0,
  categories: [],
};

export const useDailyReport = (anchorDate: Date, enabled = true) => {
  const { t, i18n } = useTranslation();
  // Mirrors the History screen's convention (full ISO datetimes, not bare
  // YYYY-MM-DD) since /transactions/history is the proven date-range contract.
  const { startDate, endDate } = useMemo(() => {
    const { from, to } = getDayRange(anchorDate);
    return { startDate: from.toISOString(), endDate: to.toISOString() };
  }, [anchorDate]);
  const isToday = useMemo(
    () => isSameDay(anchorDate, new Date()),
    [anchorDate],
  );

  const history = useTransactionsHistory(
    {
      startDate,
      endDate,
      transactionType: 'expense',
    },
    { enabled },
  );

  const balance = useBalanceSummary({ enabled });
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();

  const report = useMemo(() => {
    if (!history.data) {
      return EMPTY_REPORT;
    }

    return buildDailyReport({
      transactions: history.data,
      categories,
      currentBalance: balance.data?.totalBalance,
      dateLabel: formatPeriodLabel(anchorDate, 'day', i18n.language),
      isToday,
      fallbackCategoryName: t('statistics.uncategorized'),
    });
  }, [
    history.data,
    categories,
    balance.data?.totalBalance,
    anchorDate,
    isToday,
    i18n.language,
    t,
  ]);

  const isLoading =
    history.isLoading || balance.isLoading || isCategoriesLoading;

  return {
    report,
    isLoading,
    isError: history.isError || balance.isError,
  };
};
