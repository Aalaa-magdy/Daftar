import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { colors } from '@/theme/colors';
import SoloLogo from '@/assets/images/SoloLogo.svg';
import { Image, StyleSheet, Text, View } from 'react-native';

const profile = require('@/assets/images/profile.jpg');

const HomeHeader = () => {
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <Image source={profile} style={styles.image} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.name}>Salma Gamal</Text>
        </View>
      </View>
      <SoloLogo width={80} height={40} />
    </View>
  );
};

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
        borderRadius: 20,
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