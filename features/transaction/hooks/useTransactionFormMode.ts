import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import {
  TRANSACTION_NEW_ID,
  type TransactionFormParams,
  type TransactionKind,
} from '../types';

export function useTransactionFormMode() {
  const { id, type } = useLocalSearchParams<TransactionFormParams>();

  return useMemo(() => {
    const isEdit = id !== TRANSACTION_NEW_ID;
    const kind: TransactionKind = type === 'income' ? 'income' : 'expense';
    return {
      id: id ?? TRANSACTION_NEW_ID,
      kind,
      isEdit,
    };
  }, [id, type]);
}
