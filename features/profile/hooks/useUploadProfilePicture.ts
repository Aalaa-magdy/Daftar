import { getApiErrorMessage } from '@/lib/api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { userApi } from '../api/user.api';
import type { UserProfile } from '../types/user.types';
import { PROFILE_QUERY_KEY, useProfile } from './useProfile';

function mergeProfileImage(profile: UserProfile, imageUrl: string): UserProfile {
  return { ...profile, profileImage: imageUrl };
}

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  const { mutate: upload, isPending } = useMutation({
    mutationFn: async (): Promise<UserProfile | null> => {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Please allow access to your photo library.',
        );
        throw new Error('Media library permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets[0]) {
        return null;
      }

      const asset = result.assets[0];
      const imageUrl = await userApi.uploadProfilePicture({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });

      const cached =
        queryClient.getQueryData<UserProfile>(PROFILE_QUERY_KEY) ?? profile;

      if (!cached) {
        const me = await userApi.getMe();
        return mergeProfileImage(me, imageUrl);
      }

      return mergeProfileImage(cached, imageUrl);
    },
    onSuccess: (updatedProfile) => {
      if (!updatedProfile) return;

      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
    },
    onError: (error: unknown) => {
      if (
        error instanceof Error &&
        error.message === 'Media library permission denied'
      ) {
        return;
      }

      const fallback =
        error instanceof Error && error.message
          ? error.message
          : 'Could not upload your profile picture. Please try again.';

      const errorMessage = getApiErrorMessage(error, fallback);

      console.error('[Profile Picture Upload Error]', {
        error,
        message: errorMessage,
      });

      Alert.alert('Upload Failed', errorMessage);
    },
  });

  return { upload, isPending };
};
