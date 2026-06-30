const TRANSACTION_TIME_UTC_OFFSET_HOURS = 3;

export function formatTransactionTime(
  value: string | Date,
  language: string,
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const utcPlus3Ms =
    date.getTime() + TRANSACTION_TIME_UTC_OFFSET_HOURS * 60 * 60 * 1000;
  const utcPlus3 = new Date(utcPlus3Ms);

  return utcPlus3.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

export function resolveTransactionTimeSource(transaction: {
  createdAt?: string;
  date: string;
}): string {
  return transaction.createdAt ?? transaction.date;
}
