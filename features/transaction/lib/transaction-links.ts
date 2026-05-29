import type { Href } from 'expo-router';
import {
  TRANSACTION_NEW_ID,
  type TransactionKind,
} from '@/features/transaction/types';

export function addTransactionHref(type: TransactionKind): Href {
  return {
    pathname: '/transaction/[id]',
    params: { id: TRANSACTION_NEW_ID, type },
  };
}

export function editTransactionHref(id: string, type: TransactionKind): Href {
  return {
    pathname: '/transaction/[id]',
    params: { id, type },
  };
}
