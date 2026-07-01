import { useDirectionalIcons } from '@/hooks/useDirectionalIcons';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const patternSource = require('@/assets/images/background-pattern-decorative.png');

interface Props {
  title: string;
  description: string;
  icon: IconSvgElement;
  onBackPress?: () => void;
  /** Bold line shown after description (e.g. email on check step) */
  highlightText?: string;
  whiteBackground?: boolean;
}

const ResetHeader = ({
  title,
  description,
  icon,
  onBackPress,
  highlightText,
  whiteBackground = false,
}: Props) => {
  const { t } = useTranslation();
  const { isRTL, backIcon } = useDirectionalIcons();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.root, whiteBackground && styles.rootWhite]}>
      <ImageBackground
        source={patternSource}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {onBackPress ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('common.goBack')}
          style={[
            styles.backButton,
            { top: Math.max(insets.top, 8) },
            isRTL ? styles.backButtonRtl : styles.backButtonLtr,
          ]}
          onPress={onBackPress}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <HugeiconsIcon
            icon={backIcon}
            size={28}
            color={colors.textGray}
          />
        </TouchableOpacity>
      ) : null}

      <View style={styles.centerContent}>
        <View style={styles.iconContainer}>
          <HugeiconsIcon icon={icon} size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>
          {description}
          {highlightText ? (
            <Text style={styles.descriptionHighlight}> {highlightText}</Text>
          ) : null}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    backgroundColor: colors.background,
    marginBottom:16
  },
  rootWhite: {
    backgroundColor: colors.white,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '90%',
  },
  backButton: {
    position: 'absolute',
    zIndex: 10,
    paddingVertical: 8,
  },
  backButtonLtr: {
    left: 16,
  },
  backButtonRtl: {
    right: 16,
  },
  centerContent: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 40,
    marginTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 23,
    lineHeight: 36,
    fontFamily: 'Changa_500Medium',
    color: colors.black,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Changa_400Regular',
    color: colors.textGray,
    textAlign: 'center',
  },
  descriptionHighlight: {
    fontFamily: 'Changa_500Medium',
    color: colors.black,
  },
});

export default ResetHeader;
