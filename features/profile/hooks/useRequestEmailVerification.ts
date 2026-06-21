import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userApi } from '../api/user.api';
import type { RequestEmailVerificationRequest } from '../types/user.types';

export const useRequestEmailVerification = () => {
  return useMutation<void, AxiosError, RequestEmailVerificationRequest>({
    mutationFn: (data) => userApi.requestEmailVerification(data),
  });
};
