import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const SIDEBAR_WIDTH = 280;

const MENU_ITEMS = [
  { icon: 'person.fill' as const, label: 'Mon profil' },
  { icon: 'heart.fill' as const, label: 'Suivis' },
  { icon: 'gears' as const, label: 'Paramètres' },
];

type ProfileSidebarProps = {
  visible: boolean;
  onClose: () => void;
};

export function ProfileSidebar({ visible, onClose }: ProfileSidebarProps) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.45,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: SIDEBAR_WIDTH,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => setModalVisible(false));
    }
  }, [visible]);

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.panel,
            { transform: [{ translateX: slideAnim }], paddingBottom: insets.bottom + 16 },
          ]}>
          {/* En-tête profil */}
          <View style={[styles.profileHeader, { paddingTop: insets.top + 28 }]}>
            <View style={styles.avatarLarge}>
              <ThemedText style={styles.avatarInitial}>K</ThemedText>
            </View>
            <ThemedText style={styles.userName}>Kouadio</ThemedText>
            <ThemedText style={styles.userEmail}>kouadio@example.com</ThemedText>
          </View>

          <View style={styles.divider} />

          {/* Menu */}
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              onPress={onClose}>
              <IconSymbol name={item.icon} size={20} color={Palette.primary} />
              <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
              <IconSymbol name="chevron.right" size={16} color={Palette.accent2} />
            </Pressable>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: Palette.background,
    shadowColor: '#000',
    shadowOffset: { width: -3, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 6,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Palette.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarInitial: {
    fontSize: 28,
    fontFamily: Fonts.heading.bold,
    color: Palette.primary,
  },
  userName: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  userEmail: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.accent2,
    opacity: 0.2,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  menuItemPressed: {
    backgroundColor: Palette.accent1,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
});
