import { colors } from '@/theme/colors';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import type { ProfileMenuSection as ProfileMenuSectionType } from '../data/profile-menu';
import ProfileMenuItem from './ProfileMenuItem';

interface Props {
  section: ProfileMenuSectionType;
  onItemPress?: (itemId: string) => void;
}

const ProfileMenuSection = ({ section, onItemPress }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{t(section.titleKey)}</Text>
      <View style={styles.card}>
        {section.items.map((item, index) => (
          <ProfileMenuItem
            key={item.id}
            label={t(item.labelKey)}
            icon={item.icon}
            showDivider={index < section.items.length - 1}
            onPress={() => onItemPress?.(item.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  title: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default ProfileMenuSection;
