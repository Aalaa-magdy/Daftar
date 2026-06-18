import type { Category } from '@/features/categories/types/categories.types';
import { getCategoryBackgroundColor } from '@/features/categories/lib/category-colors';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';
import type { Transaction } from '@/features/transactions/types/transactions.types';
import type {
  CategoryStat,
  PeriodStatistics,
  StatisticsPeriod,
  TrendPoint,
} from '../types/statistics.types';
import { formatPeriodLabel } from './format-period-label';
import { getMonthRange, getWeekRange, getYearRange } from './period-range';

const MONTH_LABEL_KEYS = [
  'statistics.months.jan',
  'statistics.months.feb',
  'statistics.months.mar',
  'statistics.months.apr',
  'statistics.months.may',
  'statistics.months.jun',
  'statistics.months.jul',
  'statistics.months.aug',
  'statistics.months.sep',
  'statistics.months.oct',
  'statistics.months.nov',
  'statistics.months.dec',
] as const;

function isWithinRange(date: Date, from: Date, to: Date) {
  return date >= from && date <= to;
}

function sumByType(transactions: Transaction[], type: 'expense' | 'income') {
  return transactions
    .filter((item) => item.transactionType === type)
    .reduce((total, item) => total + item.amount, 0);
}

function resolveCategoryMeta(categoryId: string, categories: Category[]) {
  const category = categories.find((entry) => entry.id === categoryId);
  if (!category) return null;

  return {
    name: category.name,
    icon: resolveCategoryIcon(category.icon),
    color: category.color,
    backgroundColor: getCategoryBackgroundColor(category.color),
  };
}

export function computeCategoryStats(
  transactions: Transaction[],
  categories: Category[],
): CategoryStat[] {
  const expenses = transactions.filter(
    (item) => item.transactionType === 'expense' && item.categoryId,
  );
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  if (totalSpent <= 0) return [];

  const totals = new Map<string, number>();

  for (const expense of expenses) {
    const categoryId = expense.categoryId!;
    totals.set(categoryId, (totals.get(categoryId) ?? 0) + expense.amount);
  }

  return Array.from(totals.entries())
    .map(([categoryId, amount]) => {
      const meta = resolveCategoryMeta(categoryId, categories);
      const expense = expenses.find((item) => item.categoryId === categoryId);

      return {
        categoryId,
        name: meta?.name ?? expenseFallbackName(expense),
        amount,
        percentage: Math.round((amount / totalSpent) * 1000) / 10,
        icon: meta?.icon,
        color: meta?.color,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

function expenseFallbackName(expense?: Transaction) {
  return expense?.notes?.trim() || 'Expense';
}

function computeTrendMax(values: number[]) {
  const max = Math.max(...values, 0);
  if (max <= 0) return 1000;
  if (max <= 8000) return Math.ceil(max / 1000) * 1000;
  if (max <= 12000) return Math.ceil(max / 2000) * 2000;
  if (max <= 50000) return Math.ceil(max / 10000) * 10000;
  return Math.ceil(max / 20000) * 20000;
}

function buildWeeklyTrend(
  transactions: Transaction[],
  anchor: Date,
): TrendPoint[] {
  const { from: monthStart, to: monthEnd } = getMonthRange(anchor);
  const monthExpenses = transactions.filter((item) => {
    if (item.transactionType !== 'expense') return false;
    const date = new Date(item.date);
    return isWithinRange(date, monthStart, monthEnd);
  });

  const weeks: TrendPoint[] = [];

  for (let index = 0; index < 4; index += 1) {
    const weekStart = new Date(monthStart);
    weekStart.setDate(monthStart.getDate() + index * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const value = monthExpenses
      .filter((item) => {
        const date = new Date(item.date);
        return isWithinRange(date, weekStart, weekEnd);
      })
      .reduce((sum, item) => sum + item.amount, 0);

    const { from: activeFrom, to: activeTo } = getWeekRange(anchor);
    const isActive = weekStart <= activeTo && weekEnd >= activeFrom;

    weeks.push({
      labelKey: 'statistics.weekLabel',
      labelParams: { number: index + 1 },
      value,
      variant: isActive ? 'active' : value > 0 ? 'past' : 'placeholder',
    });
  }

  return weeks;
}

function buildMonthlyTrend(
  transactions: Transaction[],
  anchor: Date,
): TrendPoint[] {
  const year = anchor.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

  const yearExpenses = transactions.filter((item) => {
    if (item.transactionType !== 'expense') return false;
    const date = new Date(item.date);
    return isWithinRange(date, yearStart, yearEnd);
  });

  return MONTH_LABEL_KEYS.map((labelKey, monthIndex) => {
    const value = yearExpenses
      .filter((item) => new Date(item.date).getMonth() === monthIndex)
      .reduce((sum, item) => sum + item.amount, 0);

    const isActive = anchor.getMonth() === monthIndex;
    const isFuture = monthIndex > anchor.getMonth();

    return {
      labelKey,
      value,
      variant: isActive ? 'active' : isFuture ? 'placeholder' : value > 0 ? 'past' : 'placeholder',
    };
  });
}

function buildYearlyTrend(
  transactions: Transaction[],
  anchor: Date,
): TrendPoint[] {
  const year = anchor.getFullYear();
  const { from, to } = getYearRange(anchor);

  const value = transactions
    .filter((item) => {
      if (item.transactionType !== 'expense') return false;
      const date = new Date(item.date);
      return isWithinRange(date, from, to);
    })
    .reduce((sum, item) => sum + item.amount, 0);

  const points: TrendPoint[] = [
    {
      label: String(year),
      value,
      variant: 'active',
    },
  ];

  for (let offset = 1; offset <= 4; offset += 1) {
    points.push({
      label: String(year + offset),
      value: 0,
      variant: 'placeholder',
    });
  }

  return points;
}

export function computePeriodStatistics(
  periodTransactions: Transaction[],
  trendTransactions: Transaction[],
  categories: Category[],
  period: StatisticsPeriod,
  anchor: Date,
  language: string,
): PeriodStatistics {
  const dateLabel = formatPeriodLabel(anchor, period, language);
  const totalSpent = sumByType(periodTransactions, 'expense');
  const totalIncome = sumByType(periodTransactions, 'income');
  const categoryStats = computeCategoryStats(periodTransactions, categories);

  const trend =
    period === 'week'
      ? buildWeeklyTrend(trendTransactions, anchor)
      : period === 'month'
        ? buildMonthlyTrend(trendTransactions, anchor)
        : buildYearlyTrend(trendTransactions, anchor);

  const trendValues = trend.map((point) => point.value);

  return {
    dateLabel,
    totalSpent,
    totalIncome,
    categories: categoryStats,
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
