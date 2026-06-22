import type { Href } from 'expo-router';

export function editRecurringIncomeHref(id: string): Href {
  return {
    pathname: '/recurring-transaction/[id]',
    params: { id },
  };
}
