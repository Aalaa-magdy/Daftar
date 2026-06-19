import type { StatisticsPeriod } from './statistics.types';

export type StatisticsTimeFrame = StatisticsPeriod;

export type StatisticsQueryParams = {
  timeFrame: StatisticsTimeFrame;
  year?: number;
  month?: number;
  startDate?: string;
  endDate?: string;
};
