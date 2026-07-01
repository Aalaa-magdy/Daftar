export type DefaultCategoryDefinition = {
  /** i18n key under `transaction.categories.*` */
  nameKey: string;
  faIcon: string;
  color: string;
};

/** Default expense categories shown for new users (matches app design). */
export const DEFAULT_CATEGORY_DEFINITIONS: DefaultCategoryDefinition[] = [
  { nameKey: 'food', faIcon: 'fa-solid fa-utensils', color: '#F04438' },
  {
    nameKey: 'bills',
    faIcon: 'fa-solid fa-file-invoice-dollar',
    color: '#17B26A',
  },
  { nameKey: 'family', faIcon: 'fa-solid fa-users', color: '#7A5AF8' },
  { nameKey: 'health', faIcon: 'fa-solid fa-heart-pulse', color: '#F04438' },
  { nameKey: 'work', faIcon: 'fa-solid fa-wallet', color: '#C9A227' },
  {
    nameKey: 'shopping',
    faIcon: 'fa-solid fa-bag-shopping',
    color: '#7A5AF8',
  },
  { nameKey: 'transportation', faIcon: 'fa-solid fa-car', color: '#F79009' },
  {
    nameKey: 'selfCare',
    faIcon: 'fa-solid fa-spray-can-sparkles',
    color: '#F670C7',
  },
  { nameKey: 'housing', faIcon: 'fa-solid fa-house', color: '#C9A227' },
  {
    nameKey: 'education',
    faIcon: 'fa-solid fa-chalkboard-user',
    color: '#1B5E20',
  },
];
