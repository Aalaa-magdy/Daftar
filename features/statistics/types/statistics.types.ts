import type { IconSvgElement } from '@hugeicons/react-native';

export type StatisticsPeriod = 'week' | 'month' | 'year';

export type TrendVariant = 'past' | 'active' | 'placeholder';

export type TrendPoint = {
  label?: string;
  labelKey?: string;
  labelParams?: Record<string, string | number>;
  value: number;
  income?: number;
  variant: TrendVariant;
};

export type CategoryStat = {
  categoryId: string;
  name: string;
  amount: number;
  percentage: number;
  icon?: IconSvgElement;
  color?: string;
};

export type PeriodStatistics = {
  dateLabel: string;
  totalSpent: number;
  totalIncome: number;
  periodTotalSpent: number;
  categories: CategoryStat[];
  titleKey: string;
  trendSubtitle: string;
  trendMax: number;
  trend: TrendPoint[];
};
