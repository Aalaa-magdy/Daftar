import type { IconSvgElement } from '@hugeicons/react-native';
import { DEFAULT_CATEGORY_DEFINITIONS } from '@/features/categories/lib/default-categories';
import { resolveCategoryIcon } from '@/features/categories/lib/category-icons';

export type ExpenseCategory = {
  id: string;
  icon: IconSvgElement;
  color: string;
};

export function getCategoryLabelKey(id: string): string {
  return id === 'self-care' ? 'selfCare' : id;
}

/** Static preview list — live categories come from the API after seeding. */
export const EXPENSE_CATEGORIES: ExpenseCategory[] =
  DEFAULT_CATEGORY_DEFINITIONS.map((definition) => ({
    id: definition.nameKey === 'selfCare' ? 'self-care' : definition.nameKey,
    icon: resolveCategoryIcon(definition.faIcon),
    color: definition.color,
  }));

export { DEFAULT_CATEGORY_DEFINITIONS };

export const INCOME_TYPES = [
  'salary',
  'partTime',
  'freelance',
  'bonus',
  'other',
] as const;

export const REPEAT_OPTIONS = ['monthly', 'oneTime'] as const;

export const CATEGORY_COLOR_OPTIONS = [
  '#1B5E20',
  '#C9A227',
  '#F04438',
  '#F63D68',
  '#7A5AF8',
  '#717680',
] as const;

export type CategoryDialogueMode = 'add' | 'edit';
