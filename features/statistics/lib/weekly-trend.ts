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

/** Parse API `date` (preferred) or fallback strings into a local calendar day. */
export function parseTrendPointDate(
  value: string | undefined,
): Date | null {
  if (!value) return null;

  const trimmed = value.trim();

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

  const dayMonthMatch = trimmed.match(
    /^(\d{1,2})[-/](\d{1,2})(?:[-/](\d{2,4}))?$/,
  );
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

  return null;
}

function findMatchingTrendPoint(
  day: Date,
  trendPoints: ApiStatisticsTrendPoint[],
  index: number,
): ApiStatisticsTrendPoint | undefined {
  for (const point of trendPoints) {
    const parsed = parseTrendPointDate(point.date ?? point.label);
    if (parsed && isSameDay(parsed, day)) {
      return point;
    }
  }

  // Backend already returned 7 ordered days for this startDate/endDate range.
  if (trendPoints.length === 7) {
    return trendPoints[index];
  }

  return undefined;
}

function getTodayIndex(weekDays: Date[]): number {
  const today = startOfDay(new Date());
  return weekDays.findIndex((day) => isSameDay(day, today));
}

function resolveActiveIndex(
  weekDays: Date[],
  trendPoints: ApiStatisticsTrendPoint[],
  selectedIndex?: number,
): number {
  if (
    selectedIndex != null &&
    selectedIndex >= 0 &&
    selectedIndex < trendPoints.length
  ) {
    const selected = trendPoints[selectedIndex];
    const selectedDate = parseTrendPointDate(selected.date ?? selected.label);
    if (selectedDate) {
      const matched = weekDays.findIndex((day) =>
        isSameDay(day, selectedDate),
      );
      if (matched >= 0) return matched;
    }

    if (trendPoints.length === 7 && selectedIndex < weekDays.length) {
      return selectedIndex;
    }
  }

  return getTodayIndex(weekDays);
}

function resolveWeeklyVariant(
  index: number,
  activeIndex: number,
  spent: number,
): TrendVariant {
  if (activeIndex >= 0 && index === activeIndex) return 'active';
  return spent > 0 ? 'past' : 'placeholder';
}

/**
 * Maps GET /statistics week trend (`date`, `spent`, `income`, selectedIndex)
 * onto the frontend Sat→Fri week range (same startDate/endDate used in the query).
 */
export function mapWeeklyDailyTrendPoints(
  trendPoints: ApiStatisticsTrendPoint[],
  anchorDate: Date,
  language: string,
  selectedIndex?: number,
): TrendPoint[] {
  const weekDays = getWeekDays(anchorDate);
  const activeIndex = resolveActiveIndex(
    weekDays,
    trendPoints,
    selectedIndex,
  );

  return weekDays.map((day, index) => {
    const matched = findMatchingTrendPoint(day, trendPoints, index);
    const spent = matched?.spent ?? 0;
    const income = matched?.income ?? 0;

    return {
      labelKey: getWeekdayLabelKey(day),
      tooltipTitle: formatWeekDayLabel(day, language),
      value: spent,
      spent,
      income,
      variant: resolveWeeklyVariant(index, activeIndex, spent),
    };
  });
}
