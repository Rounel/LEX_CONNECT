import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Data ─────────────────────────────────────────────────────────────────────

const USER = {
  prenom: 'Jean-Paul',
  nom: 'Dupont',
  initiales: 'JD',
  profil: 'Étudiant en droit',
  profilIcon: 'graduationcap.fill' as const,
  email: 'jean-paul.dupont@email.com',
};

const STATS = [
  { label: 'Textes suivis', value: '12' },
  { label: 'Conversations', value: '47' },
  { label: 'Quiz faits', value: '230' },
];

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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
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
            <ThemedText style={styles.avatarInitiales}>{USER.initiales}</ThemedText>
          </View>
          <ThemedText style={styles.userName}>{USER.prenom} {USER.nom}</ThemedText>
          <ThemedText style={styles.userEmail}>{USER.email}</ThemedText>
          <View style={styles.profilBadge}>
            <IconSymbol name={USER.profilIcon} size={14} color={Palette.primary} />
            <ThemedText style={styles.profilBadgeText}>{USER.profil}</ThemedText>
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={styles.statsRow}>
          {STATS.map(s => (
            <View key={s.label} style={styles.statCard}>
              <ThemedText style={styles.statValue}>{s.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
            </View>
          ))}
        </View>

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
          onPress={() => router.replace('/(auth)/login' as any)}>
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
    gap: 0,
  },

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
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
  userEmail: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  profilBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.accent1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  profilBadgeText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    color: Palette.primary,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },

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
