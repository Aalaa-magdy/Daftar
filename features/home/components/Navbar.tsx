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

const ICON_SIZE = 24;
const ICON_STROKE_INACTIVE = 1.5;
const ICON_STROKE_ACTIVE = 2.5;
const FAB_SIZE = 50;
const CENTER_SLOT_WIDTH = 56;

const Navbar = ({
  activeTab = 'history',
  onTabPress,
  onAddPress,
}: Props) => {
  const { t } = useTranslation();
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
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => handleTabPress(tab.id)}
      >
        <View style={styles.iconWrap}>
          <HugeiconsIcon
            icon={tab.icon}
            size={ICON_SIZE}
            color={isActive ? colors.primary : colors.textSecondary}
            strokeWidth={isActive ? ICON_STROKE_ACTIVE : ICON_STROKE_INACTIVE}
          />
        </View>
        <Text
          style={[styles.label, isActive && styles.labelActive]}
          numberOfLines={1}
        >
          {t(tab.labelKey)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 4), direction: 'ltr' },
      ]}
    >
      <View style={styles.fabNotch} pointerEvents="none" />

      <View style={styles.bar}>
        <View style={styles.sideGroup}>
          {renderTab(TABS[0])}
          {renderTab(TABS[1])}
        </View>
        <View style={styles.centerSlot} />
        <View style={styles.sideGroup}>
          {renderTab(TABS[2])}
          {renderTab(TABS[3])}
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={onAddPress}
        accessibilityRole="button"
        accessibilityLabel={t('nav.addTransaction')}
        android_ripple={{
          color: 'rgba(255,255,255,0.25)',
          borderless: true,
          radius: 28,
        }}
      >
        <HugeiconsIcon icon={Add01Icon} size={28} color={colors.white} />
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
    top: -14,
    alignSelf: 'center',
    width: FAB_SIZE,
    height: 28,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    height: 52,
    paddingHorizontal: 10,
    paddingTop: 4,
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
    width: CENTER_SLOT_WIDTH,
    flexShrink: 0,
  },
  item: {
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    lineHeight: 16,
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
    top: -22,
    alignSelf: 'center',
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: 28,
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
