import { colors } from '@/theme/colors';
import NoteIcon from '@hugeicons/core-free-icons/NoteIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StyleSheet, Text, View } from 'react-native';

const LanguageNoteCard = () => (
  <View style={styles.card}>
    <HugeiconsIcon icon={NoteIcon} size={20} color={colors.primary} />

    <View style={styles.content}>
      <Text style={styles.title}>Important Note</Text>
      <Text style={styles.body}>
        The selected language will be applied throughout the app. You may need to
        restart the app for all changes to take effect completely.
      </Text>
    </View>
  </View>
);

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
