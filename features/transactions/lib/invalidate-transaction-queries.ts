import { statisticsKeys } from '@/features/statistics/hooks/query-keys';
import type { QueryClient } from '@tanstack/react-query';
import { transactionKeys } from '../hooks/query-keys';

type InvalidateTransactionQueriesOptions = {
  /** When set, drops the cached detail query (e.g. after delete). */
  transactionId?: string;
};

/**
 * Refreshes every query that depends on transaction data:
 * home list, balance summary, history filters, edit detail, and statistics.
 */
export function invalidateTransactionQueries(
  queryClient: QueryClient,
  options: InvalidateTransactionQueriesOptions = {},
) {
  queryClient.invalidateQueries({
    queryKey: transactionKeys.all,
    refetchType: 'all',
  });

  queryClient.invalidateQueries({
    queryKey: statisticsKeys.all,
    refetchType: 'all',
  });

  if (options.transactionId) {
    queryClient.removeQueries({
      queryKey: transactionKeys.detail(options.transactionId),
    });
  }
}
