import { Platform } from 'react-native';
import type { ProfilePicturePickerAsset } from '../types/profile-picture.types';

/** NestJS FileInterceptor fields seen for POST /users/profile-picture */
export const PROFILE_PICTURE_FORM_FIELDS = ['profilePicture', 'file'] as const;

export type ProfilePictureFormField =
  (typeof PROFILE_PICTURE_FORM_FIELDS)[number];

function normalizeUploadUri(uri: string): string {
  if (Platform.OS === 'ios') {
    return uri.replace('file://', '');
  }

  return uri;
}

function resolveMimeType(asset: ProfilePicturePickerAsset): string {
  if (asset.mimeType?.trim()) {
    return asset.mimeType.trim();
  }

  const lowerUri = asset.uri.toLowerCase();
  if (lowerUri.endsWith('.png')) return 'image/png';
  if (lowerUri.endsWith('.webp')) return 'image/webp';
  if (lowerUri.endsWith('.heic')) return 'image/heic';

  return 'image/jpeg';
}

function resolveFileName(asset: ProfilePicturePickerAsset, mimeType: string): string {
  if (asset.fileName?.trim()) {
    return asset.fileName.trim();
  }

  const extension = mimeType.split('/')[1] ?? 'jpg';
  return `profile-${Date.now()}.${extension}`;
}

export function buildProfilePictureFormData(
  asset: ProfilePicturePickerAsset,
  field: ProfilePictureFormField = PROFILE_PICTURE_FORM_FIELDS[0],
): FormData {
  const formData = new FormData();
  const mimeType = resolveMimeType(asset);
  const fileName = resolveFileName(asset, mimeType);

  formData.append(field, {
    uri: normalizeUploadUri(asset.uri),
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return formData;
}
