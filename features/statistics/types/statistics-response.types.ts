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
  label?: string;
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
