import { colors } from "@/theme/colors"
import { Image, StyleSheet, Text, View } from "react-native"
const logoSource = require("@/assets/images/New_logo.png");
interface Props {
  title: string,
  subtitle: string,
}
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts
} from '@expo-google-fonts/changa';
const Header = ({ title, subtitle }: Props) => {
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.content}> 
      <View style={styles.logo}>
        <Image source={logoSource} style={styles.logoImage} resizeMode="contain" />
      </View>
      <View style={styles.description}>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subTitle}>
          {subtitle}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 25,
    gap: 20,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 68,
    height: 68,
  },
  description: {
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 23,
    lineHeight: 40,
    fontFamily: 'Changa_500Medium',
    textAlign: 'center',
    color: colors.black,
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textGray,
    fontFamily: 'Changa_400Regular',
    textAlign: 'center',
  }
})

export default Header