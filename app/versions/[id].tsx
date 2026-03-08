import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_VERSIONS = [
  {
    num: 'v3.2',
    date: '15 janvier 2024',
    jorci: 'JORCI n°42 du 20/01/2024',
    detail: 'Modification des articles 45 à 48 relatifs aux successions ab intestat. Harmonisation avec les dispositions du droit de la famille.',
    actif: true,
  },
  {
    num: 'v3.1',
    date: '04 juin 2022',
    jorci: 'JORCI n°28 du 10/06/2022',
    detail: "Intégration des dispositions OHADA relatives aux obligations contractuelles. Mise à jour des articles 201 à 215.",
    actif: false,
  },
  {
    num: 'v3.0',
    date: '12 mars 2019',
    jorci: 'JORCI n°11 du 18/03/2019',
    detail: 'Version initiale consolidée. Codification complète du droit civil ivoirien.',
    actif: false,
  },
  {
    num: 'v2.1',
    date: '07 septembre 2012',
    jorci: 'JORCI n°38 du 20/09/2012',
    detail: 'Modification des dispositions relatives à l\'autorité parentale et à la tutelle des mineurs.',
    actif: false,
  },
  {
    num: 'v2.0',
    date: '23 avril 2007',
    jorci: 'JORCI n°17 du 30/04/2007',
    detail: 'Refonte partielle du Livre II relatif aux successions et aux libéralités.',
    actif: false,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function VersionsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Historique des versions</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ThemedText style={styles.docTitle}>Code Civil de Côte d&apos;Ivoire</ThemedText>

        {MOCK_VERSIONS.map((v, i) => (
          <View key={v.num} style={styles.row}>
            {/* Timeline */}
            <View style={styles.timeline}>
              <View style={[styles.dot, v.actif && styles.dotActive]} />
              {i < MOCK_VERSIONS.length - 1 && <View style={styles.line} />}
            </View>

            {/* Content */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <ThemedText style={[styles.versionNum, v.actif && styles.versionNumActive]}>
                  {v.num}
                </ThemedText>
                {v.actif && (
                  <View style={styles.activeBadge}>
                    <ThemedText style={styles.activeBadgeText}>EN VIGUEUR</ThemedText>
                  </View>
                )}
              </View>
              <ThemedText style={styles.versionDate}>{v.date}</ThemedText>
              {v.jorci ? (
                <ThemedText style={styles.jorci}>{v.jorci}</ThemedText>
              ) : null}
              <ThemedText style={styles.versionDetail}>{v.detail}</ThemedText>
              <Pressable
                style={({ pressed }) => [styles.consultBtn, pressed && styles.pressed]}
                onPress={() => router.push(`/reader/${id ?? '1'}` as any)}>
                <ThemedText style={styles.consultBtnText}>
                  {v.actif ? 'Lire cette version' : 'Consulter'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.background },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 4,
    backgroundColor: Palette.background,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  backText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 48,
  },

  docTitle: {
    fontSize: 15,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.accent2,
    marginBottom: 24,
  },

  row: {
    flexDirection: 'row',
    gap: 16,
  },

  timeline: {
    alignItems: 'center',
    width: 16,
    paddingTop: 4,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Palette.accent2,
    backgroundColor: '#fff',
    flexShrink: 0,
  },
  dotActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Palette.accent2 + '40',
    marginVertical: 4,
    minHeight: 40,
  },

  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionNum: {
    fontSize: 15,
    fontFamily: Fonts.heading.bold,
    color: Palette.accent2,
  },
  versionNumActive: { color: Palette.primary },
  activeBadge: {
    backgroundColor: Palette.accent1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  activeBadgeText: {
    fontSize: 9,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  versionDate: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  jorci: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  versionDetail: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 19,
  },
  consultBtn: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  consultBtnText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  pressed: { opacity: 0.7 },
});
