import { StyleSheet, View, ImageBackground, TouchableOpacity, Text } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

const patternSource = require('@/assets/images/background-pattern-decorative.png');

import { 
  Tektur_400Regular,
  Tektur_500Medium,
  Tektur_600SemiBold,
  Tektur_700Bold,
  Tektur_800ExtraBold,
  Tektur_900Black,
  useFonts
} from '@expo-google-fonts/tektur';

import {
  Changa_400Regular,
  Changa_700Bold,
  Changa_500Medium
} from '@expo-google-fonts/changa';

const OnboardingScreen = () => {
    let [fontsLoaded] = useFonts({
    Tektur_400Regular,
    Tektur_500Medium,
    Tektur_600SemiBold,
    Tektur_700Bold,
    Tektur_800ExtraBold,
    Tektur_900Black,
    Changa_400Regular,
    Changa_700Bold,
    Changa_500Medium
  })
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <ImageBackground
          source={patternSource}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.backgroundImageFill} />
        </ImageBackground>
        <View style={styles.headerRow} accessibilityRole="header">
          <TouchableOpacity onPress={() => console.log('Get Started Pressed')} hitSlop={12}>
            <Text style={styles.button}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomPlaceholder} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  topContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    top: 48,
  },
  backgroundImageFill: {
    flex: 1,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
   
    direction: 'ltr',
  },
  bottomPlaceholder: {
    minHeight: 0,
  },
  button: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 24,
    fontFamily: 'Changa_500Medium',
  },
});

export default OnboardingScreen;
