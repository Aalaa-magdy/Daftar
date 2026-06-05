import { colors } from '@/theme/colors';
import { StyleSheet, Text, View } from 'react-native';
import type { ProfileMenuSection as ProfileMenuSectionType } from '../data/profile-menu';
import ProfileMenuItem from './ProfileMenuItem';

interface Props {
  section: ProfileMenuSectionType;
}

const ProfileMenuSection = ({ section }: Props) => (
  <View style={styles.wrap}>
    <Text style={styles.title}>{section.title}</Text>
    <View style={styles.card}>
      {section.items.map((item, index) => (
        <ProfileMenuItem
          key={item.id}
          label={item.label}
          icon={item.icon}
          showDivider={index < section.items.length - 1}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  title: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    paddingHorizontal: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default ProfileMenuSection;
