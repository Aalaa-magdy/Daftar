import { clearAuthTokens } from '@/features/auth/lib/auth-storage';
import { setGuestMode } from '@/features/auth/lib/app-session';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userApi } from '../api/user.api';

async function clearLocalSession() {
  await clearAuthTokens();
  await setGuestMode(false);
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, void>({
    mutationFn: () => userApi.deleteAccount(),
    onSuccess: async () => {
      await clearLocalSession();
      queryClient.clear();
    },
  });
};
