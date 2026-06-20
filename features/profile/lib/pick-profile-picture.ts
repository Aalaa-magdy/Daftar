import * as ImagePicker from 'expo-image-picker';
import type { ProfilePicturePickerAsset } from '../types/profile-picture.types';

export type PickProfilePictureResult =
  | { status: 'success'; asset: ProfilePicturePickerAsset }
  | { status: 'cancelled' }
  | { status: 'permission_denied' };

export async function pickProfilePicture(): Promise<PickProfilePictureResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return { status: 'permission_denied' };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.85,
  });

  if (result.canceled || !result.assets[0]) {
    return { status: 'cancelled' };
  }

  const asset = result.assets[0];

  return {
    status: 'success',
    asset: {
      uri: asset.uri,
      mimeType: asset.mimeType,
      fileName: asset.fileName,
    },
  };
}
