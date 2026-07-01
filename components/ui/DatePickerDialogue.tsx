import DatePicker from '@/components/ui/DatePicker';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  value: Date | null;
  onClose: () => void;
  onChange: (date: Date) => void;
  /** Extra offset below the status bar (default shows picker in upper area). */
  topOffset?: number;
  /** When true, render as an absolute overlay instead of a native Modal. */
  useOverlay?: boolean;
  overlayHostStyle?: StyleProp<ViewStyle>;
};

export default function DatePickerDialogue({
  visible,
  value,
  onClose,
  onChange,
  topOffset = 120,
  useOverlay = false,
  overlayHostStyle,
}: Props) {
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  const handleSelect = (date: Date) => {
    onChange(date);
    onClose();
  };

  const content = (
    <View style={styles.root}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close date picker"
      />
      <View
        style={[styles.sheet, { paddingTop: insets.top + topOffset }]}
        pointerEvents="box-none"
      >
        <View style={styles.card}>
          <DatePicker value={value} onChange={handleSelect} />
        </View>
      </View>
    </View>
  );

  if (useOverlay) {
    return <View style={[styles.overlayHost, overlayHostStyle]}>{content}</View>;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayHost: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
  root: {
    flex: 1,
    direction: 'ltr',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 27, 10, 0.25)',
  },
  sheet: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
    elevation: 10,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    zIndex: 3,
    elevation: 12,
  },
});
