import { mapFormIncomeType } from '@/features/transactions/lib/transaction-form-mappers';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import type {
  RecurringExpenseFormValues,
  RecurringIncomeFormValues,
  UpdateRecurringTransactionRequest,
} from '../types/update-recurring-transaction.types';

const API_TO_FORM_INCOME_TYPE: Record<string, string> = {
  salary: 'salary',
  'part-time': 'partTime',
  freelance: 'freelance',
  bonus: 'bonus',
  other: 'other',
};

export const RECURRING_FREQUENCY_OPTIONS = ['monthly', 'one-time'] as const;

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

export function mapRecurringIncomeTypeToForm(
  value: string | undefined,
): string {
  if (!value) return '';
  return API_TO_FORM_INCOME_TYPE[value] ?? 'other';
}

export function mapRecurringTransactionToForm(
  transaction: RecurringTransaction,
): RecurringIncomeFormValues {
  return {
    incomeType: mapRecurringIncomeTypeToForm(transaction.incomeType),
    amount: String(transaction.amount),
    dayOfMonth: resolveDayOfMonth(transaction),
    note: transaction.notes ?? '',
    repeatCount:
      transaction.repeatCount != null ? String(transaction.repeatCount) : '',
    frequency: transaction.frequency,
  };
}

export function buildUpdateRecurringIncomePayload(
  form: RecurringIncomeFormValues,
): UpdateRecurringTransactionRequest {
  const amount = Number(form.amount);
  const notes = form.note.trim() || undefined;
  const dayOfMonth = Math.trunc(form.dayOfMonth);
  const repeatCount = parseRecurringRepeatCount(
    form.repeatCount,
    form.frequency,
  );

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

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
    repeatCount,
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
      transaction.repeatCount != null ? String(transaction.repeatCount) : '',
  };
}

export function buildUpdateRecurringExpensePayload(
  form: RecurringExpenseFormValues,
): UpdateRecurringTransactionRequest {
  const amount = Number(form.amount);
  const categoryId = form.categoryId.trim();
  const name = form.name.trim();
  const notes = form.note.trim() || undefined;
  const dayOfMonth = Math.trunc(form.dayOfMonth);
  const repeatCount = parseRecurringRepeatCount(
    form.repeatCount,
    form.frequency,
  );

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

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
    repeatCount,
  };
}

function parseRecurringRepeatCount(
  value: string,
  frequency: 'monthly' | 'one-time',
): number | undefined {
  if (frequency === 'one-time') return undefined;

  const repeatCount = Number(value);
  if (!Number.isInteger(repeatCount) || repeatCount < 1) {
    throw new Error('Monthly occurrence count must be a positive whole number');
  }

  return repeatCount;
}
