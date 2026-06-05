export function formatSummaryAmount(amount: number, kind: 'spent' | 'income'): string {
  const formatted = Math.abs(amount).toLocaleString('en-US');
  const sign = kind === 'income' ? '+' : '-';
  return `${sign}${formatted} EGP`;
}

export function formatCompactAmount(amount: number): string {
  const abs = Math.abs(amount);

  if (abs >= 1000) {
    const thousands = abs / 1000;
    const compact =
      thousands % 1 === 0
        ? `${thousands}k`
        : `${thousands.toFixed(1).replace(/\.0$/, '')}K`;
    return `${compact} EGP`;
  }

  return `${abs.toLocaleString('en-US')} EGP`;
}

export function formatPercentage(value: number): string {
  return `${value % 1 === 0 ? value : value.toFixed(1)}%`;
}
