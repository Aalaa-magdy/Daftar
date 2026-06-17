import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userApi } from '../api/user.api';
import type { UserProfile } from '../types/user.types';

export const PROFILE_QUERY_KEY = ['user', 'me'] as const;

export const useProfile = () => {
  const { isAuthenticated, isGuest, isAuthChecking } =
    useAuthenticatedSession();

  const query = useQuery<UserProfile, AxiosError>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    ...query,
    data: isAuthenticated ? query.data : undefined,
    isGuest,
    isAuthChecking,
    isLoading:
      isAuthChecking || (isAuthenticated && query.isLoading),
  };
};
