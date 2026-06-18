import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { refreshAccessToken } from '@/features/auth/lib/token-refresh';
import { RefreshTokenRequest } from '@/features/auth/types/auth.types';

export const useRefreshToken = () => {
  return useMutation<string, AxiosError, RefreshTokenRequest>({
    mutationFn: async () => refreshAccessToken(),
  });
};
