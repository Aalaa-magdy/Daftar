import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

/** Redirects unauthenticated users to sign-in. Use on protected screens. */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, isAuthChecking } = useAuthenticatedSession();

  useEffect(() => {
    if (!isAuthChecking && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthenticated, isAuthChecking, router]);

  return { isAuthenticated, isAuthChecking };
}
