import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import Logo from '@/assets/images/Logo.svg';

const SPLASH_MS = 3000;

const SplashScreenComponent = () => {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
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
  }, [router]);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800).springify()}>
        <Logo width={200} height={200} />
      </Animated.View>
    </View>
  );
};

export default SplashScreenComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
