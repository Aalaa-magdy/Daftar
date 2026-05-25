import { Image, ImageBackground, StyleSheet, Text, View } from "react-native"
import { useFonts } from 'expo-font';
import { 
  Tektur_400Regular,
  useFonts as useTekturFonts
} from '@expo-google-fonts/tektur';
import {
  Changa_500Medium
} from '@expo-google-fonts/changa';
import { colors } from "@/theme/colors";
import SoloLogo from "@/assets/images/SoloLogo.svg";

const profile = require('@/assets/images/profile.jpg');

const HomeHeader = () => {
  let [tekturFontsLoaded] = useTekturFonts({
    Tektur_400Regular,
  });
  
  let [changaFontsLoaded] = useFonts({
    Changa_500Medium,
  });

  // Wait for fonts to load
  if (!tekturFontsLoaded || !changaFontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <ImageBackground 
            source={profile}    
            style={styles.image}
            imageStyle={{ borderRadius: 20 }}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.name}>Salma Gamal</Text>
        </View>
      </View>
      <SoloLogo width={80} height={40} /> {/* Adjust size as needed */}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        paddingHorizontal: 5,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around", // Changed from "space-around" to "space-between"
        width: "100%", // Ensure container takes full width
    },
    header: {
        flexDirection: "row",
        alignItems: "center",  
        gap: 8,
        flex: 1, // Allow header to take remaining space
    },
    imageWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: "hidden", 
        marginLeft: 10,
    },
    image: {
        width: 40,
        height: 40,
    },
    profileInfo: {
        justifyContent: "center", 
        marginTop:10,
        marginLeft:4,
    },
    welcome: {
        fontSize: 13,
        fontFamily: 'Changa_400Regular',
        color: colors.textGray,
        lineHeight: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: "400",
        fontFamily: 'Changa_500Medium',
        color: colors.black,
    },
})

export default HomeHeader