import type { StatisticsPeriod } from '../types/statistics.types';
import { getWeekRange } from './period-range';

function getLocale(language: string) {
  return language === 'ar' ? 'ar-EG' : 'en-US';
}

/** e.g. "Friday, 10 June" — matches the app's day-before-month convention. */
export function formatDayLabel(anchor: Date, language: string): string {
  const locale = getLocale(language);
  const weekday = anchor.toLocaleDateString(locale, { weekday: 'long' });
  const month = anchor.toLocaleDateString(locale, { month: 'long' });
  return `${weekday}, ${anchor.getDate()} ${month}`;
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
  if (period === 'day') return formatDayLabel(anchor, language);
  if (period === 'week') return formatWeekLabel(anchor, language);
  if (period === 'month') return formatMonthLabel(anchor, language);
  return formatYearLabel(anchor);
}
