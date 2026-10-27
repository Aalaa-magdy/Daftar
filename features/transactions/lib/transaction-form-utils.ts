export function parsePositiveAmount(value: string): number {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  return amount;
}

export function isPositiveInteger(value: string | number): boolean {
  const number = Number(value);
  return Number.isInteger(number) && number > 0;
}

export function parseRepeatCount(
  value: string | undefined,
  repeat: 'monthly' | 'one-time',
): number | undefined {
  if (repeat === 'one-time') return undefined;

  const repeatCount = Number(value);
  if (!isPositiveInteger(repeatCount)) {
    throw new Error('Monthly occurrence count must be a positive whole number');
  }

  return repeatCount;
}

export function normalizePositiveInteger(value: unknown): number | undefined {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return undefined;
  }

  const number = Number(value);
  return isPositiveInteger(number) ? number : undefined;
}
