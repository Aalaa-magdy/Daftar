import { colors } from "@/theme/colors"
import { StyleSheet, Text, View } from "react-native"
import SoloLogo from "@/assets/images/SoloLogo.svg";
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
        <SoloLogo width={68} height={68} />
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
    paddingTop: 56,
    gap: 20,
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: 32,
    color: colors.textGray,
    fontFamily: 'Changa_400Regular',
    textAlign: 'center',
  }
})

export default Header