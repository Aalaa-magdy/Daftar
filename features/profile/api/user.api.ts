import { apiClient } from '@/lib/axios';
import { AxiosError } from 'axios';
import {
  buildProfilePictureFormData,
  PROFILE_PICTURE_FORM_FIELDS,
} from '../lib/build-profile-picture-form-data';
import { unwrapUserResponse } from '../lib/normalize-user';
import { resolveProfilePictureUploadResult } from '../lib/resolve-profile-picture-upload';
import type { ProfilePicturePickerAsset } from '../types/profile-picture.types';
import type { UserProfile } from '../types/user.types';

async function postProfilePictureFormData(formData: FormData) {
  return apiClient.post<unknown>('/users/profile-picture', formData, {
    timeout: 60000,
  });
}

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<unknown>('/users/me');
    return unwrapUserResponse(response.data);
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },

  uploadProfilePicture: async (
    asset: ProfilePicturePickerAsset,
  ): Promise<UserProfile> => {
    let lastError: unknown;

    for (const field of PROFILE_PICTURE_FORM_FIELDS) {
      try {
        const formData = buildProfilePictureFormData(asset, field);
        const response = await postProfilePictureFormData(formData);
        return resolveProfilePictureUploadResult(response.data, userApi.getMe);
      } catch (error) {
        lastError = error;

        const shouldRetry =
          error instanceof AxiosError &&
          (error.response?.status === 400 ||
            error.response?.status === 422) &&
          field !== PROFILE_PICTURE_FORM_FIELDS.at(-1);

        if (!shouldRetry) {
          throw error;
        }
      }
    }

    throw lastError;
  },
};
