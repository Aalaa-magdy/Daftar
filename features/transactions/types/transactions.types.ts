import type { IconSvgElement } from '@hugeicons/react-native';
import type { TransactionKind } from '@/features/transaction/types';

export type ApiTransactionType = 'expense' | 'income';
export type ApiIncomeType = 'salary' | 'part-time' | 'freelance' | 'bonus' | 'other';
export type ApiRepeatType = 'monthly' | 'one-time';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  transactionType: ApiTransactionType;
  date: string;
  recurringId?: string | null;
  notes?: string;
  categoryId?: string;
  incomeType?: ApiIncomeType;
  repeat?: ApiRepeatType;
  createdAt?: string;
  updatedAt?: string;
}

/** UI model used by Home and History lists. */
export type TransactionListItem = {
  id: string;
  type: TransactionKind;
  title: string;
  amount: number;
  time: string;
  date: Date;
  note?: string;
  repeat?: string;
  categoryId?: string;
  categoryIcon?: IconSvgElement;
  categoryIconColor?: string;
  iconBackgroundColor?: string;
};
