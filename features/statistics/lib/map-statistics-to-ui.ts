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
import { getPeriodRange } from './period-range';
import {
  getTrendPoints,
  getTrendSelectedIndex,
} from './trend-utils';
import type { ApiStatisticsTrendPoint } from '../types/statistics-response.types';

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

function resolveWeeklySelectedIndex(
  data: StatisticsData,
  anchorDate: Date,
  trendPoints: ApiStatisticsTrendPoint[],
): number {
  const apiIndex = getTrendSelectedIndex(data.trend);
  const maxIndex = Math.max(trendPoints.length - 1, 0);
  const clamp = (index: number) =>
    Math.min(Math.max(index, 0), maxIndex);

  if (apiIndex != null) {
    const apiSpent = trendPoints[apiIndex]?.spent ?? 0;
    if (apiSpent === data.totalSpent || data.totalSpent === 0) {
      return clamp(apiIndex);
    }
  }

  if (data.totalSpent > 0) {
    const matchIndex = trendPoints.findIndex(
      (point) => point.spent === data.totalSpent,
    );
    if (matchIndex >= 0) {
      return clamp(matchIndex);
    }
  }

  if (apiIndex != null) {
    return clamp(apiIndex);
  }

  const { to } = getPeriodRange(anchorDate, 'week');
  return clamp(Math.floor((to.getDate() - 1) / 7));
}

function resolveWeeklyTrendValue(
  index: number,
  selectedIndex: number,
  point: ApiStatisticsTrendPoint,
  totalSpent: number,
): number {
  if (index === selectedIndex) {
    return totalSpent > 0 ? totalSpent : point.spent;
  }

  if (totalSpent > 0 && point.spent === totalSpent) {
    return 0;
  }

  return point.spent;
}

function resolveSelectedIndex(
  data: StatisticsData,
  period: StatisticsPeriod,
  anchorDate: Date,
  trendPoints: ReturnType<typeof getTrendPoints>,
): number {
  if (period === 'week') {
    return resolveWeeklySelectedIndex(data, anchorDate, trendPoints);
  }

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

  // Weekly trend compares all weeks in the month; show bars whenever data exists.
  if (period === 'week') {
    return spent > 0 ? 'past' : 'placeholder';
  }

  if (index > selectedIndex) return 'placeholder';
  return spent > 0 ? 'past' : 'placeholder';
}

function mapTrendPoints(
  data: StatisticsData,
  period: StatisticsPeriod,
  anchorDate: Date,
): TrendPoint[] {
  const trendPoints = getTrendPoints(data.trend);
  const selectedIndex = resolveSelectedIndex(
    data,
    period,
    anchorDate,
    trendPoints,
  );

  return trendPoints.map((point, index) => {
    const isSelectedWeek =
      period === 'week' &&
      index === selectedIndex &&
      Boolean(data.periodLabel);

    const value =
      period === 'week'
        ? resolveWeeklyTrendValue(
            index,
            selectedIndex,
            point,
            data.totalSpent,
          )
        : point.spent;

    return {
      label: point.label,
      tooltipTitle: isSelectedWeek ? data.periodLabel : point.label,
      value,
      spent: point.spent,
      income: point.income,
      variant: resolveTrendVariant(
        index,
        selectedIndex,
        value,
        period,
      ),
    };
  });
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
    data.periodLabel ?? formatPeriodLabel(anchorDate, period, language);
  const trend = mapTrendPoints(data, period, anchorDate);
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
