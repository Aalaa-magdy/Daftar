/**
 * App color tokens — import from `@/theme/colors` instead of hard-coding hex values.
 */
export const colors = {
  primary: '#1B5E20',
  white: '#FFFFFF',
  secondary:'#E8EFE9',
  black: '#081B0A',
  text: '#000000',
  textSecondary: '#717680',
  textGray:'#535862',
  textMuted: '#999999',
  border: '#E5E5E5',
  buttonSecondaryBg: '#F0F0F0',
  progressInactive: '#E0E0E0',
} as const;

export type ColorKey = keyof typeof colors;
