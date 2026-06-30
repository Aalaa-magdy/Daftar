import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { recurringTransactionsApi } from '../api/recurring-transactions.api';
import { invalidateRecurringTransactionQueries } from '../lib/invalidate-recurring-queries';
import { mergeRecurringTransactionUpdate } from '../lib/merge-recurring-transaction-update';
import type { RecurringTransaction } from '../types/recurring-transaction.types';
import type { UpdateRecurringTransactionVariables } from '../types/update-recurring-transaction.types';
import { recurringTransactionKeys } from './query-keys';

export const useUpdateRecurringTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RecurringTransaction,
    AxiosError,
    UpdateRecurringTransactionVariables
  >({
    mutationFn: ({ id, data }) => recurringTransactionsApi.update(id, data),
    onSuccess: (response, { id, data }) => {
      const merged = mergeRecurringTransactionUpdate(undefined, response, data);

      queryClient.setQueryData(recurringTransactionKeys.detail(id), merged);

      queryClient.setQueryData<RecurringTransaction[]>(
        recurringTransactionKeys.all,
        (current) => {
          if (!current) return current;

          return current.map((item) =>
            item.id === id
              ? mergeRecurringTransactionUpdate(item, response, data)
              : item,
          );
        },
      );

      invalidateRecurringTransactionQueries(queryClient, id);
    },
  });
};
