import { colors } from '@/theme/colors';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDirection } from '@/hooks/useAppDirection';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text, TextInput } from "@/components/ui/AppText";

/** Leading/trailing icons + placeholder (unfocused) — tweak only here. */
const INPUT_MUTED = '#A4A7AE';
const INPUT_ERROR = 'red';

function withInputIconColor(
  node: React.ReactNode,
  hasError: boolean,
): React.ReactNode {
  if (node == null || !React.isValidElement(node)) return node;
  return React.cloneElement(node as React.ReactElement<{ color?: string }>, {
    color: hasError ? INPUT_ERROR : INPUT_MUTED,
  });
}

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  invalid?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  multiline?: boolean;
  /** When false, field is display-only (e.g. opens a date picker on press). */
  editable?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  invalid = false,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  multiline = false,
  editable = true,
}) => {
  const { t } = useTranslation();
  const { isRTL, writingDirection } = useAppDirection();
  const [isFocused, setIsFocused] = useState(false);
  const hasText = Boolean(value && value.length > 0);

  /** TextInput uses physical alignment — it does not mirror like Text under direction: rtl. */
  const inputTextAlign = isRTL ? 'right' : 'left';

  /** Unfocused + empty: align typed `color` with placeholder so Android does not tint hint wrong vs icons. */
  const useMutedTextColor = !isFocused && !hasText;
  const hasError = Boolean(error) || invalid;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text
          style={[
            styles.label,
            { textAlign: inputTextAlign, writingDirection },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWrapper,
          { direction: isRTL ? 'rtl' : 'ltr' },
          isFocused && !hasError && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
          !editable && styles.inputWrapperReadOnly,
        ]}
        pointerEvents={editable ? 'auto' : 'box-none'}
      >
        {icon ? (
          <View style={styles.leadingIcon}>
            {withInputIconColor(icon, hasError)}
          </View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            hasError && hasText
              ? styles.inputTextError
              : useMutedTextColor
                ? styles.inputTextMuted
                : styles.inputTextTyped,
            icon ? styles.inputWithLeadingIcon : null,
            rightIcon ? styles.inputWithTrailingIcon : null,
            { textAlign: inputTextAlign, writingDirection },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={INPUT_MUTED}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
          focusable={editable}
          pointerEvents={editable ? 'auto' : 'none'}
          showSoftInputOnFocus={editable}
          caretHidden={!editable}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {rightIcon ? (
          <TouchableOpacity
            style={styles.trailingIcon}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.togglePasswordVisibility')}
          >
            {withInputIconColor(rightIcon, hasError)}
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <View style={styles.errorIconCircle}>
            <Text style={styles.errorIconMark}>i</Text>
          </View>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    width: '100%',
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  inputWrapper: {
    width: '100%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  inputWrapperError: {
    borderColor: 'red',
  },
  inputWrapperReadOnly: {
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    minHeight: 48,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: Platform.OS === 'android' ? 10 : 12,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Changa_400Regular',
    color: colors.black,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
  inputTextMuted: {
    color: INPUT_MUTED,
  },
  inputTextTyped: {
    color: colors.black,
  },
  inputTextError: {
    color: INPUT_ERROR,
  },
  inputWithLeadingIcon: {
    paddingStart: 8,
    paddingEnd: 12,
  },
  inputWithTrailingIcon: {
    paddingEnd: 8,
    paddingStart: 12,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  leadingIcon: {
    paddingStart: 16,
    paddingEnd: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailingIcon: {
    paddingEnd: 16,
    paddingStart: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  errorIconCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: INPUT_ERROR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIconMark: {
    fontSize: 10,
    fontWeight: '700',
    color: INPUT_ERROR,
    lineHeight: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: INPUT_ERROR,
    fontFamily: 'Changa_400Regular',
  },
});

export default Input;
