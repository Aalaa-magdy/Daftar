import Car03Icon from '@hugeicons/core-free-icons/Car03Icon';
import HairDryerIcon from '@hugeicons/core-free-icons/HairDryerIcon';
import Hamburger02Icon from '@hugeicons/core-free-icons/Hamburger02Icon';
import HealthIcon from '@hugeicons/core-free-icons/HealthIcon';
import House03Icon from '@hugeicons/core-free-icons/House03Icon';
import InvoiceIcon from '@hugeicons/core-free-icons/InvoiceIcon';
import OnlineLearning01Icon from '@hugeicons/core-free-icons/OnlineLearning01Icon';
import ShoppingBag01Icon from '@hugeicons/core-free-icons/ShoppingBag01Icon';
import UserGroupIcon from '@hugeicons/core-free-icons/UserGroupIcon';
import Wallet03Icon from '@hugeicons/core-free-icons/Wallet03Icon';
import type { IconSvgElement } from '@hugeicons/react-native';

export type ExpenseCategory = {
  id: string;
  icon: IconSvgElement;
  color: string;
};

export function getCategoryLabelKey(id: string): string {
  return id === 'self-care' ? 'selfCare' : id;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', icon: Hamburger02Icon, color: '#F04438' },
  { id: 'bills', icon: InvoiceIcon, color: '#17B26A' },
  { id: 'family', icon: UserGroupIcon, color: '#7A5AF8' },
  { id: 'health', icon: HealthIcon, color: '#2E90FA' },
  { id: 'work', icon: Wallet03Icon, color: '#0E9384' },
  { id: 'shopping', icon: ShoppingBag01Icon, color: '#EE46BC' },
  { id: 'transportation', icon: Car03Icon, color: '#F79009' },
  { id: 'self-care', icon: HairDryerIcon, color: '#F670C7' },
  { id: 'housing', icon: House03Icon, color: '#6172F3' },
  { id: 'education', icon: OnlineLearning01Icon, color: '#444CE7' },
];

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
