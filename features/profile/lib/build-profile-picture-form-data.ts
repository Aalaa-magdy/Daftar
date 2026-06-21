import { Platform } from 'react-native';
import type { ProfilePicturePickerAsset } from '../types/profile-picture.types';

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

function resolveUploadUri(uri: string): string {
  if (Platform.OS === 'ios') {
    return uri.replace('file://', '');
  }

  return uri;
}

/** Builds multipart body for POST /users/profile-picture (field name: `file`). */
export function buildProfilePictureFormData(
  asset: ProfilePicturePickerAsset,
): FormData {
  const mimeType = resolveMimeType(asset);
  const fileName = resolveFileName(asset, mimeType);
  const formData = new FormData();

  formData.append('file', {
    uri: resolveUploadUri(asset.uri),
    name: fileName,
    type: mimeType,
  } as unknown as Blob);

  return formData;
}
