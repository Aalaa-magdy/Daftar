import { StyleSheet, View, ImageBackground, TouchableOpacity, Text, FlatList, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import SoloLogo from '@/assets/images/SoloLogo.svg';
const patternSource = require('@/assets/images/background-pattern-decorative.png');
import { 
  Tektur_400Regular,
  useFonts
} from '@expo-google-fonts/tektur';

import {
  Changa_500Medium
} from '@expo-google-fonts/changa';
import Pagination from '../components/Pagination';
import React from 'react';
import OnboardingItem from '../components/OnboardingItem';
import OnboardingButton from '../components/OnboardingButton';
import { onboardingData, type OnboardingItemType } from '../data/onboardingData';
import { useRouter } from 'expo-router';

const OnboardingScreen = () => {
  const router = useRouter();
   let [fontsLoaded] = useFonts({
    Tektur_400Regular,
    Changa_500Medium
  });

  const [currentStep, setCurrentStep] = React.useState(0);
  const flatListRef = React.useRef<FlatList<OnboardingItemType>>(null);
  const { width, height } = useWindowDimensions();
  const contentWidth = Math.max(width - 40, 0);

 

  const handleScrollEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nextIndex = Math.round(offsetX / contentWidth);
      setCurrentStep(nextIndex);
    },
    [contentWidth]
  );

  const handleNext = React.useCallback(() => {
    if (currentStep >= onboardingData.length - 1) {
      router.push('/lastOnboarding');
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: currentStep + 1,
      animated: true,
    });
  }, [currentStep]);

  const renderItem = React.useCallback(
    ({ item }: { item: OnboardingItemType }) => (
      <OnboardingItem item={item} width={contentWidth} />
    ),
    [contentWidth]
  );
    if (!fontsLoaded) {
      return null;
    }
  
  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground source={patternSource} resizeMode="cover" style={styles.backgroundImage} />
       <View style={styles.header}>
                 <TouchableOpacity >
                    <Text style={styles.headerButton}>Sign In</Text>
                 </TouchableOpacity>
       </View>
       <View style={styles.content}> 
       <View style={styles.logoSection}>  
                    <SoloLogo />
                     <Text style={styles.logoText}>Daftar</Text>     
       </View>
       <View style={styles.pagination}>
           <Pagination currentStep={currentStep} totalSteps={onboardingData.length} />
       </View>
        <View style={styles.listContainer}>
          <FlatList
            ref={flatListRef}
            data={onboardingData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            getItemLayout={(_, index) => ({
              length: contentWidth,
              offset: contentWidth * index,
              index,
            })}
            style={styles.list}
          />
        </View>
        <View style={styles.footer}>
           <OnboardingButton
             currentStep={currentStep}
             onPress={handleNext}
             isLastStep={currentStep === onboardingData.length - 1}
           />
        </View>
       </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: colors.background,
   },
   backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '90%',
  },
   header: {  
      height: 230,
      flexDirection: 'row',
      justifyContent: 'flex-end',  
      backgroundColor:"transparent"
   },
   content:{
      flex: 1,
      paddingHorizontal: 20,
   },
   headerButton: { 
      fontFamily: 'Changa_500Medium',
      fontSize: 18,
      fontWeight: '500',
      color: colors.primary,
      padding: 24,    
   },
   logoSection: {
      width: '100%',
      height: 55,  // Fixed height
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal:2,
      gap:4  // Vertically centers content
   },
 
   logoText: {
      color: colors.primary,
      fontFamily: 'Tektur_400Regular',
      fontSize: 25, 
      fontWeight: '400',
      paddingHorizontal:2,
      lineHeight:40
   },
   pagination: {
      width: '100%',
      height: 40,
   },
   listContainer: {
     flex: 1,
   },
   list: {
     flex: 1,
   },
   footer: {
     width: '100%',
     paddingBottom: 16,
   },
});

export default OnboardingScreen;