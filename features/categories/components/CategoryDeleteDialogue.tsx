import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  visible: boolean;
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CategoryDeleteDialogue = ({
  visible,
  categoryName,
  onClose,
  onConfirm,
}: Props) => {
  const { t } = useTranslation();
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.iconWrap}>
            <HugeiconsIcon icon={Delete02Icon} size={28} color={colors.red} />
          </View>

          <Text style={styles.message}>
            {t('transaction.deleteCategoryConfirm', { name: categoryName })}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.85}
              onPress={onConfirm}
            >
              <Text style={styles.deleteText}>{t('common.yesDelete')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>{t('common.noCancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 27, 10, 0.25)',
  },
  sheet: {
    backgroundColor: colors.backgroundColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    alignItems: 'center',
    gap: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.red}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontFamily: 'Changa_500Medium',
    fontSize: 18,
    lineHeight: 26,
    color: colors.black,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.white,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.primary,
  },
});

export default CategoryDeleteDialogue;
