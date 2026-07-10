import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const TABLET_SHORT_EDGE = 600;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function isTabletLayout(width: number, height: number) {
  return Math.min(width, height) >= TABLET_SHORT_EDGE;
}

export function getHomeInfoLayout(screenHeight: number, isTablet: boolean) {
  const height = isTablet
    ? Math.round(clamp(screenHeight * 0.22, 280, 360))
    : Math.round(clamp(screenHeight * 0.29, 220, 260));

  return {
    height,
    padding: isTablet ? 24 : 20,
    balanceFontSize: isTablet ? 42 : 36,
    balanceLineHeight: isTablet ? 58 : 52,
    secondRowMinHeight: isTablet ? 60 : 52,
    thirdRowGap: isTablet ? 28 : 20,
    thirdRowMarginBottom: isTablet ? 26 : 22,
  };
}

export function getNavbarLayout(screenHeight: number, isTablet: boolean) {
  const barHeight = isTablet
    ? Math.round(clamp(screenHeight * 0.07, 64, 76))
    : 52;
  const fabSize = isTablet ? 58 : 50;
  const fabTopOffset = -(fabSize / 2 + 2);

  return {
    barHeight,
    fabSize,
    fabTopOffset,
    fabNotchWidth: fabSize,
    fabNotchHeight: Math.round(fabSize * 0.56),
    fabNotchTop: Math.round(-fabSize * 0.28),
    centerSlotWidth: isTablet ? 64 : 56,
    iconSize: isTablet ? 28 : 24,
    fabIconSize: isTablet ? 32 : 28,
    labelFontSize: isTablet ? 15 : 14,
    labelLineHeight: isTablet ? 18 : 16,
    itemMinWidth: isTablet ? 68 : 56,
    barPaddingTop: isTablet ? 6 : 4,
  };
}

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isTablet = isTabletLayout(width, height);

    return {
      isTablet,
      screenWidth: width,
      screenHeight: height,
      homeInfo: getHomeInfoLayout(height, isTablet),
      navbar: getNavbarLayout(height, isTablet),
    };
  }, [width, height]);
}
