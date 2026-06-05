import { colors } from '@/theme/colors';
import ArrowLeft02Icon from '@hugeicons/core-free-icons/ArrowLeft02Icon';
import ArrowRight02Icon from '@hugeicons/core-free-icons/ArrowRight02Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  label: string;
}

const DateNavigator = ({ label }: Props) => (
  <View style={styles.row}>
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Previous period"
    >
      <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color={colors.textSecondary} />
    </TouchableOpacity>

    <Text style={styles.label}>{label}</Text>

    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Next period"
    >
      <HugeiconsIcon icon={ArrowRight02Icon} size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  button: {
    padding: 8,
  },
  label: {
    fontFamily: 'Changa_500Medium',
    fontSize: 16,
    lineHeight: 22,
    color: colors.textGray,
  },
});

export default DateNavigator;
