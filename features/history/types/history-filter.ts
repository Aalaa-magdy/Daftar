export type TimeRangePreset =
  | 'this-week'
  | 'this-month'
  | 'last-month'
  | 'this-year';

export type HistoryFilterState = {
  preset: TimeRangePreset | null;
  fromDate: Date | null;
  toDate: Date | null;
  categoryIds: string[];
};

export const DEFAULT_HISTORY_FILTER: HistoryFilterState = {
  preset: null,
  fromDate: null,
  toDate: null,
  categoryIds: [],
};
