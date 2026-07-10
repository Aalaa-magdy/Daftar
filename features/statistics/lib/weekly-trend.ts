import type { ApiStatisticsTrendPoint } from '../types/statistics-response.types';
import type { TrendPoint, TrendVariant } from '../types/statistics.types';
import { formatWeekDayLabel } from './format-period-label';
import { getWeekRange } from './period-range';

const WEEKDAY_LABEL_KEYS = [
  'statistics.weekdays.sat',
  'statistics.weekdays.sun',
  'statistics.weekdays.mon',
  'statistics.weekdays.tue',
  'statistics.weekdays.wed',
  'statistics.weekdays.thu',
  'statistics.weekdays.fri',
] as const;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getWeekDays(anchor: Date): Date[] {
  const { from } = getWeekRange(anchor);
  const days: Date[] = [];

  for (let index = 0; index < 7; index += 1) {
    const day = new Date(from);
    day.setDate(from.getDate() + index);
    days.push(startOfDay(day));
  }

  return days;
}

function getWeekdayLabelKey(date: Date): (typeof WEEKDAY_LABEL_KEYS)[number] {
  const indexFromSaturday = (date.getDay() + 1) % 7;
  return WEEKDAY_LABEL_KEYS[indexFromSaturday];
}

function parseTrendPointDate(label: string | undefined): Date | null {
  if (!label) return null;

  const trimmed = label.trim();

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return startOfDay(
      new Date(
        Number(isoMatch[1]),
        Number(isoMatch[2]) - 1,
        Number(isoMatch[3]),
      ),
    );
  }

  const dayMonthMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})(?:[-/](\d{2,4}))?$/);
  if (dayMonthMatch) {
    const day = Number(dayMonthMatch[1]);
    const month = Number(dayMonthMatch[2]) - 1;
    const yearPart = dayMonthMatch[3];
    const year = yearPart
      ? yearPart.length === 2
        ? 2000 + Number(yearPart)
        : Number(yearPart)
      : new Date().getFullYear();

    return startOfDay(new Date(year, month, day));
  }

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    return startOfDay(new Date(parsed));
  }

  return null;
}

function findMatchingTrendPoint(
  day: Date,
  trendPoints: ApiStatisticsTrendPoint[],
  index: number,
): ApiStatisticsTrendPoint | undefined {
  for (const point of trendPoints) {
    const parsed = parseTrendPointDate(point.label);
    if (parsed && isSameDay(parsed, day)) {
      return point;
    }
  }

  if (trendPoints.length === 7) {
    return trendPoints[index];
  }

  return undefined;
}

function getActiveDayIndex(weekDays: Date[]): number {
  const today = startOfDay(new Date());
  return weekDays.findIndex((day) => isSameDay(day, today));
}

function resolveWeeklyVariant(
  index: number,
  activeIndex: number,
): TrendVariant {
  if (activeIndex >= 0 && index === activeIndex) return 'active';
  return 'past';
}

export function mapWeeklyDailyTrendPoints(
  trendPoints: ApiStatisticsTrendPoint[],
  anchorDate: Date,
  language: string,
): TrendPoint[] {
  const weekDays = getWeekDays(anchorDate);
  const activeIndex = getActiveDayIndex(weekDays);

  return weekDays.map((day, index) => {
    const matched = findMatchingTrendPoint(day, trendPoints, index);
    const spent = matched?.spent ?? 0;
    const income = matched?.income;

    return {
      labelKey: getWeekdayLabelKey(day),
      tooltipTitle: formatWeekDayLabel(day, language),
      value: spent,
      spent,
      income,
      variant: resolveWeeklyVariant(index, activeIndex),
    };
  });
}
