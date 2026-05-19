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
  const [currentStep, SetCurrentStep] = useState(1);

  if (!fontsLoaded) {
    return null;
  }
   
  return (
    <View
      style={styles.container}
    >
      <View style={styles.content}>
        <ResetHeader currentStep={currentStep} />
      </View>
      
      <View style={styles.paginationContainer}>
        <Pagination
          currentStep={currentStep}
          totalSteps={passwordData.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    
  },
  content: {
    flex: 1,
    justifyContent: "center",
   
  },
  paginationContainer: {
    width: '100%',
    alignItems:"center",
    paddingHorizontal: 16,
    paddingBottom: 34,

  },
});

export default ResetPassword;