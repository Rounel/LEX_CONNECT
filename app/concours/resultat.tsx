import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Mock theme breakdown ─────────────────────────────────────────────────────

const THEMES = [
  { label: 'Droit civil', pct: 80 },
  { label: 'Procédure civile', pct: 70 },
  { label: 'OHADA', pct: 90 },
  { label: 'Droit pénal', pct: 60 },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ResultatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score: string; total: string }>();
  const score = parseInt(params.score ?? '15', 10);
  const total = parseInt(params.total ?? '20', 10);
  const pct = Math.round((score / total) * 100);

  const mention =
    pct >= 80 ? { label: 'Excellent !', color: '#1E7A47', bg: '#E6F6EE' }
    : pct >= 60 ? { label: 'Bien', color: '#D4821A', bg: '#FEF4E8' }
    : { label: 'À retravailler', color: '#C0392B', bg: '#FDEDEB' };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Résultats</ThemedText>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Score principal ── */}
        <View style={styles.scoreBlock}>
          <ThemedText style={styles.scoreNum}>{score}/{total}</ThemedText>
          <ThemedText style={[styles.scorePct, { color: mention.color }]}>{pct}%</ThemedText>
          <View style={[styles.mentionBadge, { backgroundColor: mention.bg }]}>
            <ThemedText style={[styles.mentionText, { color: mention.color }]}>
              {mention.label}
            </ThemedText>
          </View>
        </View>

        {/* ── Barre de progression ── */}
        <View style={styles.barWrapper}>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: mention.color }]} />
          </View>
        </View>

        {/* ── Stat cards ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardCorrect]}>
            <ThemedText style={[styles.statValue, { color: '#1E7A47' }]}>{score}</ThemedText>
            <ThemedText style={styles.statLabel}>Correctes</ThemedText>
          </View>
          <View style={[styles.statCard, styles.statCardWrong]}>
            <ThemedText style={[styles.statValue, { color: '#C0392B' }]}>{total - score}</ThemedText>
            <ThemedText style={styles.statLabel}>Incorrectes</ThemedText>
          </View>
        </View>

        {/* ── Répartition par thème ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>RÉPARTITION PAR THÈME</ThemedText>
          {THEMES.map(t => {
            const c = t.pct >= 70 ? '#1E7A47' : '#D4821A';
            return (
              <View key={t.label} style={styles.themeRow}>
                <ThemedText style={styles.themeLabel}>{t.label}</ThemedText>
                <View style={styles.themeTrack}>
                  <View style={[styles.themeFill, { width: `${t.pct}%` as any, backgroundColor: c }]} />
                </View>
                <ThemedText style={[styles.themePct, { color: c }]}>{t.pct}%</ThemedText>
              </View>
            );
          })}
        </View>

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <Pressable
            style={styles.retryBtn}
            onPress={() => router.replace('/concours/quiz' as any)}>
            <IconSymbol name="arrow.counterclockwise" size={16} color={Palette.primary} />
            <ThemedText style={styles.retryBtnText}>Recommencer le quiz</ThemedText>
          </Pressable>
          <Pressable
            style={styles.errorsBtn}
            onPress={() => router.back()}>
            <ThemedText style={styles.errorsBtnText}>Voir les erreurs</ThemedText>
          </Pressable>
          <Pressable
            style={styles.homeBtn}
            onPress={() => router.replace('/(tabs)/concours' as any)}>
            <ThemedText style={styles.homeBtnText}>Retour aux concours</ThemedText>
          </Pressable>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },

  content: { paddingHorizontal: 20, paddingBottom: 48, gap: 24 },

  scoreBlock: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 8,
  },
  scoreNum: {
    fontSize: 52,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 60,
  },
  scorePct: {
    fontSize: 26,
    fontFamily: Fonts.heading.bold,
  },
  mentionBadge: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 20,
  },
  mentionText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
  },

  barWrapper: {},
  barTrack: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },

  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statCardCorrect: { backgroundColor: '#E6F6EE' },
  statCardWrong: { backgroundColor: '#FDEDEB' },
  statValue: {
    fontSize: 32,
    fontFamily: Fonts.heading.bold,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  section: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeLabel: {
    width: 130,
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  themeTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  themeFill: {
    height: 6,
    borderRadius: 3,
  },
  themePct: {
    width: 36,
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    textAlign: 'right',
  },

  actions: { gap: 10 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    backgroundColor: '#fff',
  },
  retryBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  errorsBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorsBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  homeBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: Palette.primary,
  },
  homeBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },
});
