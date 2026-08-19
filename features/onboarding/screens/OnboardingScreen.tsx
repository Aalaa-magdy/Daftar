import {
  StyleSheet,
  View,
  Image,
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
const patternSource = require('@/assets/images/background-pattern-decorative.png');
const logoSource = require('@/assets/images/logo-mark.png');
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

const LAST_INDEX = onboardingData.length - 1;

const OnboardingScreen = () => {
  const { t } = useTranslation();
  const { isRTL } = useAppDirection();
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Tektur_400Regular,
    Changa_500Medium,
  });

  const [currentStep, setCurrentStep] = React.useState(0);
  const flatListRef = React.useRef<FlatList<OnboardingItemType>>(null);
  const isProgrammaticScroll = React.useRef(false);
  const { width } = useWindowDimensions();
  const contentWidth = Math.max(width - 40, 0);

  const scrollToStep = React.useCallback(
    (index: number, animated = true) => {
      const clamped = Math.min(Math.max(index, 0), LAST_INDEX);
      isProgrammaticScroll.current = true;
      flatListRef.current?.scrollToOffset({
        offset: clamped * contentWidth,
        animated,
      });
      setCurrentStep(clamped);

      // Allow momentum handler again after the animated scroll settles.
      if (animated) {
        setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 350);
      } else {
        isProgrammaticScroll.current = false;
      }
    },
    [contentWidth],
  );

  React.useEffect(() => {
    scrollToStep(0, false);
  }, [contentWidth, scrollToStep]);

  const handleScrollEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isProgrammaticScroll.current || contentWidth <= 0) {
        return;
      }

      const offsetX = event.nativeEvent.contentOffset.x;
      const nextStep = Math.min(
        Math.max(Math.round(offsetX / contentWidth), 0),
        LAST_INDEX,
      );
      setCurrentStep(nextStep);
    },
    [contentWidth],
  );

  const goToLastOnboarding = React.useCallback(async () => {
    await setOnboardingCompleted();
    router.push('/lastOnboarding');
  }, [router]);

  const handleNext = React.useCallback(() => {
    if (currentStep >= LAST_INDEX) {
      goToLastOnboarding();
      return;
    }

    scrollToStep(currentStep + 1);
  }, [currentStep, goToLastOnboarding, scrollToStep]);

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
    // Keep the screen LTR so the carousel never reverses under Arabic `direction: rtl`.
    <SafeAreaView style={styles.container}>
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
        <View
          style={[
            styles.logoSection,
            isRTL ? styles.logoSectionRtl : styles.logoSectionLtr,
          ]}
        >
          <Image source={logoSource} style={styles.logoImage} resizeMode="contain" />
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
            inverted={false}
            initialScrollIndex={0}
            onMomentumScrollEnd={handleScrollEnd}
            getItemLayout={(_, index) => ({
              length: contentWidth,
              offset: contentWidth * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              scrollToStep(info.index, true);
            }}
            style={styles.list}
          />
        </View>
        <View style={styles.footer}>
          <OnboardingButton
            currentStep={currentStep}
            onPress={handleNext}
            isLastStep={currentStep === LAST_INDEX}
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
    direction: 'ltr',
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
    direction: 'ltr',
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
    alignItems: 'center',
    // No padding of its own, so the mark lines up with the pagination track
    // and the slides on `content`'s 20px inset.
    gap: 8,
  },
  logoSectionLtr: {
    justifyContent: 'flex-start',
  },
  logoSectionRtl: {
    justifyContent: 'flex-end',
  },
  logoImage: {
    // logo-mark.png is cropped flush, so this is the mark's true rendered size.
    // The old 60 box drew a ~29px mark inside 15.5px of baked-in padding.
    width: 30,
    height: 30,
  },
  logoText: {
    color: colors.primary,
    fontFamily: 'Tektur_400Regular',
    fontSize: 25,
    fontWeight: '400',
    lineHeight: 40,
  },
  pagination: {
    width: '100%',
    height: 40,
    direction: 'ltr',
  },
  listContainer: {
    flex: 1,
    direction: 'ltr',
  },
  list: {
    flex: 1,
    direction: 'ltr',
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
