import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Mock data ────────────────────────────────────────────────────────────────

const CONCOURS_DATA: Record<string, any> = {
  default: {
    titre: 'Concours de la Magistrature',
    institution: 'Institut National de Formation Judiciaire (INFJ)',
    statut: 'Ouvert',
    statutColor: '#1E7A47',
    statutBg: '#E6F6EE',
    accentColor: '#162660',
    stats: [
      { label: 'Ouverture', value: '25/03' },
      { label: 'Clôture', value: '30/03' },
      { label: 'Résultats', value: 'Juin' },
    ],
    description: `Le concours d'entrée à l'Institut National de Formation Judiciaire recrute des magistrats pour les juridictions ivoiriennes. Ce concours est organisé par le Ministère de la Justice et ouvert aux titulaires d'une licence en Droit au minimum.\n\nLes lauréats suivent une formation de deux ans à l'INFJ avant d'être affectés dans les juridictions sur l'ensemble du territoire national.`,
    conditions: [
      "Être de nationalité ivoirienne",
      "Être titulaire d'un diplôme en Droit (Licence minimum)",
      "Avoir moins de 35 ans à la date du concours",
      "Jouir de ses droits civiques",
      "Satisfaire aux conditions d'aptitude physique",
    ],
    matieres: ['Droit civil', 'Droit pénal', 'Procédure civile', 'Procédure pénale', 'OHADA', 'Droit constitutionnel', 'Culture juridique générale'],
    ressources: [
      { id: 'r1', type: 'Code', titre: 'Code de procédure civile ivoirien' },
      { id: 'r2', type: 'Code', titre: 'Code pénal ivoirien' },
      { id: 'r3', type: 'Code', titre: 'Code Civil ivoirien' },
      { id: 'r4', type: 'Acte uniforme', titre: 'Actes uniformes OHADA — Commercial' },
    ],
  },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FicheConcoursScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const concours = CONCOURS_DATA[id ?? 'default'] ?? CONCOURS_DATA.default;

  const [descExpanded, setDescExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable hitSlop={10} style={styles.iconBtn}>
            <IconSymbol name="square.and.arrow.up" size={20} color={Palette.foreground} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.iconBtn}>
            <IconSymbol name="bookmark" size={20} color={Palette.foreground} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Titre ── */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroTexts}>
              <ThemedText style={styles.titre}>{concours.titre}</ThemedText>
              <ThemedText style={styles.institution}>{concours.institution}</ThemedText>
            </View>
            <View style={[styles.statutBadge, { backgroundColor: concours.statutBg }]}>
              <View style={[styles.statutDot, { backgroundColor: concours.statutColor }]} />
              <ThemedText style={[styles.statutText, { color: concours.statutColor }]}>
                {concours.statut.toUpperCase()}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* ── Stat cards ── */}
        <View style={styles.statsRow}>
          {concours.stats.map((s: any, i: number) => (
            <View key={i} style={[styles.statCard, { borderTopColor: concours.accentColor }]}>
              <ThemedText style={[styles.statValue, { color: concours.accentColor }]}>
                {s.value}
              </ThemedText>
              <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* ── Description ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.descText} numberOfLines={descExpanded ? undefined : 4}>
            {concours.description}
          </ThemedText>
          <Pressable onPress={() => setDescExpanded(v => !v)} hitSlop={8}>
            <ThemedText style={styles.seeMore}>
              {descExpanded ? 'Voir moins ↑' : 'Voir plus ↓'}
            </ThemedText>
          </Pressable>
        </View>

        {/* ── Conditions ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Conditions d'admission</ThemedText>
          {concours.conditions.map((c: string, i: number) => (
            <View key={i} style={styles.conditionRow}>
              <View style={[styles.bullet, { backgroundColor: concours.accentColor }]} />
              <ThemedText style={styles.conditionText}>{c}</ThemedText>
            </View>
          ))}
        </View>

        {/* ── Matières ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Matières</ThemedText>
          <View style={styles.matiereRow}>
            {concours.matieres.map((m: string) => (
              <View key={m} style={styles.matiereChip}>
                <ThemedText style={styles.matiereText}>{m}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* ── Se préparer ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>SE PRÉPARER</ThemedText>
          <View style={styles.prepRow}>
            <Pressable
              style={[styles.prepBtn, { borderColor: concours.accentColor + '50' }]}
              onPress={() => router.push('/concours/quiz' as any)}>
              <IconSymbol name="pencil.fill" size={18} color={concours.accentColor} />
              <ThemedText style={[styles.prepBtnText, { color: concours.accentColor }]}>Quiz</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.prepBtn, { borderColor: concours.accentColor + '50' }]}
              onPress={() => router.push('/concours/annales' as any)}>
              <IconSymbol name="doc.text.fill" size={18} color={concours.accentColor} />
              <ThemedText style={[styles.prepBtnText, { color: concours.accentColor }]}>Annales</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* ── Ressources ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Ressources recommandées</ThemedText>
          {concours.ressources.map((r: any) => (
            <Pressable
              key={r.id}
              style={({ pressed }) => [styles.ressourceItem, pressed && styles.pressed]}
              onPress={() => router.push(`/document/${r.id}` as any)}>
              <View style={styles.ressourceLeft}>
                <IconSymbol name="doc.text.fill" size={15} color={concours.accentColor} />
                <View>
                  <ThemedText style={styles.ressourceType}>{r.type}</ThemedText>
                  <ThemedText style={styles.ressourceTitre}>{r.titre}</ThemedText>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={14} color={Palette.accent2} />
            </Pressable>
          ))}
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
    paddingVertical: 10,
    backgroundColor: Palette.background,
  },
  backBtn: { padding: 4 },
  headerActions: { flexDirection: 'row', gap: 14 },
  iconBtn: { padding: 4 },

  content: { paddingBottom: 48 },

  hero: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroTexts: { flex: 1, gap: 6 },
  titre: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 28,
  },
  institution: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 18,
  },
  statutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexShrink: 0,
  },
  statutDot: { width: 6, height: 6, borderRadius: 3 },
  statutText: { fontSize: 10, fontFamily: Fonts.body.semiBold, letterSpacing: 0.5 },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderTopWidth: 3,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  descText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 22,
  },
  seeMore: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  conditionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  conditionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 21,
  },

  matiereRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  matiereChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.accent2 + '40',
  },
  matiereText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },

  prepRow: { flexDirection: 'row', gap: 10 },
  prepBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    backgroundColor: '#fff',
  },
  prepBtnText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
  },

  ressourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  ressourceLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  ressourceType: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
  },
  ressourceTitre: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
    lineHeight: 18,
  },

  pressed: { opacity: 0.72 },
});
