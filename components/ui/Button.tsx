import { colors } from '@/theme/colors'
import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/ui/AppText";

interface Props {
  title: string;
  onPress?: () => void;
  /** When true, uses colors.gray and blocks press */
  disabled?: boolean;
}

const Button = ({ title, onPress, disabled = false }: Props) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={[
        styles.primaryButton,
        disabled ? styles.primaryButtonDisabled : null,
      ]}
      activeOpacity={0.8}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    primaryButton: {
        width: '100%',
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonDisabled: {
        backgroundColor: colors.gray,
    },
    primaryButtonText: {
        fontSize: 16,
        fontFamily: 'Changa_500Medium',
        lineHeight: 20,
        color: colors.white,
    }
})

export default Button