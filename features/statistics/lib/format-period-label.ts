import type { StatisticsPeriod } from '../types/statistics.types';
import { getWeekRange } from './period-range';

function getLocale(language: string) {
  return language === 'ar' ? 'ar-EG' : 'en-US';
}

export function formatWeekLabel(
  anchor: Date,
  language: string,
): string {
  const locale = getLocale(language);
  const { from, to } = getWeekRange(anchor);

  if (
    from.getMonth() === to.getMonth() &&
    from.getFullYear() === to.getFullYear()
  ) {
    const month = from.toLocaleDateString(locale, { month: 'long' });
    return `${month} ${from.getDate()} – ${to.getDate()}`;
  }

  const start = from.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
  });
  const end = to.toLocaleDateString(locale, {
    month: 'long',
    day: 'numeric',
  });

  return `${start} – ${end}`;
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
