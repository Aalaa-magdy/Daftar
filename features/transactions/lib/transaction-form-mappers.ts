import type { TransactionFormPayload } from '../types/create-transaction.types';
import type { UpdateTransactionRequest } from '../types/update-transaction.types';
import type { ApiIncomeType, ApiRepeatType, Transaction } from '../types/transactions.types';
import { formatApiDate } from './format-api-date';

const FORM_TO_API_INCOME_TYPE: Record<string, ApiIncomeType> = {
  salary: 'salary',
  partTime: 'part-time',
  freelance: 'freelance',
  bonus: 'bonus',
  other: 'other',
};

const API_TO_FORM_INCOME_TYPE: Record<ApiIncomeType, string> = {
  salary: 'salary',
  'part-time': 'partTime',
  freelance: 'freelance',
  bonus: 'bonus',
  other: 'other',
};

export function mapFormIncomeType(value: string): ApiIncomeType {
  return FORM_TO_API_INCOME_TYPE[value] ?? 'other';
}

export function mapApiIncomeTypeToForm(
  value: ApiIncomeType | undefined,
): string {
  if (!value) return '';
  return API_TO_FORM_INCOME_TYPE[value] ?? 'other';
}

export function mapFormRepeat(value: string | undefined): ApiRepeatType {
  return value === 'oneTime' ? 'one-time' : 'monthly';
}

export function mapApiRepeatToForm(value: ApiRepeatType | undefined): string {
  return value === 'one-time' ? 'oneTime' : 'monthly';
}

export function mapTransactionToForm(
  transaction: Transaction,
): Omit<TransactionFormPayload, 'date'> & { date: Date } {
  return {
    kind: transaction.transactionType,
    amount: String(transaction.amount),
    categoryId: transaction.categoryId ?? null,
    incomeType: mapApiIncomeTypeToForm(transaction.incomeType),
    date: new Date(transaction.date),
    repeat: mapApiRepeatToForm(transaction.repeat),
    note: transaction.notes ?? '',
  };
}

export function buildUpdateTransactionPayload(
  form: TransactionFormPayload,
): UpdateTransactionRequest {
  const amount = Number(form.amount);
  const notes = form.note?.trim() || undefined;
  const date = formatApiDate(form.date);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  if (form.kind === 'expense') {
    if (!form.categoryId) {
      throw new Error('Category is required for expense transactions');
    }

    return {
      amount,
      transactionType: 'expense',
      categoryId: form.categoryId,
      date,
      notes,
    };
  }

  if (!form.incomeType) {
    throw new Error('Income type is required for income transactions');
  }

  return {
    amount,
    transactionType: 'income',
    incomeType: mapFormIncomeType(form.incomeType),
    date,
    payDate: date,
    repeat: mapFormRepeat(form.repeat),
    notes,
  };
}
