import type { ApiStatisticsTrendPoint } from './statistics-response.types';

export type StatisticsTrend = {
  selectedIndex?: number;
  data: ApiStatisticsTrendPoint[];
};
