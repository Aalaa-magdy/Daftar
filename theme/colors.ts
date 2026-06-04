/**
 * App color tokens — import from `@/theme/colors` instead of hard-coding hex values.
 */
export const colors = {
  primary: '#1B5E20',
  white: '#FFFFFF',
  light:"#DDE7DE",
  background: '#F7FAF8',
  backgroundColor: '#F7FAF8',
  secondary:'#E8EFE9',
  black: '#081B0A',
  text: '#000000',
  textSecondary: '#717680',
  textGray:'#535862',
  green:"#17B26A",
  red:"#F04438",
  /** Muted caption (e.g. “Already have an account?”) — matches input placeholder tone */
  captionMuted: '#A4A7AE',
  textMuted: '#999999',
  border: '#E5E5E5',
  buttonSecondaryBg: '#F0F0F0',
  progressInactive: '#E0E0E0',
  /** Disabled primary actions (e.g. Continue before form is valid) */
  gray: '#D3D3D3',
} as const;

export type ColorKey = keyof typeof colors;
