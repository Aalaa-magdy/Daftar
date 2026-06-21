import { colors } from '@/theme/colors';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useProfile } from '../hooks';
import { resolveProfileAvatarSource } from '../lib/profile-avatar';

const ProfileUserCard = () => {
  const { data: profile, isLoading } = useProfile();
  const avatarSource = resolveProfileAvatarSource(profile?.profileImage);

  return (
    <View style={styles.card}>
      <View style={styles.avatarWrap}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
      </View>

      <View style={styles.info}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <Text style={styles.name}>{profile?.name ?? '—'}</Text>
            <Text style={styles.email}>{profile?.email ?? '—'}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 24,
    color: colors.black,
  },
  email: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});

export default ProfileUserCard;