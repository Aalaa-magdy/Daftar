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
  label: string;
  icon: IconSvgElement;
  color: string;
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'food', label: 'Food', icon: Hamburger02Icon, color: '#F04438' },
  { id: 'bills', label: 'Bills', icon: InvoiceIcon, color: '#17B26A' },
  { id: 'family', label: 'Family', icon: UserGroupIcon, color: '#7A5AF8' },
  { id: 'health', label: 'Health', icon: HealthIcon, color: '#2E90FA' },
  { id: 'work', label: 'Work', icon: Wallet03Icon, color: '#0E9384' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag01Icon, color: '#EE46BC' },
  { id: 'transportation', label: 'Transportation', icon: Car03Icon, color: '#F79009' },
  { id: 'self-care', label: 'Self Care', icon: HairDryerIcon, color: '#F670C7' },
  { id: 'housing', label: 'Housing', icon: House03Icon, color: '#6172F3' },
  { id: 'education', label: 'Education', icon: OnlineLearning01Icon, color: '#444CE7' },
];

export const INCOME_TYPES = [
  'Part Time',
  'Freelance',
  'Bonus',
  'Other',
] as const;

export const REPEAT_OPTIONS = ['Monthly', 'One-time'] as const;
