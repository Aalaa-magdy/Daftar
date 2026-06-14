import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import {
  ResendResetCodeRequest,
  ResendResetCodeResponse,
} from '@/features/auth/types/auth.types';

export const useResendResetCode = () => {
  return useMutation<ResendResetCodeResponse, AxiosError, ResendResetCodeRequest>({
    mutationFn: (data) => authApi.resendResetCode(data),
  });
};