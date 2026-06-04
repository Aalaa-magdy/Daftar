import type { TimeRangePreset } from '../types/history-filter';

export const TIME_RANGE_PRESETS: {
  id: TimeRangePreset;
  label: string;
}[] = [
  { id: 'this-week', label: 'This Week' },
  { id: 'this-month', label: 'This Month' },
  { id: 'last-month', label: 'Last Month' },
  { id: 'this-year', label: 'This Year' },
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function getPresetDateRange(
  preset: TimeRangePreset,
  reference = new Date(),
): { from: Date; to: Date } {
  const now = startOfDay(reference);

  if (preset === 'this-week') {
    const from = new Date(now);
    from.setDate(now.getDate() - now.getDay());
    const to = new Date(from);
    to.setDate(from.getDate() + 6);
    return { from: startOfDay(from), to: endOfDay(to) };
  }

  if (preset === 'this-month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { from: startOfDay(from), to: endOfDay(to) };
  }

  if (preset === 'last-month') {
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const to = new Date(now.getFullYear(), now.getMonth(), 0);
    return { from: startOfDay(from), to: endOfDay(to) };
  }

  const from = new Date(now.getFullYear(), 0, 1);
  const to = new Date(now.getFullYear(), 11, 31);
  return { from: startOfDay(from), to: endOfDay(to) };
}

export function getActiveDateRange(
  preset: TimeRangePreset | null,
  fromDate: Date | null,
  toDate: Date | null,
): { from: Date | null; to: Date | null } {
  if (preset) {
    const range = getPresetDateRange(preset);
    return range;
  }

  return { from: fromDate, to: toDate };
}

export { startOfDay, endOfDay };
