import { StyleSheet, View } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated';
import Logo from '@/assets/images/Logo.svg'
const SplashScreen = () => {

  return (
  <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800).springify()}>
        <Logo width={200} height={200} />
      </Animated.View>
    </View>
  );
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffff',
  },
  logo: {
    height: "23%",
    aspectRatio: 1,
  },
})