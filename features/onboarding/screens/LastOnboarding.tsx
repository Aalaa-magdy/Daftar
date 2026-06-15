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
import { useRouter, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAppDirection } from "@/hooks/useAppDirection";
import { useGoogleAuth } from "@/features/auth/hooks";
import { clearAuthTokens } from "@/features/auth/lib/auth-storage";
import { setGuestMode, setOnboardingCompleted } from "@/features/auth/lib/app-session";

const LastOnboarding = () => {
  const { t } = useTranslation();
  const { directionStyle } = useAppDirection();
  const router = useRouter();
  const { signInWithGoogle, isPending } = useGoogleAuth({
    onSuccess: () => router.replace("/set-salary" as Href),
  });
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium
  });

  const handleContinueAsGuest = async () => {
    await clearAuthTokens();
    await setGuestMode(true);
    await setOnboardingCompleted();
    router.replace("/home" as Href);
  };

  if (!fontsLoaded) {
    return null;
  }
 
  return (
    <SafeAreaView style={[styles.container, directionStyle]}>
      <ImageBackground source={patternSource} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.content}>
        <Header
          title={t("onboarding.lastTitle")}
          subtitle={t("onboarding.lastDescription")}
        />

        <View style={styles.actions}>
          <Button title={t("auth.signUp")} onPress={() => router.push("/signup")} />
          <GoogleButton
            title={t("auth.googleSignUp")}
            onPress={signInWithGoogle}
            disabled={isPending}
          />

          <TouchableOpacity
            accessibilityRole="button"
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={()=>router.push('/signin')}
          >
            <Text style={styles.secondaryButtonText}>{t("auth.signIn")}</Text>
          </TouchableOpacity>

          <TextLinkButton
            title={t("onboarding.continueAsGuest")}
            variant="block"
            onPress={handleContinueAsGuest}
          />
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
    backgroundColor: colors.background,
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Changa_500Medium',
    color: colors.primary,

  },
})

export default LastOnboarding