import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { hasAccessToken, isGuestMode } from '@/features/auth/lib/app-session';
import { categoriesApi } from '@/features/categories/api/categories.api';
import { Category } from '@/features/categories/types/categories.types';
import { categoryKeys } from './query-keys';

export const useCategories = () => {
  const [sessionState, setSessionState] = useState<
    'checking' | 'ready' | 'auth-required'
  >('checking');

  useEffect(() => {
    Promise.all([hasAccessToken(), isGuestMode()]).then(([hasToken, guest]) => {
      setSessionState(hasToken && !guest ? 'ready' : 'auth-required');
    });
  }, []);

  const query = useQuery<Category[], AxiosError>({
    queryKey: categoryKeys.all,
    queryFn: () => categoriesApi.list(),
    enabled: sessionState === 'ready',
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 1,
  });

  return {
    ...query,
    sessionState,
    isAuthRequired: sessionState === 'auth-required',
    isLoading: sessionState === 'checking' || query.isLoading,
    isError: sessionState === 'auth-required' || query.isError,
  };
};
