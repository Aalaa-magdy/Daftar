import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from '@/features/auth/types/auth.types';

export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, AxiosError, ForgotPasswordRequest>({
    mutationFn: (data) => authApi.forgotPassword(data),
  });
};