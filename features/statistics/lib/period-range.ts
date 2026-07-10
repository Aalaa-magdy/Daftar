import type { StatisticsPeriod } from '../types/statistics.types';

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

export function getWeekRange(anchor: Date): { from: Date; to: Date } {
  const day = startOfDay(anchor);
  const daysSinceSaturday = (day.getDay() + 1) % 7;
  const from = new Date(day);
  from.setDate(day.getDate() - daysSinceSaturday);
  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  return { from: startOfDay(from), to: endOfDay(to) };
}

export function getMonthRange(anchor: Date): { from: Date; to: Date } {
  const from = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const to = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  return { from: startOfDay(from), to: endOfDay(to) };
}

export function getYearRange(anchor: Date): { from: Date; to: Date } {
  const from = new Date(anchor.getFullYear(), 0, 1);
  const to = new Date(anchor.getFullYear(), 11, 31);
  return { from: startOfDay(from), to: endOfDay(to) };
}

export function getPeriodRange(
  anchor: Date,
  period: StatisticsPeriod,
): { from: Date; to: Date } {
  if (period === 'week') return getWeekRange(anchor);
  if (period === 'month') return getMonthRange(anchor);
  return getYearRange(anchor);
}

export function shiftPeriodAnchor(
  anchor: Date,
  period: StatisticsPeriod,
  delta: -1 | 1,
): Date {
  const next = new Date(anchor);

  if (period === 'week') {
    next.setDate(next.getDate() + 7 * delta);
    return next;
  }

  if (period === 'month') {
    next.setMonth(next.getMonth() + delta);
    return next;
  }

  next.setFullYear(next.getFullYear() + delta);
  return next;
}
