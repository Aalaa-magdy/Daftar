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

const patternSource = require("@/assets/images/background-pattern-decorative.png");

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);

const Signup = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
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
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraHeight={120}
          extraScrollHeight={120}
        >
          <Header
            title="Create an account"
            subtitle="Create an account to save your progress and sync your data."
          />

          <View style={styles.actions}>
            <View>
              <Text style={styles.label}>
                Name <Text style={styles.star}>*</Text>
              </Text>
              <Input
                placeholder="Enter your Name"
                icon={fieldIcon(User03Icon)}
              />
            </View>

            <View>
              <Text style={styles.label}>
                Email <Text style={styles.star}>*</Text>
              </Text>
              <Input
                placeholder="me@example.com"
                keyboardType="email-address"
                icon={fieldIcon(Mail01Icon)}
              />
            </View>

            <View>
              <Text style={styles.label}>
                Password <Text style={styles.star}>*</Text>
              </Text>
              <PasswordInput
                placeholder="........"
                icon={fieldIcon(LockPasswordIcon)}
              />
            </View>

            <View>
              <Text style={styles.label}>
                Confirm Password <Text style={styles.star}>*</Text>
              </Text>
              <PasswordInput
                placeholder="........"
                icon={fieldIcon(LockPasswordIcon)}
              />
            </View>

            <Button title="Create account" />
            <GoogleButton title="up" />

            <View style={styles.footerAuth}>
              <Text style={styles.footerAuthMuted}>
                Already have an account?
              </Text>

              <TextLinkButton
                title="Sign in"
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
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 140,
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
    fontFamily: "Changa_400Regular",
    color: colors.black,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 6,
  },

  star: {
    color: "red",
  },

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