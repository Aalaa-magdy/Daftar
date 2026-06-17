import type { TransactionListItem } from '@/features/transactions/types/transactions.types';

/** Client-side fallback when multiple categories are selected (API accepts one categoryId). */
export function applyCategoryFilter(
  items: TransactionListItem[],
  categoryIds: string[],
): TransactionListItem[] {
  if (categoryIds.length <= 1) return items;

  return items.filter(
    (item) =>
      item.type === 'expense' &&
      item.categoryId != null &&
      categoryIds.includes(item.categoryId),
  );
}
