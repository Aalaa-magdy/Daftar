import type { TFunction } from 'i18next';
import { resolveDayOfMonth } from './recurring-form-mappers';
import type {
  RecurringIncomeType,
  RecurringTransactionListItem,
  RecurringTransaction,
} from '../types/recurring-transaction.types';

function formatOrdinalDay(day: number, language: string): string {
  if (language.startsWith('ar')) {
    return String(day);
  }

  const remainderTen = day % 10;
  const remainderHundred = day % 100;

  if (remainderTen === 1 && remainderHundred !== 11) return `${day}st`;
  if (remainderTen === 2 && remainderHundred !== 12) return `${day}nd`;
  if (remainderTen === 3 && remainderHundred !== 13) return `${day}rd`;
  return `${day}th`;
}

function incomeTypeLabelKey(incomeType: RecurringIncomeType): string {
  if (incomeType === 'part-time') return 'partTime';
  return incomeType;
}

function resolveTitle(
  item: RecurringTransaction,
  t: TFunction,
): string {
  if (item.type === 'expense' && item.frequency === 'monthly' && item.name) {
    return item.name;
  }

  if (item.notes) {
    return item.notes;
  }

  if (item.type === 'income' && item.incomeType) {
    return t(`transaction.incomeTypes.${incomeTypeLabelKey(item.incomeType)}`, {
      defaultValue: item.incomeType,
    });
  }

  return item.type === 'income'
    ? t('transaction.incomeTypes.salary')
    : t('common.expense');
}

function resolveScheduleLabel(
  item: RecurringTransaction,
  t: TFunction,
  language: string,
): string {
  const day = resolveDayOfMonth(item);
  const ordinalDay = formatOrdinalDay(day, language);

  if (item.frequency === 'monthly') {
    return t('manageIncome.scheduleMonthly', { day: ordinalDay });
  }

  return t('common.oneTime');
}

export function mapRecurringTransactionListItem(
  item: RecurringTransaction,
  t: TFunction,
  language: string,
): RecurringTransactionListItem {
  return {
    id: item.id,
    type: item.type,
    title: resolveTitle(item, t),
    amount: item.amount,
    scheduleLabel: resolveScheduleLabel(item, t, language),
    repeatMonths: item.repeatMonths,
    generatedCount: item.generatedCount,
    incomeType: item.incomeType,
    notes: item.notes,
  };
}

export function mapRecurringTransactionListItems(
  items: RecurringTransaction[],
  t: TFunction,
  language: string,
): RecurringTransactionListItem[] {
  return items
    .filter((item) => item.isActive)
    .map((item) => mapRecurringTransactionListItem(item, t, language));
}
