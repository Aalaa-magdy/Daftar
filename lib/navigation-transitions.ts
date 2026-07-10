import { colors } from '@/theme/colors';

/** Instant screen changes — matches tab bar feel (home / history / statistics / profile). */
export const seamlessScreenOptions = {
  headerShown: false,
  animation: 'none' as const,
  gestureEnabled: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

export const authFlowScreenOptions = {
  ...seamlessScreenOptions,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

export const tabsScreenOptions = {
  ...seamlessScreenOptions,
  contentStyle: {
    backgroundColor: colors.backgroundColor,
  },
};

export const profileScreenOptions = {
  ...seamlessScreenOptions,
  contentStyle: {
    backgroundColor: colors.white,
  },
};

// Keep aliases for any existing imports.
export const rootFadeScreenOptions = tabsScreenOptions;
export const rootScreenOptions = seamlessScreenOptions;
