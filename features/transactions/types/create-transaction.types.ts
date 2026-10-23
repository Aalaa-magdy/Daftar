import type {
  ApiFrequency,
  ApiIncomeType,
  ApiRepeatType,
} from './transactions.types';

export type CreateExpenseTransactionRequest = {
  amount: number;
  transactionType: 'expense';
  categoryId: string;
  date: string;
  repeat: ApiRepeatType;
  frequency?: ApiFrequency;
  repeatCount?: number;
  name?: string;
  notes?: string;
};

export type CreateIncomeTransactionRequest = {
  amount: number;
  transactionType: 'income';
  incomeType: ApiIncomeType;
  /** Required when incomeType is 'other' — the user-entered label. */
  customIncomeType?: string;
  /** Some backends persist income on `date` while accepting `payDate` on create. */
  date: string;
  payDate: string;
  repeat: ApiRepeatType;
  frequency?: ApiFrequency;
  repeatCount?: number;
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
  /** Required when incomeType is 'other' — the user-entered label. */
  customIncomeType?: string;
  date: Date;
  repeat?: string;
  repeatCount?: string;
  name?: string;
  note?: string;
};
