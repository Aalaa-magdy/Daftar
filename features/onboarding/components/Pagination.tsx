import { StyleSheet, View, Animated } from 'react-native';
import React from 'react';
import { colors } from '@/theme/colors';

interface Props {
  scrollX: Animated.Value;
  pageWidth: number;
  /** Number of horizontal bars (intro steps before the auth slide). */
  stepCount: number;
}

const TRACK_W = 44;

const Pagination: React.FC<Props> = ({ scrollX, pageWidth, stepCount }) => {
  return (
    <View>
        
    </View>
  );
};

const styles = StyleSheet.create({

});

export default Pagination;
