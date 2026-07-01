import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useRouter, type Href } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Pagination from '../components/Pagination';
import ResetPasswordItem from '../components/ResetPasswordItem';
import passwordData from '../data/passwordData';

const HORIZONTAL_PADDING = 20;

const ResetPassword = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({ Changa_400Regular, Changa_500Medium });
  const [currentStep, setCurrentStep] = useState(0);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const step = passwordData[currentStep];

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    setCode('');
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === 0) {
      router.back();
      return;
    }
    setCurrentStep((prev) => prev - 1);
  }, [currentStep, router]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, passwordData.length - 1));
  }, []);

  const handleDone = useCallback(() => {
    router.replace('/signin' as Href);
  }, [router]);

  if (!fontsLoaded || !step) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <ResetPasswordItem
          item={step}
          email={email}
          code={code}
          onEmailChange={handleEmailChange}
          onCodeChange={setCode}
          onBackPress={handleBack}
          onNext={handleNext}
          onDone={handleDone}
        />
      </View>

      <View
        style={[styles.paginationContainer, { paddingBottom: insets.bottom + 16 }]}
      >
        <Pagination currentStep={currentStep} totalSteps={passwordData.length} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  content: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  paginationContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});

export default ResetPassword;
