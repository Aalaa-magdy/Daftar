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
  repeatMonths?: number;
  generatedCount?: number;
  categoryId?: string;
  name?: string;
  notes?: string;
  incomeType?: RecurringIncomeType;
  createdAt?: string;
  updatedAt?: string;
};

export type RecurringTransactionListItem = {
  id: string;
  type: RecurringTransactionType;
  title: string;
  amount: number;
  scheduleLabel: string;
  nextRunDate: string;
  categoryName?: string;
  repeatMonths?: number;
  generatedCount?: number;
  incomeType?: RecurringIncomeType;
  notes?: string;
};