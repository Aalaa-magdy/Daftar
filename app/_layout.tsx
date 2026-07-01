import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import i18n, { initI18n } from '@/lib/i18n';
import { queryClient } from '@/lib/query-client';
import { colors } from '@/theme/colors';

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="lastOnboarding" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="manage-income" />
        <Stack.Screen name="recurring-transaction/[id]" />
        <Stack.Screen name="home" />
        <Stack.Screen name="history" />
        <Stack.Screen name="statistics" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="verify-email" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="faq" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="language" />
        <Stack.Screen name="transaction/[id]" />
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
