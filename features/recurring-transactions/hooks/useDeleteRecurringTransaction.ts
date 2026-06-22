import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { recurringTransactionsApi } from '../api/recurring-transactions.api';
import { invalidateRecurringTransactionQueries } from '../lib/invalidate-recurring-queries';

export const useDeleteRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id) => recurringTransactionsApi.deactivate(id),
    onSuccess: (_, id) => {
      invalidateRecurringTransactionQueries(queryClient, id);
    },
  });
};
