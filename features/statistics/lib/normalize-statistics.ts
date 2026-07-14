import type {
  ApiStatisticsCategory,
  ApiStatisticsTrendPoint,
  StatisticsData,
} from '../types/statistics-response.types';
import type { StatisticsTrend } from '../types/statistics-trend.types';
import { normalizeTrendShape } from './trend-utils';

export function normalizeStatistics(data: unknown): StatisticsData {
  const record = unwrapRecord(data);

  return {
    timeFrame: readOptionalString(record, ['timeFrame']) as
      | StatisticsData['timeFrame']
      | undefined,
    periodLabel: readOptionalString(record, ['periodLabel']),
    totalSpent: readNumber(record, ['totalSpent', 'totalExpense', 'total_spent']),
    totalIncome: readNumber(record, ['totalIncome', 'total_income']),
    netBalance: readOptionalNumber(record, ['netBalance', 'net_balance']),
    categories: normalizeCategories(record),
    trend: normalizeTrend(record),
  };
}

function unwrapRecord(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const record = data as Record<string, unknown>;
  const nested = record.data;

  if (nested && typeof nested === 'object') {
    return nested as Record<string, unknown>;
  }

  return record;
}

function readNumber(record: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = record[key];
    if (value != null && value !== '') {
      return Number(value);
    }
  }

  return 0;
}

function readOptionalNumber(
  record: Record<string, unknown>,
  keys: string[],
): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (value != null && value !== '') {
      return Number(value);
    }
  }

  return undefined;
}

function normalizeCategories(record: Record<string, unknown>) {
  const raw = firstArray(record, ['categories']);

  return raw
    .map(normalizeCategory)
    .filter((item): item is ApiStatisticsCategory => item != null);
}

function normalizeCategory(value: unknown): ApiStatisticsCategory | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  const categoryId = String(record.categoryId ?? record.id ?? '');

  if (!categoryId) return null;

  return {
    categoryId,
    name: readOptionalString(record, ['name']),
    color: readOptionalString(record, ['color']),
    icon: readOptionalString(record, ['icon']),
    amount: Number(record.amount ?? 0),
    percentage:
      record.percentage != null ? Number(record.percentage) : undefined,
  };
}

function normalizeTrend(record: Record<string, unknown>): StatisticsTrend {
  const trend = record.trend;

  if (Array.isArray(trend)) {
    return normalizeTrendShape(
      trend
        .map(normalizeTrendPoint)
        .filter((item): item is ApiStatisticsTrendPoint => item != null),
    );
  }

  if (trend && typeof trend === 'object') {
    const trendRecord = trend as Record<string, unknown>;
    const data = Array.isArray(trendRecord.data) ? trendRecord.data : [];

    return normalizeTrendShape({
      selectedIndex:
        trendRecord.selectedIndex != null
          ? Number(trendRecord.selectedIndex)
          : undefined,
      data: data
        .map(normalizeTrendPoint)
        .filter((item): item is ApiStatisticsTrendPoint => item != null),
    });
  }

  return normalizeTrendShape(null);
}

function normalizeTrendPoint(value: unknown): ApiStatisticsTrendPoint | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  const date = readOptionalString(record, ['date']);
  const label = readOptionalString(record, ['label']);

  return {
    label,
    date,
    spent: Number(record.spent ?? record.value ?? record.amount ?? 0),
    income: record.income != null ? Number(record.income) : 0,
  };
}

function firstArray(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function readOptionalString(
  record: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}
