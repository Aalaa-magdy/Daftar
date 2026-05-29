import { colors } from '@/theme/colors';
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon';
import { HugeiconsIcon } from '@hugeicons/react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  value: string;
  placeholder: string;
  options: readonly string[];
  onSelect: (value: string) => void;
  icon: ReactNode;
  open: boolean;
  onToggle: () => void;
}

const SelectField = ({
  value,
  placeholder,
  options,
  onSelect,
  icon,
  open,
  onToggle,
}: Props) => (
  <View style={[styles.box, open && styles.boxOpen]}>
    <TouchableOpacity
      style={styles.trigger}
      activeOpacity={0.85}
      onPress={onToggle}
    >
      <View style={styles.leftIcon}>{icon}</View>
      <Text style={[styles.value, !value && styles.placeholder]}>
        {value || placeholder}
      </Text>
      <HugeiconsIcon icon={ArrowDown01Icon} size={20} color={colors.captionMuted} />
    </TouchableOpacity>

    {open ? (
      <View style={styles.menu}>
        {options.map((option) => {
          const isSelected = value === option;

          return (
            <TouchableOpacity
              key={option}
              style={[styles.option, isSelected && styles.optionSelected]}
              activeOpacity={0.85}
              onPress={() => {
                onSelect(option);
                onToggle();
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  boxOpen: {
    borderColor: colors.border,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  leftIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    flex: 1,
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
  placeholder: {
    color: colors.captionMuted,
  },
  menu: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionSelected: {
    backgroundColor: colors.secondary,
  },
  optionText: {
    fontFamily: 'Changa_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
});

export default SelectField;
