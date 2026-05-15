import { colors } from '@/theme/colors'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface Props {
  title: string;
  onPress?: () => void;
}

const Button = ({ title, onPress }: Props) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.primaryButton}
      activeOpacity={0.8}
      onPress={onPress}
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
    primaryButtonText: {
        fontSize: 16,
        fontFamily: 'Changa_500Medium',
        lineHeight: 40,
        color: colors.white,
        
    }
})

export default Button