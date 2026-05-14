import { colors } from "@/theme/colors"
import { StyleSheet, Text, View } from "react-native"
import SoloLogo from "@/assets/images/SoloLogo.svg";
const patternSource = require('@/assets/images/background-pattern-decorative.png');
import { 
  useFonts
} from '@expo-google-fonts/tektur';

import {
  Changa_500Medium,
  Changa_400Regular
} from '@expo-google-fonts/changa';
interface props{
  title:string,
  subtitle:string,
}
const Header = ({title,subtitle}:props) => {
      let [fontsLoaded] = useFonts({
        Changa_400Regular,
        Changa_500Medium
      });
  return (
    <View style={styles.content}> 
            <View style={styles.logo}>
                  <SoloLogo  width={68} height={68}/>
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

const styles= StyleSheet.create({
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

export default Header