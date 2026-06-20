export const profileKeys = {
  me: ['user', 'me'] as const,
};

/** @deprecated Use `profileKeys.me` */
export const PROFILE_QUERY_KEY = profileKeys.me;
