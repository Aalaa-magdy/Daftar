import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="lastOnboarding" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="set-salary" />
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
  );
}
