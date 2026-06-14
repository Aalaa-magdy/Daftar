import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authApi } from '@/features/auth/api/auth.api';
import {
  VerifyResetCodeRequest,
  VerifyResetCodeResponse,
} from '@/features/auth/types/auth.types';

export const useVerifyResetCode = () => {
  return useMutation<VerifyResetCodeResponse, AxiosError, VerifyResetCodeRequest>({
    mutationFn: (data) => authApi.verifyResetCode(data),
  });
};