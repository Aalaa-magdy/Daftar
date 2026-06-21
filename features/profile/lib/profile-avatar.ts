export const FALLBACK_PROFILE_AVATAR = require('@/assets/images/profile.jpg');

export function resolveProfileAvatarSource(profileImage?: string | null) {
  const url = profileImage?.trim();

  if (url) {
    return { uri: url };
  }

  return FALLBACK_PROFILE_AVATAR;
}
