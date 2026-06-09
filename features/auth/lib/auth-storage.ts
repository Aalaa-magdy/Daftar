import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, isAuthSuccess } from '@/features/auth/types/auth.types';

export async function storeAuthTokens(data: AuthResponse): Promise<void> {
  if (!isAuthSuccess(data)) return;
  await AsyncStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) {
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
  }
}

export async function clearAuthTokens(): Promise<void> {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
}