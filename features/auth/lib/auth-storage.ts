import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthResponse,
  isAuthSuccess,
  type RefreshTokenResponse,
} from '@/features/auth/types/auth.types';
import { setGuestMode, setOnboardingCompleted } from './app-session';

export async function storeAuthTokens(data: AuthResponse): Promise<void> {
  if (!isAuthSuccess(data)) return;
  await AsyncStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) {
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
  }
  await setGuestMode(false);
  await setOnboardingCompleted();
}

export async function storeRefreshedTokens(
  data: RefreshTokenResponse,
): Promise<void> {
  await AsyncStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) {
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
  }
}

export async function clearAuthTokens(): Promise<void> {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
}