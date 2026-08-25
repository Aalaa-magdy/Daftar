import type { CategoryStat } from './statistics.types';

export type DailyCategoryStat = CategoryStat & {
  /** Only populated when the viewed day is today — see build-daily-report.ts. */
  balanceBefore?: number;
  balanceAfter?: number;
};

export type DailyReport = {
  dateLabel: string;
  isToday: boolean;
  totalSpent: number;
  topCategoryName: string | null;
  expenseCount: number;
  categories: DailyCategoryStat[];
};
