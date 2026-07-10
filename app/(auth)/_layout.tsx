import { authFlowScreenOptions } from '@/lib/navigation-transitions';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={authFlowScreenOptions}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="lastOnboarding" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
