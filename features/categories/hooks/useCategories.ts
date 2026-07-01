import { useAuthenticatedSession } from '@/features/auth/hooks/useAuthenticatedSession';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { categoriesApi } from '@/features/categories/api/categories.api';
import { Category } from '@/features/categories/types/categories.types';
import { useSeedDefaultCategories } from './useSeedDefaultCategories';
import { categoryKeys } from './query-keys';

export const useCategories = () => {
  const { isAuthenticated, isAuthChecking } = useAuthenticatedSession();

  const query = useQuery<Category[], AxiosError>({
    queryKey: categoryKeys.all,
    queryFn: () => categoriesApi.list(),
    enabled: isAuthenticated,
    refetchOnMount: 'always',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  const { isSeeding } = useSeedDefaultCategories({
    categories: query.data,
    isSuccess: query.isSuccess,
    isAuthenticated,
  });

  return {
    ...query,
    isAuthChecking,
    isAuthRequired: !isAuthChecking && !isAuthenticated,
    isLoading:
      isAuthChecking ||
      (isAuthenticated && (query.isLoading || isSeeding)),
    isSeeding,
    isError: query.isError,
  };
};
