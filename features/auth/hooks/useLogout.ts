import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import { clearAuthTokens } from '@/features/auth/lib/auth-storage';
import { setGuestMode } from '@/features/auth/lib/app-session';
import { LogoutResponse } from '@/features/auth/types/auth.types';

async function clearLocalSession() {
  await clearAuthTokens();
  await setGuestMode(false);
}

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, AxiosError, void>({
    mutationFn: async () => {
      const refreshToken = (await AsyncStorage.getItem('refreshToken'))?.trim();

      try {
        return await authApi.logout(
          refreshToken ? { refreshToken } : undefined,
        );
      } catch (error) {
        // Still sign out locally if the server request fails.
        await clearLocalSession();
        queryClient.clear();
        throw error;
      }
    },
    onSuccess: async () => {
      await clearLocalSession();
      queryClient.clear();
    },
  });
};
