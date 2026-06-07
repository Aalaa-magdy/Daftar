import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  applyLayoutDirection,
  resolveInitialLanguage,
  type AppLanguage,
} from '@/lib/language';

const resources = {
  en: {
    translation: require('@/locals/en.json'),
  },
  ar: {
    translation: require('@/locals/ar.json'),
  },
};

let initPromise: Promise<typeof i18n> | null = null;

export async function initI18n() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const language = await resolveInitialLanguage();
    applyLayoutDirection(language);

    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        resources,
        lng: language,
        fallbackLng: 'en',
        compatibilityJSON: 'v4',
        interpolation: {
          escapeValue: false,
        },
      });
    } else {
      await i18n.changeLanguage(language);
    }

    return i18n;
  })();

  return initPromise;
}

export async function changeAppLanguage(language: AppLanguage) {
  await i18n.changeLanguage(language);

  const { persistLanguage } = await import('@/lib/language');
  await persistLanguage(language);
}

export default i18n;
