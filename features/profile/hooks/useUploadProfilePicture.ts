import { getApiErrorMessage } from "@/lib/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { userApi } from "../api/user.api";
import { resolveProfilePictureUploadResult } from "../lib/resolve-profile-picture-upload";
import { PROFILE_QUERY_KEY, useProfile } from "./useProfile";

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();

  const { mutate: upload, isPending } = useMutation({
    mutationFn: async () => {
      // 1. Request permission
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Please allow access to your photo library.",
        );
        throw new Error("Media library permission denied");
      }

      // 2. Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets[0]) {
        throw new Error("Image selection cancelled");
      }

      const uri = result.assets[0].uri;

      // 3. Upload and get response
      const responseData = await userApi.uploadProfilePicture(uri);

      // 4. Resolve the profile picture from response or refetch
      const updatedProfile = await resolveProfilePictureUploadResult(
        responseData,
        () => userApi.getMe(),
      );

      return updatedProfile;
    },
    onSuccess: (updatedProfile) => {
      // Update the cache with the new profile data
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);

      // Also refetch to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = getApiErrorMessage(
        error,
        "Could not upload your profile picture. Please try again.",
      );

      // Log detailed error for debugging
      console.error("[Profile Picture Upload Error]", {
        error,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });

      Alert.alert("Upload Failed", errorMessage);
    },
  });

  return { upload, isPending };
};
