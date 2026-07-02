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
import User03Icon from "@hugeicons/core-free-icons/User03Icon";
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
import { useSignup, useGoogleAuth } from "@/features/auth/hooks";
import {
  mapSignupFieldErrors,
  resolveSignupFieldError,
  type SignupField,
  type SignupFieldErrors,
} from "@/features/auth/lib/signup-errors";
import { getApiErrorMessage } from "@/lib/api-error";
import { AxiosError } from "axios";

const patternSource = require("@/assets/images/background-pattern-decorative.png");

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const Signup = () => {
  const { t } = useTranslation();
  const { directionStyle, textAlign, writingDirection } = useAppDirection();
  const router = useRouter();

  const { mutate: signup, isPending: isSignupPending } = useSignup();
  const { signInWithGoogle, isPending: isGooglePending } = useGoogleAuth({
    onSuccess: () => router.replace("/home" as Href),
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupFieldErrors>({});

  const [fontsLoaded] = useFonts({ Changa_400Regular, Changa_500Medium });

  const isPending = isSignupPending || isGooglePending;

  const clearFieldError = (field: SignupField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleFieldChange = (field: SignupField, value: string) => {
    switch (field) {
      case "name":         setName(value);            break;
      case "email":        setEmail(value);           break;
      case "password":     setPassword(value);        break;
      case "confirmPassword": setConfirmPassword(value); break;
    }
    clearFieldError(field);
  };

  const validateForm = (): boolean => {
    const nextErrors: SignupFieldErrors = {};

    if (!name.trim())
      nextErrors.name = "auth.nameRequired";

    if (!email.trim())
      nextErrors.email = "auth.emailRequired";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email = "auth.invalidEmail";

    if (!password)
      nextErrors.password = "auth.passwordRequired";
    else if (password.length < 6)
      nextErrors.password = "auth.passwordMinLength";

    if (!confirmPassword)
      nextErrors.confirmPassword = "auth.confirmPasswordRequired";
    else if (password !== confirmPassword)
      nextErrors.confirmPassword = "auth.passwordsDoNotMatch";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignup = () => {
    if (!validateForm()) return;

    signup(
      { name: name.trim(), email: email.trim(), password },
      {
        onSuccess: () =>
          router.replace({
            pathname: '/verify-email',
            params: { email: email.trim(), from: 'signup' },
          } as Href),
        onError: (error: AxiosError) => {
          const message = getApiErrorMessage(error);
          setErrors(mapSignupFieldErrors(message));
          console.error("Signup error:", message);
        },
      },
    );
  };

  const handleGoogleSignup = () => {
    signInWithGoogle();
  };

  if (!fontsLoaded) return null;

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
          <Header
            title={t("auth.signUpTitle")}
            subtitle={t("auth.signUpSubtitle")}
          />

          <View style={styles.actions}>
            <View>
              <Text style={[styles.label, { textAlign, writingDirection }]}>
                {t("common.name")}{" "}
                <Text style={styles.star}>{t("common.required")}</Text>
              </Text>
              <Input
                placeholder={t("auth.enterYourName")}
                icon={fieldIcon(User03Icon)}
                value={name}
                onChangeText={(text) => handleFieldChange("name", text)}
                error={resolveSignupFieldError(errors.name, t)}
              />
            </View>

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
                error={resolveSignupFieldError(errors.email, t)}
              />
            </View>

            <View>
              <Text style={[styles.label, { textAlign, writingDirection }]}>
                {t("common.password")}{" "}
                <Text style={styles.star}>{t("common.required")}</Text>
              </Text>
              <PasswordInput
                placeholder={t("common.passwordPlaceholder")}
                icon={fieldIcon(LockPasswordIcon)}
                value={password}
                onChangeText={(text) => handleFieldChange("password", text)}
                error={resolveSignupFieldError(errors.password, t)}
              />
            </View>

            <View>
              <Text style={[styles.label, { textAlign, writingDirection }]}>
                {t("auth.confirmPasswordLabel")}{" "}
                <Text style={styles.star}>{t("common.required")}</Text>
              </Text>
              <PasswordInput
                placeholder={t("common.passwordPlaceholder")}
                icon={fieldIcon(LockPasswordIcon)}
                value={confirmPassword}
                onChangeText={(text) =>
                  handleFieldChange("confirmPassword", text)
                }
                error={resolveSignupFieldError(errors.confirmPassword, t)}
              />
            </View>

            <Button
              title={t("auth.createAccount")}
              onPress={handleSignup}
              disabled={isPending}
            />

            <GoogleButton
              title={t("auth.googleSignUp")}
              onPress={handleGoogleSignup}
              disabled={isPending}
            />

            <View style={styles.footerAuth}>
              <Text style={styles.footerAuthMuted}>{t("auth.hasAccount")}</Text>
              <TextLinkButton
                title={t("auth.signIn")}
                variant="inline"
                onPress={() => router.push("/signin" as Href)}
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
    paddingHorizontal: 16,
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

export default Signup;