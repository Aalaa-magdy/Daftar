import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

export const LANGUAGE_STORAGE_KEY = '@daftr/language';

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return value === 'en' || value === 'ar';
}

export function getDeviceLanguage(): AppLanguage {
  const deviceCode = Localization.getLocales()[0]?.languageCode?.toLowerCase();
  return deviceCode === 'ar' ? 'ar' : 'en';
}

export async function getStoredLanguage(): Promise<AppLanguage | null> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isAppLanguage(stored) ? stored : null;
}

export async function resolveInitialLanguage(): Promise<AppLanguage> {
  const stored = await getStoredLanguage();
  if (stored) {
    return stored;
  }

  return getDeviceLanguage();
}


export async function persistLanguage(language: AppLanguage) {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}
