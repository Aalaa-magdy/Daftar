import { apiClient } from "@/lib/axios";
import type { UserProfile } from "../types/user.types";

export const userApi = {
  getMe: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>("/users/me");
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await apiClient.delete("/users/me");
  },

  uploadProfilePicture: async (uri: string): Promise<unknown> => {
    const extension = uri.split(".").pop()?.toLowerCase() ?? "jpg";
    const mimeType =
      extension === "png"
        ? "image/png"
        : extension === "webp"
          ? "image/webp"
          : "image/jpeg";

    const formData = new FormData();
    formData.append("file", {
      uri: uri.replace("file://", ""),
      name: `profile.${extension}`,
      type: mimeType,
    } as unknown as Blob);

    const response = await apiClient.post<unknown>(
      "/users/profile-picture",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000,
      },
    );

    return response.data;
  },
};
