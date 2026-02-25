import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Fonts, Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ProfileSidebar } from '@/components/ui/profile-sidebar';
import { NotificationsSidebar } from '@/components/ui/notifications-sidebar';

const UNREAD_NOTIFICATIONS = 2;

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const canGoBack = router.canGoBack();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.inner}>
          {/* Gauche : bouton retour ou espace vide */}
          <View style={styles.side}>
            {canGoBack && (
              <Pressable
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
                onPress={() => router.back()}
                hitSlop={8}>
                <IconSymbol name="chevron.left" size={24} color={Palette.foreground} />
              </Pressable>
            )}
          </View>

          {/* Centre : titre */}
          <ThemedText style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>

          {/* Droite : cloche + avatar */}
          <View style={[styles.side, styles.rightSide]}>
            <Pressable
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              onPress={() => setNotificationsOpen(true)}
              hitSlop={8}>
              <IconSymbol name="bell.fill" size={22} color={Palette.foreground} />
              {UNREAD_NOTIFICATIONS > 0 && (
                <View style={styles.badge}>
                  <ThemedText style={styles.badgeText}>{UNREAD_NOTIFICATIONS}</ThemedText>
                </View>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}
              onPress={() => setProfileOpen(true)}>
              <ThemedText style={styles.avatarInitial}>K</ThemedText>
            </Pressable>
          </View>
        </View>
      </View>

      <ProfileSidebar visible={profileOpen} onClose={() => setProfileOpen(false)} />
      <NotificationsSidebar
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.accent2 + '50',
  },
  inner: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  side: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSide: {
    justifyContent: 'flex-end',
    gap: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  pressed: {
    opacity: 0.55,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPressed: {
    opacity: 0.7,
  },
  avatarInitial: {
    fontSize: 14,
    fontFamily: Fonts.heading.bold,
    color: Palette.primary,
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Fonts.body.bold,
    color: '#FFF',
    lineHeight: 14,
  },
});
