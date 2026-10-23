import { forwardRef } from "react";
import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from "react-native";
import { useTranslation } from "react-i18next";

// Changa weight -> IBM Plex Sans Arabic weight (Plex goes up to 700 only)
const ARABIC_FONT_MAP: Record<string, string> = {
  Changa_200ExtraLight: "IBMPlexSansArabic_500Medium",
  Changa_300Light: "IBMPlexSansArabic_500Medium",
  Changa_400Regular: "IBMPlexSansArabic_600SemiBold",
  Changa_500Medium: "IBMPlexSansArabic_700Bold",
  Changa_600SemiBold: "IBMPlexSansArabic_700Bold",
  Changa_700Bold: "IBMPlexSansArabic_700Bold",
  Changa_800ExtraBold: "IBMPlexSansArabic_700Bold",
};

const useLocalizedStyle = (style: StyleProp<TextStyle>) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar") ?? false;
  if (!isArabic) return style;

  const flat = StyleSheet.flatten(style) ?? {};
  const override: TextStyle = {};

  const mapped = flat.fontFamily && ARABIC_FONT_MAP[flat.fontFamily];
  if (mapped) override.fontFamily = mapped;

  // Letter spacing breaks the connection between Arabic letters
  if (flat.letterSpacing) override.letterSpacing = 0;

  return Object.keys(override).length ? [style, override] : style;
};

export const Text = forwardRef<RNText, TextProps>(({ style, ...props }, ref) => (
  <RNText ref={ref} {...props} style={useLocalizedStyle(style)} />
));
Text.displayName = "Text";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ style, ...props }, ref) => (
    <RNTextInput ref={ref} {...props} style={useLocalizedStyle(style)} />
  ),
);
TextInput.displayName = "TextInput";