import type { ApiIncomeType, ApiRepeatType } from './transactions.types';

export type CreateExpenseTransactionRequest = {
  amount: number;
  transactionType: 'expense';
  categoryId: string;
  date: string;
  notes?: string;
};

export type CreateIncomeTransactionRequest = {
  amount: number;
  transactionType: 'income';
  incomeType: ApiIncomeType;
  /** Some backends persist income on `date` while accepting `payDate` on create. */
  date: string;
  payDate: string;
  repeat: ApiRepeatType;
  notes?: string;
};

export type CreateTransactionRequest =
  | CreateExpenseTransactionRequest
  | CreateIncomeTransactionRequest;

export type TransactionFormPayload = {
  kind: 'expense' | 'income';
  amount: string;
  categoryId?: string | null;
  incomeType?: string;
  date: Date;
  repeat?: string;
  note?: string;
};
