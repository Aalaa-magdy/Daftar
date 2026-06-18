import type { Transaction } from '../types/transactions.types';

export function unwrapTransaction(data: unknown): Transaction {
  if (data && typeof data === 'object' && 'data' in data) {
    const nested = normalizeTransaction((data as { data: unknown }).data);
    if (nested) return nested;
  }

  const transaction = normalizeTransaction(data);
  if (!transaction) {
    throw new Error('Invalid transaction response');
  }

  return transaction;
}

export function normalizeTransaction(raw: unknown): Transaction | null {
  if (!raw || typeof raw !== 'object') return null;

  const record = raw as Record<string, unknown>;
  const id = record._id ?? record.id;

  if (id == null || id === '') return null;

  const transactionType =
    record.transactionType === 'income' ? 'income' : 'expense';

  return {
    id: String(id),
    userId: String(record.userId ?? ''),
    amount: Number(record.amount ?? 0),
    transactionType,
    date: String(record.date ?? record.createdAt ?? new Date().toISOString()),
    recurringId:
      record.recurringId != null ? String(record.recurringId) : null,
    notes: record.notes != null ? String(record.notes) : undefined,
    categoryId:
      record.categoryId != null ? String(record.categoryId) : undefined,
    incomeType:
      record.incomeType != null
        ? (String(record.incomeType) as Transaction['incomeType'])
        : undefined,
    repeat:
      record.repeat != null
        ? (String(record.repeat) as Transaction['repeat'])
        : undefined,
    createdAt:
      record.createdAt != null ? String(record.createdAt) : undefined,
    updatedAt:
      record.updatedAt != null ? String(record.updatedAt) : undefined,
  };
}

export function normalizeTransactionList(data: unknown): Transaction[] {
  const list = extractTransactionArray(data);
  const seen = new Set<string>();
  const normalized: Transaction[] = [];

  for (const item of list) {
    const transaction = normalizeTransaction(item);
    if (!transaction || seen.has(transaction.id)) continue;
    seen.add(transaction.id);
    normalized.push(transaction);
  }

  return normalized;
}

function extractTransactionArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    const nested = record.data ?? record.transactions ?? record.items;

    if (Array.isArray(nested)) return nested;
  }

  return [];
}
