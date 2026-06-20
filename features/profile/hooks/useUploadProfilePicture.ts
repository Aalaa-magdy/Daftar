import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userApi } from '../api/user.api';
import { invalidateProfileQueries } from '../lib/invalidate-profile-queries';
import type { ProfilePicturePickerAsset } from '../types/profile-picture.types';
import type { UserProfile } from '../types/user.types';
import { profileKeys } from './query-keys';

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, AxiosError, ProfilePicturePickerAsset>({
    mutationFn: (asset) => userApi.uploadProfilePicture(asset),
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKeys.me, profile);
      invalidateProfileQueries(queryClient);
    },
  });
};
