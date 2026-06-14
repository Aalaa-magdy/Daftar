import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import { storeAuthTokens } from '@/features/auth/lib/auth-storage';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/features/auth/types/auth.types';

export const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, AxiosError, RefreshTokenRequest>({
    mutationFn: (data) => authApi.refreshToken(data),
    onSuccess: async (data) => {
      // Re-use storeAuthTokens by casting — shape is identical to AuthSuccessResponse
      await storeAuthTokens(data);
    },
  });
};