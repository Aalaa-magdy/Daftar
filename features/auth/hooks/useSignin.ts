import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import { storeAuthTokens } from '@/features/auth/lib/auth-storage';
import { AuthResponse, SigninRequest } from '@/features/auth/types/auth.types';

export const useSignin = () => {
  return useMutation<AuthResponse, AxiosError, SigninRequest>({
    mutationFn: (credentials) => authApi.signin(credentials),
    onSuccess: async (data) => {
      await storeAuthTokens(data);
    },
  });
};
