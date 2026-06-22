import type {
  RecurringFrequency,
  RecurringIncomeType,
  RecurringTransaction,
  RecurringTransactionType,
} from '../types/recurring-transaction.types';

function pickList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== 'object') return [];

  const record = raw as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.items)) return record.items;

  return [];
}

function readIncomeType(value: unknown): RecurringIncomeType | undefined {
  if (typeof value !== 'string') return undefined;

  const normalized = value.trim().toLowerCase().replace('_', '-');
  if (
    normalized === 'salary' ||
    normalized === 'part-time' ||
    normalized === 'freelance' ||
    normalized === 'bonus' ||
    normalized === 'other'
  ) {
    return normalized;
  }

  return undefined;
}

function readFrequency(value: unknown): RecurringFrequency {
  if (value === 'weekly' || value === 'yearly' || value === 'one-time') {
    return value;
  }

  return 'monthly';
}

function readType(value: unknown): RecurringTransactionType {
  return value === 'expense' ? 'expense' : 'income';
}

export function normalizeRecurringTransaction(raw: unknown): RecurringTransaction | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const id = record._id ?? record.id;
  const userId = record.userId;

  if (id == null || userId == null) return null;

  return {
    id: String(id),
    userId: String(userId),
    amount: Number(record.amount ?? 0),
    type: readType(record.type),
    frequency: readFrequency(record.frequency),
    startDate: String(record.startDate ?? ''),
    nextRunDate: String(record.nextRunDate ?? ''),
    lastGeneratedAt:
      record.lastGeneratedAt != null ? String(record.lastGeneratedAt) : undefined,
    isActive: record.isActive !== false,
    notes: typeof record.notes === 'string' ? record.notes.trim() : undefined,
    incomeType: readIncomeType(record.incomeType),
    createdAt: record.createdAt != null ? String(record.createdAt) : undefined,
    updatedAt: record.updatedAt != null ? String(record.updatedAt) : undefined,
  };
}

export function normalizeRecurringTransactionList(raw: unknown): RecurringTransaction[] {
  return pickList(raw)
    .map(normalizeRecurringTransaction)
    .filter((item): item is RecurringTransaction => item != null);
}
