import type { Category } from '@/features/categories/types/categories.types';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';
import type { Transaction } from '@/features/transactions/types/transactions.types';
import type { DailyCategoryStat, DailyReport } from '../types/daily-report.types';

function resolveCategoryMeta(
  categoryId: string | undefined,
  categories: Category[],
) {
  const found = categories.find((entry) => entry.id === categoryId);

  return {
    name: found?.name,
    icon: resolveCategoryIcon(found?.icon ?? ''),
    color: found?.color,
  };
}

export function buildDailyReport({
  transactions,
  categories,
  /** Current overall wallet balance — only meaningful for reconstructing "today"'s chain. */
  currentBalance,
  dateLabel,
  isToday,
  fallbackCategoryName,
}: {
  transactions: Transaction[];
  categories: Category[];
  currentBalance?: number;
  dateLabel: string;
  isToday: boolean;
  fallbackCategoryName: string;
}): DailyReport {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.transactionType === 'expense',
  );
  const totalSpent = expenseTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );

  const amountByCategory = new Map<string, number>();
  for (const transaction of expenseTransactions) {
    const key = transaction.categoryId ?? 'uncategorized';
    amountByCategory.set(key, (amountByCategory.get(key) ?? 0) + transaction.amount);
  }

  const sortedCategories = Array.from(amountByCategory.entries())
    .map(([categoryId, amount]) => ({ categoryId, amount }))
    .sort((a, b) => b.amount - a.amount);

  // The balance chain only makes sense for today: `currentBalance` is the
  // wallet's balance right now, which already has today's spending deducted
  // from it. Walking it backwards (current + today's total, then subtracting
  // each category in turn) reconstructs "balance before/after" per category.
  // For a past day we'd need every transaction between that day and now to
  // reconstruct its end-of-day balance, so we deliberately omit the chain.
  const showBalanceChain = isToday && currentBalance != null;
  let runningBalance = showBalanceChain
    ? (currentBalance as number) + totalSpent
    : 0;

  const dailyCategories: DailyCategoryStat[] = sortedCategories.map(
    ({ categoryId, amount }) => {
      const meta = resolveCategoryMeta(
        categoryId === 'uncategorized' ? undefined : categoryId,
        categories,
      );
      const percentage =
        totalSpent > 0 ? Math.round((amount / totalSpent) * 1000) / 10 : 0;

      let balanceBefore: number | undefined;
      let balanceAfter: number | undefined;
      if (showBalanceChain) {
        balanceBefore = runningBalance;
        runningBalance -= amount;
        balanceAfter = runningBalance;
      }

      return {
        categoryId,
        name: meta.name ?? fallbackCategoryName,
        amount,
        percentage,
        icon: meta.icon,
        color: meta.color,
        balanceBefore,
        balanceAfter,
      };
    },
  );

  return {
    dateLabel,
    isToday,
    totalSpent,
    topCategoryName: dailyCategories[0]?.name ?? null,
    expenseCount: expenseTransactions.length,
    categories: dailyCategories,
  };
}
