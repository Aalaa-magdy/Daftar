import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { transactionsApi } from '../api/transactions.api';
import { invalidateTransactionQueries } from '../lib/invalidate-transaction-queries';
import type { UpdateTransactionVariables } from '../types/update-transaction.types';
import type { Transaction } from '../types/transactions.types';

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<Transaction, AxiosError, UpdateTransactionVariables>({
    mutationFn: ({ id, data }) => transactionsApi.update(id, data),
    onSuccess: (_, { id }) => {
      invalidateTransactionQueries(queryClient, { transactionId: id });
    },
  });
};
