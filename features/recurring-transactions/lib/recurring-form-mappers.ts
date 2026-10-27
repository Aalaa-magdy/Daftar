import {
  mapApiIncomeTypeToForm,
  mapFormIncomeType,
} from '@/features/transactions/lib/transaction-form-mappers';
import {
  parsePositiveAmount,
  parseRepeatCount,
} from '@/features/transactions/lib/transaction-form-utils';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import type {
  RecurringExpenseFormValues,
  RecurringIncomeFormValues,
  UpdateRecurringTransactionRequest,
} from '../types/update-recurring-transaction.types';

export function readDayOfMonthFromDate(value: string): number {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 1;
  return parsed.getUTCDate();
}

export function resolveDayOfMonth(
  transaction: Pick<
    RecurringTransaction,
    'dayOfMonth' | 'startDate' | 'nextRunDate'
  >,
): number {
  if (
    transaction.dayOfMonth != null &&
    transaction.dayOfMonth >= 1 &&
    transaction.dayOfMonth <= 31
  ) {
    return transaction.dayOfMonth;
  }

  return readDayOfMonthFromDate(transaction.startDate || transaction.nextRunDate);
}

export function mapRecurringTransactionToForm(
  transaction: RecurringTransaction,
): RecurringIncomeFormValues {
  return {
    incomeType: mapApiIncomeTypeToForm(transaction.incomeType),
    amount: String(transaction.amount),
    dayOfMonth: resolveDayOfMonth(transaction),
    note: transaction.notes ?? '',
    repeatCount:
      transaction.repeatMonths != null ? String(transaction.repeatMonths) : '',
    frequency: transaction.frequency,
  };
}

export function buildUpdateRecurringIncomePayload(
  form: RecurringIncomeFormValues,
): UpdateRecurringTransactionRequest {
  const amount = parsePositiveAmount(form.amount);
  const notes = form.note.trim() || undefined;
  const dayOfMonth = Math.trunc(form.dayOfMonth);
  const repeatCount = parseRepeatCount(form.repeatCount, form.frequency);

  if (!form.incomeType) {
    throw new Error('Income type is required');
  }

  if (!Number.isFinite(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
    throw new Error('Day of month must be between 1 and 31');
  }

  return {
    amount,
    incomeType: mapFormIncomeType(form.incomeType),
    dayOfMonth,
    notes,
    repeatMonths: repeatCount,
  };
}

export function mapRecurringExpenseToForm(
  transaction: RecurringTransaction,
): RecurringExpenseFormValues {
  return {
    categoryId: transaction.categoryId ?? '',
    name: transaction.name ?? '',
    amount: String(transaction.amount),
    dayOfMonth: resolveDayOfMonth(transaction),
    note: transaction.notes ?? '',
    frequency: transaction.frequency,
    repeatCount:
      transaction.repeatMonths != null ? String(transaction.repeatMonths) : '',
  };
}

export function buildUpdateRecurringExpensePayload(
  form: RecurringExpenseFormValues,
): UpdateRecurringTransactionRequest {
  const amount = parsePositiveAmount(form.amount);
  const categoryId = form.categoryId.trim();
  const name = form.name.trim();
  const notes = form.note.trim() || undefined;
  const dayOfMonth = Math.trunc(form.dayOfMonth);
  const repeatCount = parseRepeatCount(form.repeatCount, form.frequency);

  if (!categoryId) {
    throw new Error('Category is required for expense transactions');
  }

  if (form.frequency === 'monthly' && !name) {
    throw new Error('Expense name is required for monthly expenses');
  }

  if (!Number.isFinite(dayOfMonth) || dayOfMonth < 1 || dayOfMonth > 31) {
    throw new Error('Day of month must be between 1 and 31');
  }

  return {
    amount,
    categoryId,
    name: name || undefined,
    dayOfMonth,
    notes,
    repeatMonths: repeatCount,
  };
}
