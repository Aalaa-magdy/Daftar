import type { Transaction } from '../types/transactions.types';

function getTransactionTimestamp(transaction: Transaction): number {
  const value = transaction.createdAt ?? transaction.date;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function sortTransactionsByRecent(
  transactions: Transaction[],
): Transaction[] {
  return [...transactions].sort(
    (a, b) => getTransactionTimestamp(b) - getTransactionTimestamp(a),
  );
}
