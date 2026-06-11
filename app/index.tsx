import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Tektur_400Regular } from '@expo-google-fonts/tektur';
import { Changa_400Regular } from '@expo-google-fonts/changa';
import { useTranslation } from 'react-i18next';
import SoloLogo from '@/assets/images/SoloLogo.svg';
import { colors } from '@/theme/colors';

// Keep the native splash visible until we explicitly hide it
SplashScreen.preventAutoHideAsync();

const SPLASH_MS = 2500;

const SplashScreenComponent = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    Tektur_400Regular,
    Changa_400Regular,
  });

  useEffect(() => {
    // Don't do anything until fonts are ready — this prevents the
    // white flash between the native splash and this screen
    if (!fontsLoaded) return;

    let cancelled = false;

    const run = async () => {
      // Hide the native splash only once our screen is ready to show
      await SplashScreen.hideAsync();
      if (cancelled) return;

      await new Promise<void>((resolve) => setTimeout(resolve, SPLASH_MS));
      if (cancelled) return;

      router.replace('/onboarding' as Href);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [router, fontsLoaded]);

  // While fonts are loading, render nothing — native splash stays visible
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={colors.white} />
      <View style={styles.content}>
        <SoloLogo width={64} height={64} />
        <Text style={styles.title}>{t('onboarding.brand')}</Text>
        <Text style={styles.tagline}>{t('splash.tagline')}</Text>
      </View>
    </View>
  );
};

export default SplashScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 32,
    direction: 'ltr',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    overflow: 'visible',
  },
  title: {
    marginTop: 8,
    color: colors.primary,
    fontFamily: 'Tektur_400Regular',
    fontSize: 36,
    lineHeight: 44,
    textAlign: 'center',
    writingDirection: 'ltr',
  },
  tagline: {
    color: colors.textSecondary,
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    writingDirection: 'ltr',
    paddingHorizontal: 8,
    ...Platform.select({
      android: { includeFontPadding: false },
    }),
  },
});