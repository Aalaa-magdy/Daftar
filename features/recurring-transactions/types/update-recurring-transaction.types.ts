import type { RecurringIncomeType } from './recurring-transaction.types';

export type UpdateRecurringTransactionRequest = {
  amount?: number;
  categoryId?: string;
  name?: string;
  notes?: string;
  incomeType?: RecurringIncomeType;
  dayOfMonth?: number;
  repeatCount?: number;
};

export type UpdateRecurringTransactionVariables = {
  id: string;
  data: UpdateRecurringTransactionRequest;
};

export type RecurringIncomeFormValues = {
  incomeType: string;
  amount: string;
  dayOfMonth: number;
  note: string;
  repeatCount: string;
  frequency: 'monthly' | 'one-time';
};

export type RecurringExpenseFormValues = {
  categoryId: string;
  name: string;
  amount: string;
  dayOfMonth: number;
  note: string;
  frequency: 'monthly' | 'one-time';
  repeatCount: string;
};
