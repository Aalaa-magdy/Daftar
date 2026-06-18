import type {
  CreateTransactionRequest,
  TransactionFormPayload,
} from '../types/create-transaction.types';
import type { ApiIncomeType, ApiRepeatType } from '../types/transactions.types';
import { formatApiDate } from './format-api-date';

const FORM_TO_API_INCOME_TYPE: Record<string, ApiIncomeType> = {
  salary: 'salary',
  partTime: 'part-time',
  freelance: 'freelance',
  bonus: 'bonus',
  other: 'other',
};

function mapIncomeType(value: string): ApiIncomeType {
  return FORM_TO_API_INCOME_TYPE[value] ?? 'other';
}

function mapRepeat(value: string | undefined): ApiRepeatType {
  return value === 'oneTime' ? 'one-time' : 'monthly';
}

export function buildCreateTransactionPayload(
  form: TransactionFormPayload,
): CreateTransactionRequest {
  const amount = Number(form.amount);
  const notes = form.note?.trim() || undefined;
  const date = formatApiDate(form.date);

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
    incomeType: mapIncomeType(form.incomeType),
    payDate: date,
    repeat: mapRepeat(form.repeat),
    notes,
  };
}
