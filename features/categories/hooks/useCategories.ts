import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { categoriesApi } from '@/features/categories/api/categories.api';
import { Category } from '@/features/categories/types/categories.types';
import { categoryKeys } from './query-keys';

export const useCategories = () => {
  const { isAuthenticated, isGuest, isAuthChecking } =
    useAuthenticatedSession();

  const query = useQuery<Category[], AxiosError>({
    queryKey: categoryKeys.all,
    queryFn: () => categoriesApi.list(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    ...query,
    isGuest,
    isAuthChecking,
    isAuthRequired: isGuest,
    isLoading: isAuthChecking || (isAuthenticated && query.isLoading),
    isError: isGuest || query.isError,
  };
};
