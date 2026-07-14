import type { StatisticsTimeFrame } from './statistics-query.types';
import type { StatisticsTrend } from './statistics-trend.types';

export type ApiStatisticsCategory = {
  categoryId: string;
  name?: string;
  color?: string;
  icon?: string;
  amount: number;
  percentage?: number;
};

export type ApiStatisticsTrendPoint = {
  /** Day name from API (e.g. "Tue") — display is handled client-side. */
  label?: string;
  /** ISO date for weekly columns (e.g. "2026-06-02"). */
  date?: string;
  spent: number;
  income?: number;
};

/** Normalized statistics payload from GET /statistics. */
export type StatisticsData = {
  timeFrame?: StatisticsTimeFrame;
  periodLabel?: string;
  totalSpent: number;
  totalIncome: number;
  netBalance?: number;
  categories: ApiStatisticsCategory[];
  trend: StatisticsTrend;
};
