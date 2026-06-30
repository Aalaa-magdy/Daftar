import { hasAccessToken } from '@/features/auth/lib/app-session';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

export type AuthSessionState = 'checking' | 'authenticated' | 'unauthenticated';

async function resolveAuthState(): Promise<'authenticated' | 'unauthenticated'> {
  const hasToken = await hasAccessToken();
  return hasToken ? 'authenticated' : 'unauthenticated';
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
    isAuthChecking: authState === 'checking',
    isAuthenticated: authState === 'authenticated',
  };
}
