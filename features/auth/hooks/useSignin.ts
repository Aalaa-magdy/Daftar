import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import { storeAuthTokens } from '@/features/auth/lib/auth-storage';
import { PROFILE_QUERY_KEY } from '@/features/profile/hooks/useProfile';
import { transactionKeys } from '@/features/transactions/hooks/query-keys';
import { AuthResponse, SigninRequest } from '@/features/auth/types/auth.types';

export const useSignin = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError, SigninRequest>({
    mutationFn: (credentials) => authApi.signin(credentials),
    onSuccess: async (data) => {
      await storeAuthTokens(data);
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
};