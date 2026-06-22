export const recurringTransactionKeys = {
  all: ['recurring-transactions'] as const,
  detail: (id: string) => ['recurring-transactions', id] as const,
};
