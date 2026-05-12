import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingScreen from '@/features/onboarding/screens/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if (hasLaunched === null) {
      setIsFirstLaunch(true);
      await AsyncStorage.setItem('hasLaunched', 'true');
    } else {
      setIsFirstLaunch(false);
    }
  };

  if (isFirstLaunch === null) {
    return null; // Splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        {/* <Stack.Screen name="Auth" component={AuthNavigator} /> */}
        {/* <Stack.Screen name="Main" component={MainNavigator} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}