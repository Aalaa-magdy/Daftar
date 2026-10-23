import type {
  CreateTransactionRequest,
  TransactionFormPayload,
} from '../types/create-transaction.types';
import { formatApiDate } from './format-api-date';
import { mapFormIncomeType, mapFormRepeat } from './transaction-form-mappers';

export function buildCreateTransactionPayload(
  form: TransactionFormPayload,
): CreateTransactionRequest {
  const amount = Number(form.amount);
  const notes = form.note?.trim() || undefined;
  const date = formatApiDate(form.date);
  const repeat = mapFormRepeat(form.repeat);
  const repeatCount = parseRepeatCount(form.repeatCount, repeat);

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
      repeat,
      frequency: repeat === 'monthly' ? 'monthly' : undefined,
      repeatCount,
      name: repeat === 'monthly' ? requireExpenseName(form.name) : undefined,
      notes: repeat === 'one-time' ? notes : undefined,
    };
  }

  if (!form.incomeType) {
    throw new Error('Income type is required for income transactions');
  }

  const incomeType = mapFormIncomeType(form.incomeType);
  const customIncomeType = form.customIncomeType?.trim() || undefined;

  if (incomeType === 'other' && !customIncomeType) {
    throw new Error('Please enter the income type');
  }

  return {
    amount,
    transactionType: 'income',
    incomeType,
    customIncomeType: incomeType === 'other' ? customIncomeType : undefined,
    date,
    payDate: date,
    repeat,
    frequency: repeat === 'monthly' ? 'monthly' : undefined,
    repeatCount,
    notes,
  };
}

function parseRepeatCount(
  value: string | undefined,
  repeat: 'monthly' | 'one-time',
): number | undefined {
  if (repeat === 'one-time') return undefined;

  const count = Number(value);
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Monthly occurrence count must be a positive whole number');
  }

  return count;
}

function requireExpenseName(value: string | undefined): string {
  const name = value?.trim();
  if (!name) {
    throw new Error('Expense name is required for monthly expenses');
  }

  return name;
}
