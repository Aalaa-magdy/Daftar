import { colors } from "@/theme/colors"
import { ImageBackground, StyleSheet, Text, View } from "react-native"
const patternSource = require('@/assets/images/background-pattern-decorative.png');
import Key01Icon from "@hugeicons/core-free-icons/Key01Icon"
import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon"
import passwordData from "../data/passwordData";
import { HugeiconsIcon } from '@hugeicons/react-native';
interface Props {
  currentStep:number
}
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts
} from '@expo-google-fonts/changa';

const ResetHeader = ({ currentStep}: Props) => {
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <View style={styles.container}> 
        <ImageBackground source={patternSource} style={styles.backgroundImage} resizeMode="cover" />
        <View style={styles.content}>
          <View style={styles.backStep} >
             <HugeiconsIcon icon={ArrowLeft02Icon} size={32} color={colors.textGray} />
          </View>
           <View style={styles.iconContainer}>
              <HugeiconsIcon 
                icon={passwordData[currentStep].icon} 
                size={32} 
                color={colors.primary} // or any color you want
              />
           </View>
           <Text style={styles.stepText}>Step {currentStep + 1}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: colors.background,
    position:"relative"
  },
  backStep:{
    paddingHorizontal:20,
    position:"absolute",
    left:0
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop:80,
    paddingHorizontal: 20,
    gap:16
  },
  backgroundImage: {
    position: 'absolute',
    top: -100,
    left: 0,
    width: '100%',
    height: '90%',
  },
  iconContainer: {
    marginBottom:12,
    padding:8,
    borderRadius:12,
    marginTop:70,
    backgroundColor:colors.secondary
  },
  stepText: {
    fontSize: 18,
    fontFamily: "Changa_500Medium",
    color: colors.text,
    textAlign: "center",
  }
})

export default ResetHeader