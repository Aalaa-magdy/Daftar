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
    payDate: date,
    repeat: mapFormRepeat(form.repeat),
    notes,
  };
}
