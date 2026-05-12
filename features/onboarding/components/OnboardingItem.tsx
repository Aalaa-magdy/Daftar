import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter, type Href } from 'expo-router';
import SoloLogo from '@/assets/images/SoloLogo.svg';
import { colors } from '@/theme/colors';
import type { OnboardingItemType } from '../data/onboardingData';

const { width } = Dimensions.get('window');

interface Props {
  item: OnboardingItemType;
  isAuthLayout: boolean;
}

const OnboardingItem: React.FC<Props> = ({ item, isAuthLayout }) => {
  const router = useRouter();

 

  return (
     <View>
      
     </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  introBody: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 140,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 28,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  introTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.text,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  authBody: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  authLogo: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.buttonSecondaryBg,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 12,
  },
  googleMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: colors.white,
  },
  outlineButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  guestLinkWrap: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 8,
  },
  guestLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default OnboardingItem;
