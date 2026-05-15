import { colors } from '@/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

/** Full-width centered row (e.g. Continue as guest) vs inline next to caption (e.g. Sign in). */
export type TextLinkButtonVariant = 'block' | 'inline';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: TextLinkButtonVariant;
}

const TextLinkButton = ({ title, onPress, variant = 'block' }: Props) => {
  return (
    <TouchableOpacity
      accessibilityRole="link"
      style={variant === 'block' ? styles.wrapBlock : styles.wrapInline}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        style={[styles.text, variant === 'block' && styles.textBlockCenter]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapBlock: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  wrapInline: {
    marginLeft: 4,
    paddingVertical: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Changa_500Medium',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  textBlockCenter: {
    textAlign: 'center',
  },
});

export default TextLinkButton;
