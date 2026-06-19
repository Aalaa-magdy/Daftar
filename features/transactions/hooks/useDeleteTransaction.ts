import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { transactionsApi } from '../api/transactions.api';
import { invalidateTransactionQueries } from '../lib/invalidate-transaction-queries';

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (id) => transactionsApi.delete(id),
    onSuccess: (_, id) => {
      invalidateTransactionQueries(queryClient, { transactionId: id });
    },
  });
};
