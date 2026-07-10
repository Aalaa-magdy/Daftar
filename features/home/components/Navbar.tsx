import { useAppDirection } from '@/hooks/useAppDirection';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { colors } from '@/theme/colors';
import {
  Changa_400Regular,
  Changa_500Medium,
  useFonts,
} from '@expo-google-fonts/changa';
import Add01Icon from '@hugeicons/core-free-icons/Add01Icon';
import AnalyticsUpIcon from '@hugeicons/core-free-icons/AnalyticsUpIcon';
import DollarCircleIcon from '@hugeicons/core-free-icons/DollarCircleIcon';
import Home01Icon from '@hugeicons/core-free-icons/Home01Icon';
import User03Icon from '@hugeicons/core-free-icons/User03Icon';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react-native';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type NavTab = 'home' | 'history' | 'statistics' | 'profile';

interface Props {
  activeTab?: NavTab;
  onTabPress?: (tab: NavTab) => void;
  onAddPress?: () => void;
}

type TabConfig = {
  id: NavTab;
  labelKey: string;
  icon: IconSvgElement;
};

const TABS: TabConfig[] = [
  { id: 'home', labelKey: 'nav.home', icon: Home01Icon },
  { id: 'history', labelKey: 'nav.history', icon: DollarCircleIcon },
  { id: 'statistics', labelKey: 'nav.statistics', icon: AnalyticsUpIcon },
  { id: 'profile', labelKey: 'nav.profile', icon: User03Icon },
];

const ICON_STROKE_INACTIVE = 1.5;
const ICON_STROKE_ACTIVE = 2.5;

const Navbar = ({
  activeTab = 'history',
  onTabPress,
  onAddPress,
}: Props) => {
  const { t } = useTranslation();
  const { isRTL } = useAppDirection();
  const { navbar } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<NavTab>(activeTab);
  const [fontsLoaded] = useFonts({
    Changa_400Regular,
    Changa_500Medium,
  });

  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  if (!fontsLoaded) {
    return null;
  }

  const handleTabPress = (tab: NavTab) => {
    setSelectedTab(tab);
    onTabPress?.(tab);
  };

  const renderTab = (tab: TabConfig) => {
    const isActive = selectedTab === tab.id;

    return (
      <TouchableOpacity
        key={tab.id}
        style={[styles.item, { minWidth: navbar.itemMinWidth }]}
        activeOpacity={0.7}
        onPress={() => handleTabPress(tab.id)}
      >
        <View style={[styles.iconWrap, { width: navbar.iconSize, height: navbar.iconSize }]}>
          <HugeiconsIcon
            icon={tab.icon}
            size={navbar.iconSize}
            color={isActive ? colors.primary : colors.textSecondary}
            strokeWidth={isActive ? ICON_STROKE_ACTIVE : ICON_STROKE_INACTIVE}
          />
        </View>
        <Text
          style={[
            styles.label,
            {
              fontSize: navbar.labelFontSize,
              lineHeight: navbar.labelLineHeight,
            },
            isActive && styles.labelActive,
          ]}
          numberOfLines={1}
        >
          {t(tab.labelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  const leftTabs = isRTL ? [TABS[3], TABS[2]] : [TABS[0], TABS[1]];
  const rightTabs = isRTL ? [TABS[1], TABS[0]] : [TABS[2], TABS[3]];

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 4), direction: 'ltr' },
      ]}
    >
      <View
        style={[
          styles.fabNotch,
          {
            top: navbar.fabNotchTop,
            width: navbar.fabNotchWidth,
            height: navbar.fabNotchHeight,
          },
        ]}
        pointerEvents="none"
      />

      <View
        style={[
          styles.bar,
          {
            height: navbar.barHeight,
            paddingTop: navbar.barPaddingTop,
          },
        ]}
      >
        <View style={styles.sideGroup}>
          {leftTabs.map((tab) => renderTab(tab))}
        </View>
        <View style={[styles.centerSlot, { width: navbar.centerSlotWidth }]} />
        <View style={styles.sideGroup}>
          {rightTabs.map((tab) => renderTab(tab))}
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            top: navbar.fabTopOffset,
            width: navbar.fabSize,
            height: navbar.fabSize,
            borderRadius: navbar.fabSize / 2,
          },
          pressed && styles.fabPressed,
        ]}
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel={t('nav.addTransaction')}
        android_ripple={{
          color: 'rgba(255,255,255,0.25)',
          borderless: true,
          radius: navbar.fabSize / 2,
        }}
      >
        <HugeiconsIcon icon={Add01Icon} size={navbar.fabIconSize} color={colors.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  fabNotch: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 0,
  },
  sideGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 2,
  },
  centerSlot: {
    flexShrink: 0,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Changa_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  labelActive: {
    fontFamily: 'Changa_500Medium',
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  fabPressed: {
    opacity: 0.9,
  },
});

export default Navbar;
