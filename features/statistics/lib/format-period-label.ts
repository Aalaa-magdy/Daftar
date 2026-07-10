import type { StatisticsPeriod } from '../types/statistics.types';
import { getWeekRange } from './period-range';

function getLocale(language: string) {
  return language === 'ar' ? 'ar-EG' : 'en-US';
}

export function formatWeekDayLabel(date: Date, language: string): string {
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  return date.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
  });
}

export function formatWeekLabel(
  anchor: Date,
  language: string,
): string {
  const { from, to } = getWeekRange(anchor);
  return `${formatWeekDayLabel(from, language)} – ${formatWeekDayLabel(to, language)}`;
}

export function formatMonthLabel(anchor: Date, language: string): string {
  return anchor.toLocaleDateString(getLocale(language), {
    month: 'long',
    year: 'numeric',
  });
}

export function formatYearLabel(anchor: Date): string {
  return String(anchor.getFullYear());
}

export function formatPeriodLabel(
  anchor: Date,
  period: StatisticsPeriod,
  language: string,
): string {
  if (period === 'week') return formatWeekLabel(anchor, language);
  if (period === 'month') return formatMonthLabel(anchor, language);
  return formatYearLabel(anchor);
}
