export function formatBalanceAmount(value: number): string {
  return value.toLocaleString('en-US');
}

export function getDaysRemainingInMonth(date = new Date()): number {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Math.max(lastDay - date.getDate(), 0);
}

export function getExpenseProgress(
  totalExpense: number,
  totalIncome: number,
): number {
  if (totalIncome <= 0) return 0;
  return Math.min(totalExpense / totalIncome, 1);
}
