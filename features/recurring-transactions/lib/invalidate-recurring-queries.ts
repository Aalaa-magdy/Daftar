import type { QueryClient } from '@tanstack/react-query';
import { recurringTransactionKeys } from '../hooks/query-keys';

export function invalidateRecurringTransactionQueries(
  queryClient: QueryClient,
  recurringId?: string,
) {
  queryClient.invalidateQueries({ queryKey: recurringTransactionKeys.all });

  if (recurringId) {
    queryClient.invalidateQueries({
      queryKey: recurringTransactionKeys.detail(recurringId),
    });
  }
}
