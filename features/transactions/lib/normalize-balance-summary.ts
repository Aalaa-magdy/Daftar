import type { BalanceSummary } from '../types/balance-summary.types';

export function normalizeBalanceSummary(data: unknown): BalanceSummary {
  const record = unwrapRecord(data);

  return {
    totalIncome: Number(record.totalIncome ?? 0),
    totalExpense: Number(record.totalExpense ?? 0),
    totalBalance: Number(record.totalBalance ?? 0),
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
