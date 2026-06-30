export type RecurringFrequency = 'monthly' | 'one-time';

export type RecurringTransactionType = 'income' | 'expense';

export type RecurringIncomeType =
  | 'salary'
  | 'part-time'
  | 'freelance'
  | 'bonus'
  | 'other';

export type RecurringTransaction = {
  id: string;
  userId: string;
  amount: number;
  type: RecurringTransactionType;
  frequency: RecurringFrequency;
  startDate: string;
  nextRunDate: string;
  dayOfMonth?: number;
  lastGeneratedAt?: string;
  isActive: boolean;
  notes?: string;
  incomeType?: RecurringIncomeType;
  createdAt?: string;
  updatedAt?: string;
};

export type RecurringIncomeListItem = {
  id: string;
  title: string;
  amount: number;
  scheduleLabel: string;
  incomeType?: RecurringIncomeType;
  notes?: string;
};
