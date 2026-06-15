import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import SoloLogo from '@/assets/images/SoloLogo.svg';
const patternSource = require('@/assets/images/background-pattern-decorative.png');
import { Tektur_400Regular, useFonts } from '@expo-google-fonts/tektur';
import { Changa_500Medium } from '@expo-google-fonts/changa';
import Pagination from '../components/Pagination';
import React from 'react';
import OnboardingItem from '../components/OnboardingItem';
import OnboardingButton from '../components/OnboardingButton';
import { onboardingData, type OnboardingItemType } from '../data/onboardingData';
import { setOnboardingCompleted } from '@/features/auth/lib/app-session';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppDirection } from '@/hooks/useAppDirection';

const OnboardingScreen = () => {
  const { t } = useTranslation();
  const { directionStyle, isRTL } = useAppDirection();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Tektur_400Regular,
    Changa_500Medium,
  });

  const [currentStep, setCurrentStep] = React.useState(0);
  const flatListRef = React.useRef<FlatList<OnboardingItemType>>(null);
  const { width } = useWindowDimensions();
  const contentWidth = Math.max(width - 40, 0);

  React.useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [contentWidth]);

  const handleScrollEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      setCurrentStep(Math.round(offsetX / contentWidth));
    },
    [contentWidth],
  );

  const goToLastOnboarding = React.useCallback(async () => {
    await setOnboardingCompleted();
    router.push('/lastOnboarding');
  }, [router]);

  const handleNext = React.useCallback(() => {
    if (currentStep >= onboardingData.length - 1) {
      goToLastOnboarding();
      return;
    }

    const nextStep = currentStep + 1;
    flatListRef.current?.scrollToIndex({
      index: nextStep,
      animated: true,
    });
    setCurrentStep(nextStep);
  }, [currentStep, goToLastOnboarding]);

  const renderItem = React.useCallback(
    ({ item }: { item: OnboardingItemType }) => (
      <View style={[styles.slide, { width: contentWidth }]}>
        <OnboardingItem item={item} width={contentWidth} />
      </View>
    ),
    [contentWidth],
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, directionStyle]}>
      <ImageBackground
        source={patternSource}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <View style={[styles.header, isRTL ? styles.headerRtl : styles.headerLtr]}>
        <TouchableOpacity onPress={goToLastOnboarding}>
          <Text style={styles.headerButton}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <SoloLogo />
          <Text style={styles.logoText}>{t('onboarding.brand')}</Text>
        </View>
        <View style={styles.pagination}>
          <Pagination
            currentStep={currentStep}
            totalSteps={onboardingData.length}
          />
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
            initialScrollIndex={0}
            onMomentumScrollEnd={handleScrollEnd}
            getItemLayout={(_, index) => ({
              length: contentWidth,
              offset: contentWidth * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              flatListRef.current?.scrollToOffset({
                offset: info.index * contentWidth,
                animated: true,
              });
            }}
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
    height: 200,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  headerLtr: {
    justifyContent: 'flex-end',
  },
  headerRtl: {
    justifyContent: 'flex-start',
  },
  content: {
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 2,
    gap: 4,
  },
  logoText: {
    color: colors.primary,
    fontFamily: 'Tektur_400Regular',
    fontSize: 25,
    fontWeight: '400',
    paddingHorizontal: 2,
    lineHeight: 40,
  },
  pagination: {
    width: '100%',
    height: 40,
  },
  listContainer: {
    flex: 1,
    direction: 'ltr',
  },
  list: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  footer: {
    width: '100%',
    paddingBottom: 16,
  },
});

export default OnboardingScreen;
