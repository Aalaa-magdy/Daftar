import { StyleSheet, View } from 'react-native';
import React from 'react';
import { colors } from '@/theme/colors';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const TRACK_W = 44; 

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
    justifyContent: 'flex-start',
    gap: 8,
  },
  step: {
    width: TRACK_W,
    height: 4,
    borderRadius: 2,
  },
});

export default Pagination;