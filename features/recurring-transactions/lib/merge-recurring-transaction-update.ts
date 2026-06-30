import type { RecurringTransaction } from '../types/recurring-transaction.types';
import type { UpdateRecurringTransactionRequest } from '../types/update-recurring-transaction.types';
import { resolveDayOfMonth } from './recurring-form-mappers';

function readValidDayOfMonth(value: unknown): number | undefined {
  if (typeof value === 'number' && value >= 1 && value <= 31) {
    return Math.trunc(value);
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 31) {
      return Math.trunc(parsed);
    }
  }

  return undefined;
}

export function mergeRecurringTransactionUpdate(
  existing: RecurringTransaction | undefined,
  response: RecurringTransaction,
  patch: UpdateRecurringTransactionRequest = {},
): RecurringTransaction {
  const dayOfMonth =
    readValidDayOfMonth(response.dayOfMonth) ??
    readValidDayOfMonth(patch.dayOfMonth) ??
    readValidDayOfMonth(existing?.dayOfMonth) ??
    resolveDayOfMonth(response);

  return {
    ...(existing ?? response),
    ...response,
    amount: patch.amount ?? response.amount ?? existing?.amount ?? 0,
    incomeType: patch.incomeType ?? response.incomeType ?? existing?.incomeType,
    notes:
      patch.notes !== undefined
        ? patch.notes
        : response.notes ?? existing?.notes,
    dayOfMonth,
  };
}

export function mergeRecurringTransactionListWithCache(
  freshItems: RecurringTransaction[],
  cachedItems: RecurringTransaction[] | undefined,
): RecurringTransaction[] {
  if (!cachedItems?.length) return freshItems;

  const cachedById = new Map(cachedItems.map((item) => [item.id, item]));

  return freshItems.map((freshItem) => {
    const cachedItem = cachedById.get(freshItem.id);
    if (!cachedItem) return freshItem;

    return mergeRecurringTransactionUpdate(cachedItem, freshItem);
  });
}
