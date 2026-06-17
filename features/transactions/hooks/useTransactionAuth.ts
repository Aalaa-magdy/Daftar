import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';

export function useTransactionAuth() {
  return useAuthenticatedSession();
}
