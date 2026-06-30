import { mapFormIncomeType } from '@/features/transactions/lib/transaction-form-mappers';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import type {
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
  };
}

export function buildUpdateRecurringIncomePayload(
  form: RecurringIncomeFormValues,
): UpdateRecurringTransactionRequest {
  const amount = Number(form.amount);
  const notes = form.note.trim() || undefined;
  const dayOfMonth = Math.trunc(form.dayOfMonth);

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
  };
}
