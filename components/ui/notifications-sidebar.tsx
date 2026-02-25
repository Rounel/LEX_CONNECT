import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts, Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const SIDEBAR_WIDTH = 300;

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Nouveau concours disponible',
    body: "Le concours d'entrée à l'INPHB 2026 est ouvert aux inscriptions.",
    time: 'Il y a 2h',
    unread: true,
  },
  {
    id: '2',
    title: 'Loi mise à jour',
    body: 'Le Code du travail ivoirien a été mis à jour avec les nouvelles dispositions.',
    time: 'Il y a 1j',
    unread: true,
  },
  {
    id: '3',
    title: 'Alexia vous répond',
    body: 'Votre question sur les droits de succession a reçu une réponse.',
    time: 'Il y a 3j',
    unread: false,
  },
  {
    id: '4',
    title: 'Résultats publiés',
    body: 'Les résultats du concours de la Magistrature 2025 sont disponibles.',
    time: 'Il y a 5j',
    unread: false,
  },
];

type NotificationsSidebarProps = {
  visible: boolean;
  onClose: () => void;
};

export function NotificationsSidebar({ visible, onClose }: NotificationsSidebarProps) {
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

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.panel,
            { transform: [{ translateX: slideAnim }], paddingBottom: insets.bottom },
          ]}>
          {/* En-tête */}
          <View style={[styles.panelHeader, { paddingTop: insets.top + 16 }]}>
            <View style={styles.panelTitleRow}>
              <ThemedText style={styles.panelTitle}>Notifications</ThemedText>
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <ThemedText style={styles.unreadBadgeText}>{unreadCount}</ThemedText>
                </View>
              )}
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={({ pressed }) => pressed && styles.pressed}>
              <IconSymbol name="xmark" size={20} color={Palette.foreground} />
            </Pressable>
          </View>

          {/* Liste */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {NOTIFICATIONS.map((notif) => (
              <Pressable
                key={notif.id}
                style={({ pressed }) => [
                  styles.notifItem,
                  notif.unread && styles.notifUnread,
                  pressed && styles.notifPressed,
                ]}
                onPress={onClose}>
                <View style={styles.notifLeft}>
                  {notif.unread ? (
                    <View style={styles.dot} />
                  ) : (
                    <View style={styles.dotPlaceholder} />
                  )}
                </View>
                <View style={styles.notifContent}>
                  <ThemedText style={styles.notifTitle}>{notif.title}</ThemedText>
                  <ThemedText style={styles.notifBody} numberOfLines={2}>
                    {notif.body}
                  </ThemedText>
                  <ThemedText style={styles.notifTime}>{notif.time}</ThemedText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
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
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.accent2 + '33',
  },
  panelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  panelTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  unreadBadge: {
    backgroundColor: Palette.primary,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.body.bold,
    color: '#FFF',
  },
  pressed: {
    opacity: 0.6,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Palette.accent2 + '1A',
    gap: 8,
  },
  notifUnread: {
    backgroundColor: Palette.accent1 + '66',
  },
  notifPressed: {
    backgroundColor: Palette.accent1,
  },
  notifLeft: {
    width: 10,
    alignItems: 'center',
    paddingTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
  },
  dotPlaceholder: {
    width: 8,
    height: 8,
  },
  notifContent: {
    flex: 1,
    gap: 3,
  },
  notifTitle: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  notifBody: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 17,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    marginTop: 2,
  },
});
