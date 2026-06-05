import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Logout03Icon from '@hugeicons/core-free-icons/Logout03Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
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
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutDialogue = ({ visible, onClose, onConfirm }: Props) => {
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
            <HugeiconsIcon icon={Logout03Icon} size={28} color={colors.red} />
          </View>

          <Text style={styles.message}>Are you sure you want to log out?</Text>
          <Text style={styles.subtitle}>You can log back in at any time.</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.85}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>Yes, Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>No, Cancel</Text>
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
    gap: 12,
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
  subtitle: {
    fontFamily: 'Changa_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginTop: -4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
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

export default LogoutDialogue;
