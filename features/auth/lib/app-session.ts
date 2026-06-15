import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = 'onboardingCompleted';
const GUEST_MODE_KEY = 'isGuest';

export type AppInitialRoute = '/onboarding' | '/home' | '/signin';

export async function isOnboardingCompleted(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)) === 'true';
}

export async function setOnboardingCompleted(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
}

export async function isGuestMode(): Promise<boolean> {
  return (await AsyncStorage.getItem(GUEST_MODE_KEY)) === 'true';
}

export async function setGuestMode(enabled: boolean): Promise<void> {
  if (enabled) {
    await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
  } else {
    await AsyncStorage.removeItem(GUEST_MODE_KEY);
  }
}

export async function hasAccessToken(): Promise<boolean> {
  const token = await AsyncStorage.getItem('accessToken');
  return Boolean(token?.trim());
}

/** Decide where to send the user on cold start. */
export async function resolveInitialRoute(): Promise<AppInitialRoute> {
  const [onboardingDone, hasToken, guest] = await Promise.all([
    isOnboardingCompleted(),
    hasAccessToken(),
    isGuestMode(),
  ]);

  if (!onboardingDone) return '/onboarding';
  if (hasToken || guest) return '/home';
  return '/signin';
}
