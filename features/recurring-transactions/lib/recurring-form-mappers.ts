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

export const RECURRING_FREQUENCY_OPTIONS = [
  'monthly',
  'weekly',
  'yearly',
  'one-time',
] as const;

export function mapRecurringIncomeTypeToForm(
  value: string | undefined,
): string {
  if (!value) return '';
  return API_TO_FORM_INCOME_TYPE[value] ?? 'other';
}

export function mapRecurringTransactionToForm(
  transaction: RecurringTransaction,
): RecurringIncomeFormValues {
  const parsedDate = new Date(transaction.startDate || transaction.nextRunDate);

  return {
    incomeType: mapRecurringIncomeTypeToForm(transaction.incomeType),
    amount: String(transaction.amount),
    date: Number.isNaN(parsedDate.getTime()) ? null : parsedDate,
    frequency: transaction.frequency,
    note: transaction.notes ?? '',
  };
}

export function buildUpdateRecurringIncomePayload(
  form: RecurringIncomeFormValues,
): UpdateRecurringTransactionRequest {
  const amount = Number(form.amount);
  const notes = form.note.trim() || undefined;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  if (!form.incomeType) {
    throw new Error('Income type is required');
  }

  return {
    amount,
    incomeType: mapFormIncomeType(form.incomeType),
    frequency: form.frequency,
    notes,
    isActive: true,
  };
}
