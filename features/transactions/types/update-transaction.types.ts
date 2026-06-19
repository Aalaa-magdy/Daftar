import type { ApiIncomeType, ApiRepeatType, ApiTransactionType } from './transactions.types';

export type UpdateTransactionRequest = {
  amount?: number;
  transactionType?: ApiTransactionType;
  date?: string;
  payDate?: string;
  notes?: string;
  categoryId?: string;
  incomeType?: ApiIncomeType;
  repeat?: ApiRepeatType;
};

export type UpdateTransactionVariables = {
  id: string;
  data: UpdateTransactionRequest;
};
