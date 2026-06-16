import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import { storeAuthTokens } from '@/features/auth/lib/auth-storage';
import { PROFILE_QUERY_KEY } from '@/features/profile/hooks/useProfile';
import { AuthResponse, SignupRequest } from '@/features/auth/types/auth.types';

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, AxiosError, SignupRequest>({
    mutationFn: (userData) => authApi.signup(userData),
    onSuccess: async (data) => {
      await storeAuthTokens(data);
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};