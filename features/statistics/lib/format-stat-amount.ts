export function formatSummaryAmount(
  amount: number,
  kind: 'spent' | 'income',
  currency: string,
): string {
  const formatted = Math.abs(amount).toLocaleString('en-US');
  const sign = kind === 'income' ? '+' : '-';
  return `${sign}${formatted} ${currency}`;
}

export function formatCompactNumber(amount: number): string {
  const abs = Math.abs(amount);

  if (abs >= 1000) {
    const thousands = abs / 1000;
    return thousands % 1 === 0
      ? `${thousands}k`
      : `${thousands.toFixed(1).replace(/\.0$/, '')}K`;
  }

  return abs.toLocaleString('en-US');
}

export function formatCompactAmount(amount: number, currency: string): string {
  return `${formatCompactNumber(amount)} ${currency}`;
}

export function formatPercentage(value: number): string {
  return `${value % 1 === 0 ? value : value.toFixed(1)}%`;
}
