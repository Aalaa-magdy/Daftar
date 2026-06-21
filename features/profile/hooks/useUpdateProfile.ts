import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userApi } from '../api/user.api';
import type { UpdateProfileRequest, UserProfile } from '../types/user.types';
import { profileKeys } from './query-keys';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, AxiosError, UpdateProfileRequest>({
    mutationFn: (data) => userApi.updateMe(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.me, profile);
    },
  });
};
