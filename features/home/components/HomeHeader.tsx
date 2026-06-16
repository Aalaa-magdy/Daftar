import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import { colors } from '@/theme/colors';
import SoloLogo from '@/assets/images/SoloLogo.svg';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

const fallbackAvatar = require('@/assets/images/profile.jpg');

const HomeHeader = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading, isGuest } = useProfile();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  const displayName = useMemo(() => {
    if (isGuest) {
      return t('common.guest');
    }

    const name = profile?.name?.trim();
    if (name) return name;

    const email = profile?.email?.trim();
    if (email) return email.split('@')[0];

    return '';
  }, [isGuest, profile?.name, profile?.email, t]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageWrapper}>
          <Image source={fallbackAvatar} style={styles.image} />
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
            <Text style={styles.name}>{displayName}</Text>
          )}
        </View>
      </View>

      <SoloLogo width={80} height={40} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  imageWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    justifyContent: 'center',
    marginTop: 10,
    marginLeft: 4,
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
});

export default HomeHeader;
