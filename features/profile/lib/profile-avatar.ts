export const FALLBACK_PROFILE_AVATAR = require('@/assets/images/profile.jpg');

export function resolveProfileAvatarSource(profilePicture?: string | null) {
  const url = profilePicture?.trim();

  if (url) {
    return { uri: url };
  }

  return FALLBACK_PROFILE_AVATAR;
}
