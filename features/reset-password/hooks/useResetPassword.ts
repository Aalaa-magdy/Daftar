import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import {
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/features/auth/types/auth.types';

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, AxiosError, ResetPasswordRequest>({
    mutationFn: (data) => authApi.resetPassword(data),
  });
};