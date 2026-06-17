import {
  hasAccessToken,
  isGuestMode,
  setGuestMode,
} from '@/features/auth/lib/app-session';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

export type AuthSessionState = 'checking' | 'authenticated' | 'guest';

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

/** Shared auth gate for API-backed hooks (profile, transactions, categories). */
export function useAuthenticatedSession() {
  const [authState, setAuthState] = useState<AuthSessionState>('checking');

  const refresh = useCallback(() => {
    let active = true;

    resolveAuthState().then((next) => {
      if (active) setAuthState(next);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => refresh(), [refresh]);

  useFocusEffect(
    useCallback(() => {
      return refresh();
    }, [refresh]),
  );

  return {
    authState,
    isGuest: authState === 'guest',
    isAuthChecking: authState === 'checking',
    isAuthenticated: authState === 'authenticated',
  };
}
