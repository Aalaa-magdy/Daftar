import i18n, { initI18n } from '@/lib/i18n';
import {
  profileScreenOptions,
  seamlessScreenOptions,
  tabsScreenOptions,
} from '@/lib/navigation-transitions';
import { queryClient } from '@/lib/query-client';
import { colors } from '@/theme/colors';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

function AppShell() {
  const { i18n: i18nInstance } = useTranslation();
  const isRTL = i18nInstance.language === 'ar';

  return (
    <View
      key={i18nInstance.language}
      style={{ flex: 1, direction: isRTL ? 'rtl' : 'ltr' }}
    >
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

  useEffect(() => {
    initI18n()
      .then(() => {
        setI18nReady(true);
      })
      .catch(() => {
        setI18nReady(true);
      });
  }, []);

  useEffect(() => {
    if (i18nReady) {
      SplashScreen.hideAsync();
    }
  }, [i18nReady]);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          {!i18nReady ? (
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
          ) : (
            <AppShell />
          )}
        </SafeAreaProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
