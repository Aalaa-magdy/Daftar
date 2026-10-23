import i18n, { initI18n } from '@/lib/i18n';
import {
  profileScreenOptions,
  seamlessScreenOptions,
  tabsScreenOptions,
} from '@/lib/navigation-transitions';
import {
  Changa_400Regular,
  Changa_500Medium,
  Changa_600SemiBold,
  Changa_700Bold,
  useFonts as useChangaFonts,
} from '@expo-google-fonts/changa';
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
  useFonts as usePlexFonts,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import { queryClient } from '@/lib/query-client';
import { colors } from '@/theme/colors';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync().catch((error: unknown) => {
  console.error('Failed to keep the splash screen visible', error);
});

export const unstable_settings = {
  initialRouteName: 'index',
};

function AppShell() {
  const { i18n: i18nInstance } = useTranslation();
  const isRTL = i18nInstance.language === 'ar';

  return (
    // Do NOT key by language — remounting Stack resets navigation to /index
    // and can briefly look like a logout (especially on first language change).
    <View style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}>
      <Stack screenOptions={seamlessScreenOptions}>
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(auth)" options={seamlessScreenOptions} />
        <Stack.Screen name="(tabs)" options={tabsScreenOptions} />
        <Stack.Screen name="manage-income" options={seamlessScreenOptions} />
        <Stack.Screen
          name="recurring-transaction/[id]"
          options={seamlessScreenOptions}
        />
        <Stack.Screen name="edit-profile" options={profileScreenOptions} />
        <Stack.Screen name="verify-email" options={profileScreenOptions} />
        <Stack.Screen name="change-password" options={profileScreenOptions} />
        <Stack.Screen name="faq" options={profileScreenOptions} />
        <Stack.Screen name="terms" options={profileScreenOptions} />
        <Stack.Screen name="privacy-policy" options={profileScreenOptions} />
        <Stack.Screen name="language" options={profileScreenOptions} />
        <Stack.Screen
          name="transaction/[id]"
          options={seamlessScreenOptions}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(i18n.isInitialized);
  const [initializationFailed, setInitializationFailed] = useState(false);
  const [changaFontsLoaded] = useChangaFonts({
    Changa_400Regular,
    Changa_500Medium,
    Changa_600SemiBold,
    Changa_700Bold,
  });
  const [plexFontsLoaded] = usePlexFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
  });
  const isAppReady = i18nReady && changaFontsLoaded && plexFontsLoaded;

  useEffect(() => {
    initI18n()
      .then(() => setI18nReady(true))
      .catch((error: unknown) => {
        console.error('Failed to initialize translations', error);
        setInitializationFailed(true);
      });
  }, []);

  useEffect(() => {
    if (isAppReady || initializationFailed) {
      SplashScreen.hideAsync().catch((error: unknown) => {
        console.error('Failed to hide splash screen', error);
      });
    }
  }, [isAppReady, initializationFailed]);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          {!isAppReady ? (
            initializationFailed ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  backgroundColor: colors.white,
                }}
              >
                <Text>Unable to initialize the app. Please restart it.</Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.white,
                }}
              >
                <ActivityIndicator color={colors.primary} />
              </View>
            )
          ) : (
            <AppShell />
          )}
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
