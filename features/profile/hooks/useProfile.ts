import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userApi } from '../api/user.api';
import type { UserProfile } from '../types/user.types';
import { profileKeys } from './query-keys';

export { PROFILE_QUERY_KEY, profileKeys } from './query-keys';

export const useProfile = () => {
  const { isAuthenticated, isAuthChecking } = useAuthenticatedSession();

  const query = useQuery<UserProfile, AxiosError>({
    queryKey: profileKeys.me,
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    ...query,
    data: isAuthenticated ? query.data : undefined,
    isAuthChecking,
    isLoading: isAuthChecking || (isAuthenticated && query.isLoading),
  };
};
