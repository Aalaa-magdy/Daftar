import type { Category } from '@/features/categories/types/categories.types';
import { getCategoryBackgroundColor } from '@/features/categories/lib/category-colors';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';
import type { TFunction } from 'i18next';
import type {
  Transaction,
  TransactionListItem,
} from '../types/transactions.types';
import { sortTransactionsByRecent } from './sort-transactions-by-recent';

function formatTransactionTime(date: Date, language: string): string {
  return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function incomeTypeLabel(
  incomeType: Transaction['incomeType'],
  t: TFunction,
): string {
  switch (incomeType) {
    case 'salary':
      return t('transaction.incomeTypes.salary', { defaultValue: 'Salary' });
    case 'part-time':
      return t('transaction.incomeTypes.partTime');
    case 'freelance':
      return t('transaction.incomeTypes.freelance');
    case 'bonus':
      return t('transaction.incomeTypes.bonus');
    case 'other':
    default:
      return t('transaction.incomeTypes.other');
  }
}

function repeatLabel(repeat: Transaction['repeat'], t: TFunction): string | undefined {
  if (!repeat) return undefined;
  if (repeat === 'monthly') return t('common.monthly');
  return t('common.oneTime');
}

function resolveCategory(
  categoryId: string | undefined,
  categories: Category[],
) {
  if (!categoryId) return null;
  return categories.find((category) => category.id === categoryId) ?? null;
}

export function mapTransactionToListItem(
  transaction: Transaction,
  categories: Category[],
  t: TFunction,
  language: string,
): TransactionListItem {
  const date = new Date(transaction.date);
  const category = resolveCategory(transaction.categoryId, categories);

  const isExpense = transaction.transactionType === 'expense';

  return {
    id: transaction.id,
    type: transaction.transactionType,
    title: isExpense
      ? category?.name ?? transaction.notes?.trim() ?? t('common.expense')
      : incomeTypeLabel(transaction.incomeType, t),
    amount: transaction.amount,
    time: formatTransactionTime(date, language),
    date,
    note: isExpense ? transaction.notes?.trim() : undefined,
    repeat: !isExpense ? repeatLabel(transaction.repeat, t) : undefined,
    categoryId: transaction.categoryId,
    categoryIcon: category ? resolveCategoryIcon(category.icon) : undefined,
    categoryIconColor: category?.color,
    iconBackgroundColor: category
      ? getCategoryBackgroundColor(category.color)
      : undefined,
  };
}

export function mapTransactionsToListItems(
  transactions: Transaction[],
  categories: Category[],
  t: TFunction,
  language: string,
): TransactionListItem[] {
  return sortTransactionsByRecent(transactions).map((transaction) =>
    mapTransactionToListItem(transaction, categories, t, language),
  );
}
