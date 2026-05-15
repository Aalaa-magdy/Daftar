import { colors } from "@/theme/colors";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
const patternSource = require('@/assets/images/background-pattern-decorative.png');
import {
  useFonts
} from '@expo-google-fonts/changa';

import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import TextLinkButton from "@/components/ui/TextLinkButton";
import {
  Changa_400Regular,
  Changa_500Medium
} from '@expo-google-fonts/changa';
import { useRouter } from "expo-router";
const LastOnboarding = () => {
  const router = useRouter()
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium
  });

  if (!fontsLoaded) {
    return null;
  }
 
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={patternSource} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.content}>
        <Header
          title={"Start your financial journey"}
          subtitle={"Track expenses, manage your budget, and stay organized every day."}
        />

        <View style={styles.actions}>
          <Button title={"Sign up"} onPress={()=>router.push('/signup')} />
          <GoogleButton title={"up"} />

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.secondaryButton}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </TouchableOpacity>

          <TextLinkButton title="Continue as Guest" variant="block" />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingBottom: 32,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '48%',
  },
  actions: {
    marginTop:16,
    gap: 16,
  },
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Changa_500Medium',
    color: colors.primary,
  },
})

export default LastOnboarding