
import { colors } from "@/theme/colors";
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from "@expo-google-fonts/changa";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";
import { useRouter, type Href } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ResetHeader from "../components/ResetHeader";

const fieldIcon = (icon: IconSvgElement) => (
  <HugeiconsIcon icon={icon} size={22} />
);
import passwordData ,{ PasswordDataType }from "../data/passwordData";  
import { useState } from "react";
import Pagination from "../components/Pagination";
const ResetPassword = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });
  const [currentStep,SetCurrentStep]= useState(0);

  if (!fontsLoaded) {
    return null;
  }
   
  return (
    <View style={styles.pagination}>
        <Pagination
          
          currentStep={currentStep}
          totalSteps={passwordData.length}
        />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    justifyContent: "space-between",
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
  pagination: {
    width: '100%',
    height: 40,
  },
});
export default ResetPassword;