import type { TFunction } from 'i18next';
import type {
  RecurringIncomeListItem,
  RecurringIncomeType,
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

function readDayFromDate(value: string): number {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 1;
  return parsed.getUTCDate();
}

function incomeTypeLabelKey(incomeType: RecurringIncomeType): string {
  if (incomeType === 'part-time') return 'partTime';
  return incomeType;
}

function resolveTitle(
  item: RecurringTransaction,
  t: TFunction,
): string {
  if (item.notes) {
    return item.notes;
  }

  if (item.incomeType) {
    return t(`transaction.incomeTypes.${incomeTypeLabelKey(item.incomeType)}`, {
      defaultValue: item.incomeType,
    });
  }

  return t('transaction.incomeTypes.salary');
}

function resolveScheduleLabel(
  item: RecurringTransaction,
  t: TFunction,
  language: string,
): string {
  const day = readDayFromDate(item.startDate || item.nextRunDate);
  const ordinalDay = formatOrdinalDay(day, language);

  if (item.frequency === 'monthly') {
    return t('manageIncome.scheduleMonthly', { day: ordinalDay });
  }

  if (item.frequency === 'weekly') {
    return t('manageIncome.scheduleWeekly');
  }

  if (item.frequency === 'yearly') {
    return t('manageIncome.scheduleYearly');
  }

  return t('common.oneTime');
}

export function mapRecurringIncomeListItem(
  item: RecurringTransaction,
  t: TFunction,
  language: string,
): RecurringIncomeListItem {
  return {
    id: item.id,
    title: resolveTitle(item, t),
    amount: item.amount,
    scheduleLabel: resolveScheduleLabel(item, t, language),
    incomeType: item.incomeType,
    notes: item.notes,
  };
}

export function mapRecurringIncomeListItems(
  items: RecurringTransaction[],
  t: TFunction,
  language: string,
): RecurringIncomeListItem[] {
  return items
    .filter((item) => item.type === 'income' && item.isActive)
    .map((item) => mapRecurringIncomeListItem(item, t, language));
}
