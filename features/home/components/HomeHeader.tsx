import SoloLogo from '@/assets/images/SoloLogo.svg';
import { useProfile } from '@/features/profile/hooks';
import { resolveProfileAvatarSource } from '@/features/profile/lib/profile-avatar';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

const HORIZONTAL_PADDING = 20;
/** Cancel header padding so the logo aligns with the content edge. */
const LOGO_OUTER_NUDGE = 20;

const HomeHeader = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();
  const avatarSource = resolveProfileAvatarSource(profile?.profileImage);

  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const displayName = useMemo(() => {
    const name = profile?.name?.trim();
    if (name) return name;

    const email = profile?.email?.trim();
    if (email) return email.split('@')[0];

    return '';
  }, [profile?.name, profile?.email]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <Image source={avatarSource} style={styles.image} />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.welcome}>{t('home.welcomeBack')}</Text>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.loader}
            />
          ) : (
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.logoWrap}>
        <SoloLogo width={80} height={40} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
    paddingEnd: 12,
  },
  imageWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 13,
    fontFamily: 'Changa_400Regular',
    color: colors.textGray,
    lineHeight: 16,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Changa_500Medium',
    color: colors.black,
  },
  loader: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  logoWrap: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // Logical end = right in LTR, left in RTL (avoids mirrored left/right margins).
    marginEnd: -LOGO_OUTER_NUDGE,
  },
});

export default HomeHeader;
