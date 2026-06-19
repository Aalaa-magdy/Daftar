import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import {
  TRANSACTION_NEW_ID,
  type TransactionFormParams,
  type TransactionKind,
} from '../types';

function resolveParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function useTransactionFormMode() {
  const { id, type } = useLocalSearchParams<TransactionFormParams>();

  return useMemo(() => {
    const resolvedId = resolveParam(id) ?? TRANSACTION_NEW_ID;
    const resolvedType = resolveParam(type);
    const isEdit = resolvedId !== TRANSACTION_NEW_ID;
    const kind: TransactionKind =
      resolvedType === 'income' ? 'income' : 'expense';

    return {
      id: resolvedId,
      kind,
      isEdit,
    };
  }, [id, type]);
}
