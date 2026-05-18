import { colors } from "@/theme/colors"
import { ImageBackground, StyleSheet, Text, View } from "react-native"
const patternSource = require('@/assets/images/background-pattern-decorative.png');
interface Props {
  title: string,
  subtitle: string,
  icon?:React.ReactNode
}
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts
} from '@expo-google-fonts/changa';
const ResetHeader = ({ title, subtitle ,icon}: Props) => {
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View style={styles.content}> 
        <ImageBackground source={patternSource} style={styles.backgroundImage} resizeMode="cover" />
    </View>
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
})

export default ResetHeader