import {
  hasAccessToken,
  isGuestMode,
  setGuestMode,
} from '@/features/auth/lib/app-session';
import { useFocusEffect } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { userApi } from '../api/user.api';
import type { UserProfile } from '../types/user.types';

export const PROFILE_QUERY_KEY = ['user', 'me'] as const;

async function resolveAuthState(): Promise<'authenticated' | 'guest'> {
  const hasToken = await hasAccessToken();

  if (hasToken) {
    const guest = await isGuestMode();
    if (guest) {
      await setGuestMode(false);
    }
    return 'authenticated';
  }

  return 'guest';
}

export const useProfile = () => {
  const [authState, setAuthState] = useState<
    'checking' | 'authenticated' | 'guest'
  >('checking');

  useFocusEffect(
    useCallback(() => {
      let active = true;

      resolveAuthState().then((next) => {
        if (active) setAuthState(next);
      });

      return () => {
        active = false;
      };
    }, []),
  );

  const query = useQuery<UserProfile, AxiosError>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => userApi.getMe(),
    enabled: authState === 'authenticated',
    refetchOnMount: 'always',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    ...query,
    isGuest: authState === 'guest',
    isAuthChecking: authState === 'checking',
    isLoading:
      authState === 'checking' ||
      (authState === 'authenticated' && query.isLoading),
  };
};
