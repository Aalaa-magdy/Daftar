import { StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '@/theme/colors';
import { useAppDirection } from '@/hooks/useAppDirection';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const TRACK_W = 44;

const Pagination: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const { isRTL } = useAppDirection();
  const steps = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <View
      style={[
        styles.container,
        isRTL ? styles.containerRtl : styles.containerLtr,
      ]}
    >
      {steps.map((step) => (
        <View
          key={step}
          style={[
            styles.step,
            {
              backgroundColor:
                step <= currentStep ? colors.primary : '#D3D3D3',
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 16,
    alignItems: 'center',
    gap: 8,
  },
  containerLtr: {
    justifyContent: 'flex-start',
  },
  containerRtl: {
    justifyContent: 'flex-end',
  },
  step: {
    width: TRACK_W,
    height: 4,
    borderRadius: 2,
  },
});

export default Pagination;
