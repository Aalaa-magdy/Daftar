import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth.api';
import type { ChangePasswordRequest, ChangePasswordResponse } from '../types/auth.types';

export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, AxiosError, ChangePasswordRequest>({
    mutationFn: (data) => authApi.changePassword(data),
  });
};
