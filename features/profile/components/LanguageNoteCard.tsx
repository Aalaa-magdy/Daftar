import { colors } from '@/theme/colors';
import NoteIcon from '@hugeicons/core-free-icons/NoteIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  StyleSheet,
  View,
} from "react-native";
import { Text } from "@/components/ui/AppText";
import { useTranslation } from 'react-i18next';

const LanguageNoteCard = () => {
  const { t } = useTranslation();

  return (
  <View style={styles.card}>
    <HugeiconsIcon icon={NoteIcon} size={20} color={colors.primary} />

    <View style={styles.content}>
      <Text style={styles.title}>{t('profile.languageNoteTitle')}</Text>
      <Text style={styles.body}>{t('profile.languageNoteBody')}</Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.black,
  },
  body: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});

export default LanguageNoteCard;
