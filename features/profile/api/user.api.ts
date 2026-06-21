import { apiClient } from '@/lib/axios';
import { buildProfilePictureFormData } from '../lib/build-profile-picture-form-data';
import { readProfilePictureUrl, unwrapUserResponse } from '../lib/normalize-user';
import type { ProfilePicturePickerAsset } from '../types/profile-picture.types';
import type { UserProfile } from '../types/user.types';

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<unknown>('/users/me');
    return unwrapUserResponse(response.data);
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },

  /**
   * POST /users/profile-picture
   * Swagger: multipart field `file` → { imageUrl: string }
   */
  uploadProfilePicture: async (
    asset: ProfilePicturePickerAsset,
  ): Promise<string> => {
    const formData = buildProfilePictureFormData(asset);

    const response = await apiClient.post<unknown>(
      '/users/profile-picture',
      formData,
      { timeout: 60_000 },
    );

    const imageUrl = readProfilePictureUrl(response.data);
    if (!imageUrl) {
      throw new Error('Upload succeeded but imageUrl was missing from the response');
    }

    return imageUrl;
  },
};
