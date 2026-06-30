import type { RecurringIncomeType } from './recurring-transaction.types';

export type UpdateRecurringTransactionRequest = {
  amount?: number;
  categoryId?: string;
  notes?: string;
  incomeType?: RecurringIncomeType;
  dayOfMonth?: number;
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
};
