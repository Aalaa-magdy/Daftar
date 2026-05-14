import { colors } from "@/theme/colors";
import { ImageBackground, StyleSheet, Text, View } from "react-native"
import SoloLogo from "@/assets/images/SoloLogo.svg";
const patternSource = require('@/assets/images/background-pattern-decorative.png');
import { 
  useFonts
} from '@expo-google-fonts/tektur';

import {
  Changa_500Medium,
  Changa_400Regular
} from '@expo-google-fonts/changa';
import Header from "@/components/ui/Header";
const LastOnboarding = () => {
      let [fontsLoaded] = useFonts({
        Changa_400Regular,
        Changa_500Medium
      });
  return (
    <View style={styles.container}>
        <ImageBackground source={patternSource} style={styles.backgroundImage} resizeMode="cover"/>
         <Header
           title={"Start your financial journey"}
           subtitle={"Track expenses, manage your budget, and stay organized every day."}
          />
            

    </View>
  )
}
const styles = StyleSheet.create({
     container: {
         flex: 1,
         backgroundColor: colors.white,
   },
    backgroundImage: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '50%',
  },
  content:{
    flex:1,
    alignItems:'center',
    justifyContent:'flex-start',
    paddingVertical:16,
    marginTop:68,
    gap:12,
  },
  logo:{
    paddingHorizontal:32
  },
  description:{
    paddingVertical:16,
    paddingHorizontal:20,
    flex:1,
    gap:8,
    alignItems:'center'
  },
  title:{
     fontSize:26,
     lineHeight:40,
     fontFamily:'Changa_500Medium',
     textAlign:'center'
  },
  subTitle:{
    fontSize:16,
    color:colors.textGray,
    fontFamily:'Changa_400Regular',
    textAlign:'center'
  }

})
export default LastOnboarding