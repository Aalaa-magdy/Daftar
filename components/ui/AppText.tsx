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

const mapFamily = (family: string) =>
  family === "Changa_800ExtraBold"
    ? "IBMPlexSansArabic_900Bold" // Plex Arabic has no 800 weight
    : family.replace("Changa_", "IBMPlexSansArabic_");

const useLocalizedStyle = (style: StyleProp<TextStyle>) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar") ?? false;
  if (!isArabic) return style;

  const flat = StyleSheet.flatten(style) ?? {};
  const override: TextStyle = {};

  if (flat.fontFamily?.startsWith("Changa_")) {
    override.fontFamily = mapFamily(flat.fontFamily);
  }
  // Letter spacing breaks the connection between Arabic letters
  if (flat.letterSpacing) {
    override.letterSpacing = 0;
  }

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