import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { transactionsApi } from '../api/transactions.api';
import type { CreateTransactionRequest } from '../types/create-transaction.types';
import type { Transaction } from '../types/transactions.types';
import { transactionKeys } from './query-keys';

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation<Transaction, AxiosError, CreateTransactionRequest>({
    mutationFn: (data) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.balanceSummary });
      queryClient.invalidateQueries({ queryKey: ['transactions', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    },
  });
};
