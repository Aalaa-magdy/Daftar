import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { transactionsApi } from '../api/transactions.api';
import { invalidateTransactionQueries } from '../lib/invalidate-transaction-queries';
import type { CreateTransactionRequest } from '../types/create-transaction.types';
import type { Transaction } from '../types/transactions.types';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<Transaction, AxiosError, CreateTransactionRequest>({
    mutationFn: (data) => transactionsApi.create(data),
    onSuccess: () => {
      invalidateTransactionQueries(queryClient);
    },
  });
};
