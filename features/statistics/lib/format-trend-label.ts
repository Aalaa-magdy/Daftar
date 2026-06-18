import type { TFunction } from 'i18next';
import type { TrendPoint } from '../types/statistics.types';

const MONTH_LABEL_KEYS = new Set([
  'statistics.months.jan',
  'statistics.months.feb',
  'statistics.months.mar',
  'statistics.months.apr',
  'statistics.months.may',
  'statistics.months.jun',
  'statistics.months.jul',
  'statistics.months.aug',
  'statistics.months.sep',
  'statistics.months.oct',
  'statistics.months.nov',
  'statistics.months.dec',
]);

export function formatTrendLabel(point: TrendPoint, t: TFunction): string {
  if (point.label) {
    return point.label;
  }

  if (point.labelKey && MONTH_LABEL_KEYS.has(point.labelKey)) {
    return t(point.labelKey);
  }

  if (point.labelKey) {
    return t(point.labelKey, point.labelParams);
  }

  return '';
}
