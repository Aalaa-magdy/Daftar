import type { Href } from 'expo-router';

export function editRecurringTransactionHref(id: string): Href {
  return {
    pathname: '/recurring-transaction/[id]',
    params: { id },
  };
}
