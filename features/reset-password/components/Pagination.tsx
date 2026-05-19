import { StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '@/theme/colors';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const TRACK_W = 10;

const Pagination: React.FC<Props> = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <View style={styles.container}>
      {steps.map((step) => (
        <View
          key={step}
          style={[
            styles.step,
            {
              backgroundColor:
                step === currentStep ? colors.primary : colors.light,
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
    justifyContent: 'flex-start',
    gap: 16,
  },
  step: {
    width: TRACK_W,
    height: 10,
    borderRadius: 50,
  },
});

export default Pagination;
