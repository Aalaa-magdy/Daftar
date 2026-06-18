import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RefreshTokenResponse } from '@/features/auth/types/auth.types';
import { clearAuthTokens, storeRefreshedTokens } from './auth-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

const refreshClient = axios.create({
  baseURL: API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let inFlightRefresh: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = (await AsyncStorage.getItem('refreshToken'))?.trim();

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const { data } = await refreshClient.post<RefreshTokenResponse>(
    '/auth/refresh',
    { refreshToken },
  );

  await storeRefreshedTokens(data);
  return data.accessToken;
}

/** Exchange the stored refresh token for a new access token (deduped if called concurrently). */
export async function refreshAccessToken(): Promise<string> {
  if (!inFlightRefresh) {
    inFlightRefresh = performRefresh().finally(() => {
      inFlightRefresh = null;
    });
  }

  return inFlightRefresh;
}

export async function handleRefreshFailure(): Promise<void> {
  await clearAuthTokens();
}

const AUTH_PATHS_WITHOUT_REFRESH = [
  '/auth/login',
  '/auth/signup',
  '/auth/refresh',
  '/auth/google',
  '/auth/forgot-password',
  '/auth/verify-reset-code',
  '/auth/reset-password',
  '/auth/resend-reset-code',
  '/auth/logout',
];

export function shouldSkipTokenRefresh(url: string | undefined): boolean {
  if (!url) return true;

  return AUTH_PATHS_WITHOUT_REFRESH.some((path) => url.includes(path));
}
