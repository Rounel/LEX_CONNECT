import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitiales(fullName: string | null | undefined): string {
  if (!fullName) return '?';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Sections menu (statiques) ────────────────────────────────────────────────

const MENU_SECTIONS = [
  {
    title: 'MON COMPTE',
    items: [
      { icon: 'person.fill' as const, label: 'Informations personnelles', route: null },
      { icon: 'lock.fill' as const, label: 'Changer mon mot de passe', route: null },
    ],
  },
  {
    title: 'PRÉFÉRENCES',
    items: [
      { icon: 'bell.fill' as const, label: 'Notifications', route: '/settings/notifications' },
      { icon: 'sun.max.fill' as const, label: 'Affichage', route: '/settings/affichage' },
    ],
  },
  {
    title: 'AIDE',
    items: [
      { icon: 'info.circle.fill' as const, label: 'À propos de Wilex', route: null },
      { icon: 'doc.text.fill' as const, label: 'CGU et Politique vie privée', route: null },
    ],
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfilScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isPremium, logout, refreshProfile } = useAuth();

  // Charge le profil si on est connecté mais que le profil n'est pas encore là
  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshProfile();
    }
  }, [isAuthenticated, user, refreshProfile]);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login' as any);
  };

  const initiales = user ? getInitiales(user.display_name) : '?';
  const displayName = user?.display_name ?? '—';
  const memberSince = user?.created_at ? formatDate(user.created_at) : null;
  const isPremiumActive = user?.is_premium ?? false;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable hitSlop={10} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={22} color={Palette.foreground} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Profil</ThemedText>
        <Pressable
          hitSlop={10}
          onPress={() => router.push('/settings/notifications' as any)}>
          <IconSymbol name="gearshape.fill" size={22} color={Palette.foreground} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── Avatar + nom ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            {!user ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.avatarInitiales}>{initiales}</ThemedText>
            )}
          </View>

          <ThemedText style={styles.userName}>{displayName}</ThemedText>

          {memberSince && (
            <ThemedText style={styles.memberSince}>Membre depuis le {memberSince}</ThemedText>
          )}

          {/* Badge abonnement */}
          <View style={[styles.subBadge, isPremiumActive ? styles.subBadgePremium : styles.subBadgeFree]}>
            <IconSymbol
              name={isPremiumActive ? 'star.fill' : 'person.fill'}
              size={13}
              color={isPremiumActive ? '#C4882C' : Palette.primary}
            />
            <ThemedText style={[styles.subBadgeText, isPremiumActive && styles.subBadgeTextPremium]}>
              {isPremiumActive ? 'Premium' : 'Compte gratuit'}
            </ThemedText>
          </View>
        </View>

        {/* ── Upgrade CTA (comptes gratuits uniquement) ── */}
        {!isPremiumActive && <Pressable style={({ pressed }) => [styles.upgradeCard, pressed && styles.pressed]}>
          <View style={styles.upgradeCardLeft}>
            <IconSymbol name="star.fill" size={18} color="#C4882C" />
            <View style={styles.upgradeCardText}>
              <ThemedText style={styles.upgradeCardTitle}>Passer à Premium</ThemedText>
              <ThemedText style={styles.upgradeCardDesc}>
                Accès à tous les textes, téléchargement, lecture hors ligne
              </ThemedText>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={14} color={Palette.accent2} />
        </Pressable>}

        {/* ── Menu sections ── */}
        {MENU_SECTIONS.map(section => (
          <View key={section.title} style={styles.menuSection}>
            <ThemedText style={styles.menuSectionTitle}>{section.title}</ThemedText>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <View key={item.label}>
                  <Pressable
                    style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
                    onPress={() => item.route && router.push(item.route as any)}>
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuIconWrap}>
                        <IconSymbol name={item.icon} size={16} color={Palette.primary} />
                      </View>
                      <ThemedText style={styles.menuItemLabel}>{item.label}</ThemedText>
                    </View>
                    <IconSymbol name="chevron.right" size={14} color={Palette.accent2} />
                  </Pressable>
                  {i < section.items.length - 1 && <View style={styles.menuSep} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* ── Déconnexion ── */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}
          onPress={handleLogout}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={18} color="#C0392B" />
          <ThemedText style={styles.logoutText}>Se déconnecter</ThemedText>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },

  // ── Avatar ──────────────────────────────────────────────────────────────────
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 6,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitiales: {
    fontSize: 30,
    fontFamily: Fonts.heading.bold,
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  memberSince: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // ── Badge abonnement ─────────────────────────────────────────────────────────
  subBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  subBadgeFree: {
    backgroundColor: Palette.accent1,
  },
  subBadgePremium: {
    backgroundColor: '#FDF3E3',
  },
  subBadgeText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  subBadgeTextPremium: {
    color: '#C4882C',
  },
  // ── Upgrade CTA ──────────────────────────────────────────────────────────────
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDF3E3',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0D9B5',
  },
  upgradeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  upgradeCardText: { flex: 1, gap: 2 },
  upgradeCardTitle: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#C4882C',
  },
  upgradeCardDesc: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 17,
  },

  // ── Menu ─────────────────────────────────────────────────────────────────────
  menuSection: { marginBottom: 20 },
  menuSectionTitle: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  menuSep: {
    height: 1,
    backgroundColor: Palette.background,
    marginLeft: 60,
  },

  // ── Déconnexion ───────────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FDEDEB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  logoutText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: '#C0392B',
  },

  pressed: { opacity: 0.72 },
});
