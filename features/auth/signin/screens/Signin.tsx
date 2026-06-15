import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import Header from "@/components/ui/Header";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import TextLinkButton from "@/components/ui/TextLinkButton";
import { colors } from "@/theme/colors";
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from "@expo-google-fonts/changa";
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";
import LockPasswordIcon from "@hugeicons/core-free-icons/SquareLockPasswordIcon";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";
import { useAppDirection } from "@/hooks/useAppDirection";
import { useSignin, useGoogleAuth } from "@/features/auth/hooks";
import {
  mapSigninFieldErrors,
  resolveSigninFieldError,
  INVALID_CREDENTIALS_KEY,
  type SigninField,
  type SigninFieldErrors,
} from "@/features/auth/lib/signin-errors";
import { getApiErrorMessage } from "@/lib/api-error";
import { AxiosError } from "axios";

const patternSource = require("@/assets/images/background-pattern-decorative.png");

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const Signin = () => {
  const { t } = useTranslation();
  const { directionStyle, textAlign, writingDirection } = useAppDirection();
  const router = useRouter();

  const { mutate: signin, isPending: isSigninPending } = useSignin();
  const { signInWithGoogle, isPending: isGooglePending } = useGoogleAuth({
    onSuccess: () => router.replace("/home" as Href),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SigninFieldErrors>({});

  const [fontsLoaded] = useFonts({ Changa_400Regular, Changa_500Medium });

  const isPending = isSigninPending || isGooglePending;

  const clearFieldError = (field: SigninField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (field: SigninField, value: string) => {
    switch (field) {
      case "email":    setEmail(value);    break;
      case "password": setPassword(value); break;
    }
    clearFieldError(field);
  };

  const validateForm = (): boolean => {
    const nextErrors: SigninFieldErrors = {};

    if (!email.trim())
      nextErrors.email = "auth.emailRequired";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email = "auth.invalidEmail";

    if (!password)
      nextErrors.password = "auth.passwordRequired";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignin = () => {
    if (!validateForm()) return;

    signin(
      { email: email.trim(), password },
      {
        onSuccess: () => router.replace("/home" as Href),
        onError: (error: AxiosError) => {
          const message = getApiErrorMessage(error);
          setErrors(mapSigninFieldErrors(message));
          console.error("Signin error:", message);
        },
      },
    );
  };

  const handleGoogleSignin = () => {
    signInWithGoogle();
  };

  if (!fontsLoaded) return null;

  const hasInvalidCredentials =
    errors.email === INVALID_CREDENTIALS_KEY &&
    errors.password === INVALID_CREDENTIALS_KEY;

  return (
    <SafeAreaView style={[styles.container, directionStyle]}>
      <ImageBackground
        source={patternSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          enableOnAndroid
          enableAutomaticScroll
          extraHeight={120}
          extraScrollHeight={120}
        >
          <View style={styles.flex}>
            <Header
              title={t("auth.signInTitle")}
              subtitle={t("auth.signInSubtitle")}
            />

            <View style={styles.actions}>
              <View>
                <Text style={[styles.label, { textAlign, writingDirection }]}>
                  {t("common.email")}{" "}
                  <Text style={styles.star}>{t("common.required")}</Text>
                </Text>
                <Input
                  placeholder={t("common.emailPlaceholder")}
                  keyboardType="email-address"
                  icon={fieldIcon(Mail01Icon)}
                  value={email}
                  onChangeText={(text) => handleFieldChange("email", text)}
                  invalid={Boolean(errors.email)}
                  error={
                    hasInvalidCredentials
                      ? undefined
                      : resolveSigninFieldError(errors.email, t)
                  }
                />
              </View>

              <View style={styles.passwordField}>
                <Text style={[styles.label, { textAlign, writingDirection }]}>
                  {t("common.password")}{" "}
                  <Text style={styles.star}>{t("common.required")}</Text>
                </Text>
                <PasswordInput
                  placeholder={t("common.passwordPlaceholder")}
                  icon={fieldIcon(LockPasswordIcon)}
                  containerStyle={styles.passwordInput}
                  value={password}
                  onChangeText={(text) => handleFieldChange("password", text)}
                  invalid={Boolean(errors.password)}
                  error={resolveSigninFieldError(errors.password, t)}
                />
                <View style={styles.forgetPasswordRow}>
                  <TextLinkButton
                    title={t("auth.forgetPassword")}
                    variant="inline"
                    onPress={() => router.push("/reset-password" as Href)}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomActions}>
            <Button
              title={t("auth.signIn")}
              onPress={handleSignin}
              disabled={isPending}
            />

            <GoogleButton
              title={t("auth.googleSignIn")}
              onPress={handleGoogleSignin}
              disabled={isPending}
            />

            <View style={styles.footerAuth}>
              <Text style={styles.footerAuthMuted}>{t("auth.noAccount")}</Text>
              <TextLinkButton
                title={t("auth.signUp")}
                variant="inline"
                onPress={() => router.push("/signup" as Href)}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingBottom: 32,
  },

  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "48%",
  },

  actions: {
    marginTop: 32,
    gap: 16,
  },

  passwordField: { width: "100%" },

  passwordInput: { marginBottom: 4 },

  forgetPasswordRow: {
    width: "100%",
    direction: "ltr",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },

  bottomActions: { gap: 16 },

  label: {
    width: "100%",
    fontFamily: "Changa_400Regular",
    color: colors.black,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 6,
  },

  star: { color: "red" },

  footerAuth: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    paddingBottom: 8,
  },

  footerAuthMuted: {
    fontFamily: "Changa_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: colors.captionMuted,
  },
});

export default Signin;