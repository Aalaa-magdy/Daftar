import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'onboardingCompleted';
const LEGACY_GUEST_MODE_KEY = 'isGuest';

export type AppInitialRoute = '/onboarding' | '/home' | '/signin';

export async function isOnboardingCompleted(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)) === 'true';
}

export async function setOnboardingCompleted(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
}

async function clearLegacyGuestMode(): Promise<void> {
  await AsyncStorage.removeItem(LEGACY_GUEST_MODE_KEY);
}

export async function hasAccessToken(): Promise<boolean> {
  const token = await AsyncStorage.getItem('accessToken');
  return Boolean(token?.trim());
}

/** Decide where to send the user on cold start. */
export async function resolveInitialRoute(): Promise<AppInitialRoute> {
  const [onboardingDone, hasToken] = await Promise.all([
    isOnboardingCompleted(),
    hasAccessToken(),
    clearLegacyGuestMode(),
  ]);

  if (!onboardingDone) return '/onboarding';
  if (hasToken) return '/home';
  return '/signin';
}
