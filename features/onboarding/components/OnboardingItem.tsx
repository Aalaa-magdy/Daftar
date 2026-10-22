import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import React from 'react';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import type { OnboardingItemType } from '../data/onboardingData';
import { useTranslation } from 'react-i18next';
import { useAppDirection } from '@/hooks/useAppDirection';

interface Props {
  item: OnboardingItemType;
  width: number;
}

const OnboardingItem: React.FC<Props> = ({ item, width }) => {
  const { t } = useTranslation();
  const { isRTL, writingDirection } = useAppDirection();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.textBlock}>
        <Text
          style={[
            styles.title,
            {
              textAlign: isRTL ? 'right' : 'left',
              writingDirection,
            },
          ]}
        >
          {t(item.titleKey)}
        </Text>
        <Text
          style={[
            styles.description,
            {
              textAlign: isRTL ? 'right' : 'left',
              writingDirection,
            },
          ]}
        >
          {t(item.descriptionKey)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 24,
  },
  textBlock: {
    width: '100%',
    direction: 'ltr',
  },
  title: {
    width: '100%',
    fontSize: 23,
    fontFamily: 'Changa_500Medium',
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 40,
  },
  description: {
    width: '100%',
    fontSize: 16,
    fontFamily: 'Changa_400Regular',
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
  },
});

export default OnboardingItem;
