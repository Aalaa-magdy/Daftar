import type { Category } from '@/features/categories/types/categories.types';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';
import type { StatisticsData } from '../types/statistics-response.types';
import type {
  CategoryStat,
  PeriodStatistics,
  StatisticsPeriod,
  TrendPoint,
  TrendVariant,
} from '../types/statistics.types';
import { formatPeriodLabel } from './format-period-label';
import {
  getTrendPoints,
  getTrendSelectedIndex,
} from './trend-utils';
import { mapWeeklyDailyTrendPoints } from './weekly-trend';

function computeTrendMax(values: number[]) {
  const max = Math.max(...values, 0);
  if (max <= 0) return 1000;

  let rounded: number;
  if (max <= 8000) {
    rounded = Math.ceil(max / 1000) * 1000;
  } else if (max <= 12000) {
    rounded = Math.ceil(max / 2000) * 2000;
  } else if (max <= 50000) {
    rounded = Math.ceil(max / 10000) * 10000;
  } else {
    rounded = Math.ceil(max / 20000) * 20000;
  }

  return Math.max(rounded, max);
}

function resolveSelectedIndex(
  data: StatisticsData,
  period: StatisticsPeriod,
  anchorDate: Date,
  trendPoints: ReturnType<typeof getTrendPoints>,
): number {
  const selectedIndex = getTrendSelectedIndex(data.trend);
  if (selectedIndex != null) {
    return selectedIndex;
  }

  if (period === 'month') {
    return anchorDate.getMonth();
  }

  if (period === 'year') {
    const index = trendPoints.findIndex(
      (point) => Number(point.label) === anchorDate.getFullYear(),
    );
    return index >= 0 ? index : Math.max(trendPoints.length - 1, 0);
  }

  return 0;
}

function resolveTrendVariant(
  index: number,
  selectedIndex: number,
  spent: number,
  period: StatisticsPeriod,
): TrendVariant {
  if (index === selectedIndex) return 'active';

  if (index > selectedIndex) return 'placeholder';
  return spent > 0 ? 'past' : 'placeholder';
}

function mapTrendPoints(
  data: StatisticsData,
  period: StatisticsPeriod,
  anchorDate: Date,
  language: string,
): TrendPoint[] {
  const trendPoints = getTrendPoints(data.trend);

  if (period === 'week') {
    return mapWeeklyDailyTrendPoints(
      trendPoints,
      anchorDate,
      language,
      getTrendSelectedIndex(data.trend),
    );
  }

  const selectedIndex = resolveSelectedIndex(
    data,
    period,
    anchorDate,
    trendPoints,
  );

  return trendPoints.map((point, index) => ({
    label: point.label,
    tooltipTitle: point.label,
    value: point.spent,
    spent: point.spent,
    income: point.income,
    variant: resolveTrendVariant(
      index,
      selectedIndex,
      point.spent,
      period,
    ),
  }));
}

function resolveCategoryMeta(
  item: StatisticsData['categories'][number],
  categories: Category[],
) {
  const fromList = categories.find((entry) => entry.id === item.categoryId);

  return {
    name: item.name ?? fromList?.name ?? 'Expense',
    icon: resolveCategoryIcon(item.icon ?? fromList?.icon ?? ''),
    color: item.color ?? fromList?.color,
  };
}

function mapCategoryStats(
  data: StatisticsData,
  categories: Category[],
): CategoryStat[] {
  const totalSpent =
    data.totalSpent > 0
      ? data.totalSpent
      : data.categories.reduce((sum, item) => sum + item.amount, 0);

  if (totalSpent <= 0 || data.categories.length === 0) {
    return [];
  }

  return data.categories
    .map((item) => {
      const meta = resolveCategoryMeta(item, categories);
      const percentage =
        item.percentage ??
        Math.round((item.amount / totalSpent) * 1000) / 10;

      return {
        categoryId: item.categoryId,
        name: meta.name,
        amount: item.amount,
        percentage,
        icon: meta.icon,
        color: meta.color,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function mapStatisticsToPeriodStatistics({
  data,
  categories,
  period,
  anchorDate,
  language,
}: {
  data: StatisticsData;
  categories: Category[];
  period: StatisticsPeriod;
  anchorDate: Date;
  language: string;
}): PeriodStatistics {
  const dateLabel =
    period === 'week'
      ? formatPeriodLabel(anchorDate, period, language)
      : data.periodLabel ?? formatPeriodLabel(anchorDate, period, language);
  const trend = mapTrendPoints(data, period, anchorDate, language);
  const trendValues = trend.map((point) => point.value);

  return {
    dateLabel,
    totalSpent: data.totalSpent,
    totalIncome: data.totalIncome,
    periodTotalSpent: data.totalSpent,
    categories: mapCategoryStats(data, categories),
    titleKey:
      period === 'week'
        ? 'statistics.weeklyTrend'
        : period === 'month'
          ? 'statistics.monthlyTrend'
          : 'statistics.yearlyTrend',
    trendSubtitle: dateLabel,
    trendMax: computeTrendMax(trendValues),
    trend,
  };
}
