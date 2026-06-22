import type {
  RecurringFrequency,
  RecurringIncomeType,
} from './recurring-transaction.types';

export type UpdateRecurringTransactionRequest = {
  amount?: number;
  categoryId?: string;
  notes?: string;
  frequency?: RecurringFrequency;
  isActive?: boolean;
  incomeType?: RecurringIncomeType;
};

export type UpdateRecurringTransactionVariables = {
  id: string;
  data: UpdateRecurringTransactionRequest;
};

export type RecurringIncomeFormValues = {
  incomeType: string;
  amount: string;
  date: Date | null;
  frequency: RecurringFrequency;
  note: string;
};
