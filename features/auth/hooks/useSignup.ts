import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import { storeAuthTokens } from '@/features/auth/lib/auth-storage';
import { AuthResponse, SignupRequest } from '@/features/auth/types/auth.types';

export const useSignup = () => {
  return useMutation<AuthResponse, AxiosError, SignupRequest>({
    mutationFn: (userData) => authApi.signup(userData),
    onSuccess: async (data) => {
      await storeAuthTokens(data);
    },
  });
};
