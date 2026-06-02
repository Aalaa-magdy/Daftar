import { EXPENSE_CATEGORIES } from '@/features/transaction/data/form-options';
import type { TransactionKind } from '@/features/transaction/types';
import type { IconSvgElement } from '@hugeicons/react-native';

export type HistoryTransaction = {
  id: string;
  type: TransactionKind;
  title: string;
  amount: number;
  time: string;
  date: Date;
  note?: string;
  repeat?: string;
  categoryIcon?: IconSvgElement;
  categoryIconColor?: string;
  iconBackgroundColor?: string;
};

const category = (id: string) => {
  const match = EXPENSE_CATEGORIES.find((item) => item.id === id);
  if (!match) return {};

  return {
    categoryIcon: match.icon,
    categoryIconColor: match.color,
    iconBackgroundColor: `${match.color}1A`,
  };
};

export const HISTORY_TRANSACTIONS: HistoryTransaction[] = [
  {
    id: 'income-1',
    type: 'income',
    title: 'Part Time',
    amount: 10000,
    time: '5:23 PM',
    date: new Date(2026, 5, 1),
    repeat: 'Monthly',
  },
  {
    id: 'expense-shopping',
    type: 'expense',
    title: 'Shopping',
    amount: 3000,
    time: '5:23 PM',
    date: new Date(2026, 5, 1),
    ...category('shopping'),
  },
  {
    id: 'expense-1',
    type: 'expense',
    title: 'Education',
    amount: 4000,
    time: '5:23 PM',
    date: new Date(2026, 5, 1),
    note: 'React Native Course',
    ...category('education'),
  },
  {
    id: 'expense-self-care',
    type: 'expense',
    title: 'Self Care',
    amount: 2500,
    time: '4:55 PM',
    date: new Date(2026, 5, 1),
    note: 'Skin & Hair Care',
    ...category('self-care'),
  },
  {
    id: 'income-2',
    type: 'income',
    title: 'Part Time',
    amount: 10000,
    time: '5:23 PM',
    date: new Date(2026, 4, 27),
    repeat: 'Monthly',
  },
  {
    id: 'income-freelance',
    type: 'income',
    title: 'Freelance',
    amount: 4500,
    time: '9:20 PM',
    date: new Date(2026, 4, 8),
    repeat: 'One-time',
  },
  {
    id: 'expense-bills',
    type: 'expense',
    title: 'Bills',
    amount: 1000,
    time: '9:20 PM',
    date: new Date(2026, 4, 1),
    ...category('bills'),
  },
  {
    id: 'expense-food',
    type: 'expense',
    title: 'Food',
    amount: 500,
    time: '9:20 PM',
    date: new Date(2026, 4, 1),
    note: 'Pizza 🍕',
    ...category('food'),
  },
  {
    id: 'expense-health',
    type: 'expense',
    title: 'Health',
    amount: 800,
    time: '9:20 PM',
    date: new Date(2026, 4, 1),
    ...category('health'),
  },
];
