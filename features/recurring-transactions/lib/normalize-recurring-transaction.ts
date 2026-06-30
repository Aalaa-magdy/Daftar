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
  return value === 'one-time' ? 'one-time' : 'monthly';
}

function readType(value: unknown): RecurringTransactionType {
  return value === 'expense' ? 'expense' : 'income';
}

function readDayOfMonth(record: Record<string, unknown>): number | undefined {
  const raw = record.dayOfMonth;

  if (typeof raw === 'number' && raw >= 1 && raw <= 31) {
    return Math.trunc(raw);
  }

  if (typeof raw === 'string') {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 31) {
      return Math.trunc(parsed);
    }
  }

  return undefined;
}

export function normalizeRecurringTransaction(raw: unknown): RecurringTransaction | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const id = record._id ?? record.id;
  const userId = record.userId;

  if (id == null || userId == null) return null;

  const startDate = String(record.startDate ?? '');
  const nextRunDate = String(record.nextRunDate ?? '');

  return {
    id: String(id),
    userId: String(userId),
    amount: Number(record.amount ?? 0),
    type: readType(record.type),
    frequency: readFrequency(record.frequency),
    startDate,
    nextRunDate,
    dayOfMonth: readDayOfMonth(record),
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
