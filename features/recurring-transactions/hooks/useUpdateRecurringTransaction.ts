import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { recurringTransactionsApi } from '../api/recurring-transactions.api';
import { invalidateRecurringTransactionQueries } from '../lib/invalidate-recurring-queries';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import type { UpdateRecurringTransactionVariables } from '../types/update-recurring-transaction.types';

export const useUpdateRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RecurringTransaction,
    AxiosError,
    UpdateRecurringTransactionVariables
  >({
    mutationFn: ({ id, data }) => recurringTransactionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      invalidateRecurringTransactionQueries(queryClient, id);
    },
  });
};
