import { colors } from '@/theme/colors'
import GoogleLogo from '@/assets/images/goggle.svg'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface Props {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
}

const GoogleButton = ({ title, onPress, disabled = false }: Props) => {
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
      <GoogleLogo width={20} height={20} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    primaryButton: {
        width: '100%',
        backgroundColor: colors.secondary,
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    primaryButtonDisabled: {
        opacity: 0.6,
    },
    primaryButtonText: {
        fontSize: 16,
        fontFamily: 'Changa_500Medium',
        lineHeight: 24,
        color: colors.primary,
    }
})

export default GoogleButton