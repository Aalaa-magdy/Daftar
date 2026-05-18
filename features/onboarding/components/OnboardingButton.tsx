import { colors } from '@/theme/colors'
import React from 'react'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { onboardingData } from '../data/onboardingData'
import Button from '@/components/ui/Button';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts
} from '@expo-google-fonts/changa';

interface Props {
    currentStep: number;
    onPress: () => void;
    isLastStep: boolean;
}

const OnboardingButton = ({ currentStep, onPress, isLastStep }: Props) => {
   const [fontsLoaded] = useFonts({
      Changa_400Regular,
      Changa_500Medium
    });
  
    if (!fontsLoaded) {
      return null;
    }
  const buttonText = onboardingData[currentStep]?.buttonText ?? 'Continue';

  return ( 
    <View style={styles.container}>
      {
        isLastStep ? (
          <Button title={buttonText} onPress={onPress} />):(
          <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
               <Text style={styles.continueButton}>{buttonText}</Text>
          </TouchableOpacity> )
        }

    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
    },
    continueButton:{
        color:colors.textGray,
        fontSize: 16,
        fontFamily: 'Changa_500Medium',
        paddingVertical: 12,
        lineHeight: 24, 
    },
})

export default OnboardingButton