export type LanguageId = 'en' | 'ar';

export type LanguageOption = {
  id: LanguageId;
  label: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'Arabic' },
];
