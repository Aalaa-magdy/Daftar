export type ApiHistoryPreset =
  | 'this_week'
  | 'this_month'
  | 'last_month'
  | 'this_year';

export type HistoryQueryParams = {
  transactionType?: 'expense' | 'income';
  incomeType?: string;
  preset?: ApiHistoryPreset;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
};
