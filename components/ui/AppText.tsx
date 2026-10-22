import { forwardRef } from "react";
import {
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
} from "react-native";
import { useTranslation } from "react-i18next";

const mapFamily = (family: string | undefined, isArabic: boolean) => {
  if (!isArabic || !family?.startsWith("Changa_")) return family;
  if (family === "Changa_800ExtraBold") return "IBMPlexSansArabic_800Bold";
  return family.replace("Changa_", "IBMPlexSansArabic_");
};

const useResolvedStyle = (style: TextProps["style"]) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar") ?? false;
  const family = StyleSheet.flatten(style)?.fontFamily;
  const mapped = mapFamily(family, isArabic);
  return mapped === family ? style : [style, { fontFamily: mapped }];
};

export const Text = forwardRef<RNText, TextProps>(({ style, ...props }, ref) => (
  <RNText ref={ref} {...props} style={useResolvedStyle(style)} />
));
Text.displayName = "Text";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ style, ...props }, ref) => (
    <RNTextInput ref={ref} {...props} style={useResolvedStyle(style)} />
  ),
);
TextInput.displayName = "TextInput";