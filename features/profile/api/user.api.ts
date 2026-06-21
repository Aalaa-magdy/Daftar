import { apiClient } from '@/lib/axios';
import { Platform } from 'react-native';
import { readProfilePictureUrl, unwrapUserResponse } from '../lib/normalize-user';
import type { ProfilePicturePickerAsset, UpdateProfileRequest, UserProfile } from '../types/user.types';

function resolveMimeType(asset: ProfilePicturePickerAsset): string {
  if (asset.mimeType?.trim()) {
    return asset.mimeType.trim();
  }

  const lowerUri = asset.uri.toLowerCase();
  if (lowerUri.includes('.png')) return 'image/png';
  if (lowerUri.includes('.webp')) return 'image/webp';
  if (lowerUri.includes('.heic')) return 'image/heic';

  return 'image/jpeg';
}

function resolveFileName(asset: ProfilePicturePickerAsset, mimeType: string): string {
  if (asset.fileName?.trim()) {
    return asset.fileName.trim();
  }

  const extension = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
  return `profile.${extension}`;
}

function buildProfilePictureFormData(asset: ProfilePicturePickerAsset): FormData {
  const mimeType = resolveMimeType(asset);
  const fileName = resolveFileName(asset, mimeType);
  const uri =
    Platform.OS === 'ios' ? asset.uri.replace('file://', '') : asset.uri;

  const formData = new FormData();
  formData.append('file', {
    uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return formData;
}

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<unknown>('/users/me');
    return unwrapUserResponse(response.data);
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },

  updateMe: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.patch<unknown>('/users/me', data);
    return unwrapUserResponse(response.data);
  },

  /** POST /users/profile-picture — multipart field `file` → { imageUrl } */
  uploadProfilePicture: async (
    asset: ProfilePicturePickerAsset,
  ): Promise<string> => {
    const response = await apiClient.post<unknown>(
      '/users/profile-picture',
      buildProfilePictureFormData(asset),
      { timeout: 60_000 },
    );

    const imageUrl = readProfilePictureUrl(response.data);
    if (!imageUrl) {
      throw new Error('Upload succeeded but imageUrl was missing from the response');
    }

    return imageUrl;
  },
};
