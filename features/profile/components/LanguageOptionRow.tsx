import { colors } from '@/theme/colors';
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/CheckmarkCircle02Icon';import LanguageCircleIcon from '@hugeicons/core-free-icons/LanguageCircleIcon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  showDivider?: boolean;
}

const SELECTED_CHECK_COLOR = '#F59E0B';

const LanguageOptionRow = ({
  label,
  selected,
  onPress,
  showDivider = false,
}: Props) => (
  <View>
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <View style={[styles.iconWrap, selected ? styles.iconWrapSelected : null]}>
        <HugeiconsIcon
          icon={LanguageCircleIcon}
          size={22}
          color={selected ? colors.primary : colors.textSecondary}
        />
      </View>

      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>
        {label}
      </Text>

      {selected ? (
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          size={24}
          color={SELECTED_CHECK_COLOR}
        />
      ) : (
        <View style={styles.checkSpacer} />
      )}
    </TouchableOpacity>

    {showDivider ? <View style={styles.divider} /> : null}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.buttonSecondaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    backgroundColor: colors.secondary,
  },
  label: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  labelSelected: {
    fontFamily: 'Changa_500Medium',
    color: colors.black,
  },
  labelDefault: {
    fontFamily: 'Changa_400Regular',
    color: colors.textSecondary,
  },
  checkSpacer: {
    width: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
});

export default LanguageOptionRow;
