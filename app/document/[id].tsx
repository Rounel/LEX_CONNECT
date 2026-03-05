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

// ─── Mock data ───────────────────────────────────────────────────────────────

const MOCK_DOC = {
  type: 'Code',
  titre: 'Code Civil de Côte d\'Ivoire',
  domaine: 'Droit civil · Droit des personnes et de la famille',
  derniereMaj: '15 janvier 2024',
  statut: 'En vigueur' as const,
  accentColor: '#162660',
  version: 'v3.2 · Mise à jour 2024',
  description: `Le Code Civil ivoirien régit les relations entre les personnes physiques et morales, les actes et les faits juridiques. Il constitue le fondement du droit privé en Côte d'Ivoire et s'applique à l'ensemble du territoire national.\n\nIl a été adopté dans la continuité du droit français tout en intégrant progressivement les spécificités du droit coutumier ivoirien.`,
  versions: [
    { num: 'v3.2', date: '15 janv. 2024', detail: 'Modification des articles 45–48 relatifs aux successions ab intestat', jorci: 'JORCI n°42 du 20/01/2024' },
    { num: 'v3.1', date: '04 juin 2022', detail: 'Intégration des dispositions OHADA relatives aux obligations', jorci: 'JORCI n°28' },
    { num: 'v3.0', date: '12 mars 2019', detail: 'Version initiale consolidée', jorci: '' },
  ],
  actualites: [
    { id: 'a1', titre: 'Réforme du Code Civil 2024 : les principales modifications', date: '2 fév. 2024', categorie: 'Législation' },
  ],
};

const STATUT_COLOR = {
  'En vigueur': { bg: '#E6F6EE', text: '#1E7A47' },
  'Abrogé': { bg: '#FDEDEB', text: '#C0392B' },
  'Modifié': { bg: '#FEF4E8', text: '#D4821A' },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function DocumentFicheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const doc = MOCK_DOC;

  const [expanded, setExpanded] = useState(false);
  const [followed, setFollowed] = useState(false);
  const statut = STATUT_COLOR[doc.statut];

  const descLines = doc.description.split('\n').filter(Boolean);
  const shortDesc = descLines[0];

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
            <IconSymbol name="bell.fill" size={20} color={Palette.foreground} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Hero ── */}
        <View style={[styles.hero, { backgroundColor: doc.accentColor }]}>
          <View style={styles.heroBadges}>
            <View style={styles.typeBadge}>
              <ThemedText style={styles.typeBadgeText}>{doc.type.toUpperCase()}</ThemedText>
            </View>
            <View style={[styles.statutBadge, { backgroundColor: statut.bg }]}>
              <View style={[styles.statutDot, { backgroundColor: statut.text }]} />
              <ThemedText style={[styles.statutText, { color: statut.text }]}>{doc.statut}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.heroTitle}>{doc.titre}</ThemedText>
        </View>

        {/* ── Meta ── */}
        <View style={styles.metaBlock}>
          <ThemedText style={styles.metaDomaine}>{doc.domaine}</ThemedText>
          <ThemedText style={styles.metaDate}>Dernière modification : {doc.derniereMaj}</ThemedText>
        </View>

        {/* ── Description ── */}
        <View style={styles.descBlock}>
          <ThemedText style={styles.descText} numberOfLines={expanded ? undefined : 3}>
            {doc.description}
          </ThemedText>
          <Pressable onPress={() => setExpanded(v => !v)} hitSlop={8}>
            <ThemedText style={styles.seeMore}>
              {expanded ? 'Voir moins ↑' : 'Voir plus ↓'}
            </ThemedText>
          </Pressable>
        </View>

        {/* ── Bouton suivi ── */}
        <Pressable
          style={[styles.followBtn, followed && styles.followBtnActive]}
          onPress={() => setFollowed(v => !v)}>
          <IconSymbol
            name={followed ? 'heart.fill' : 'heart'}
            size={18}
            color={followed ? '#C0392B' : Palette.foreground}
          />
          <ThemedText style={[styles.followBtnText, followed && styles.followBtnTextActive]}>
            {followed ? 'Ne plus suivre' : 'Suivre ce texte'}
          </ThemedText>
        </Pressable>

        {/* ── Version en vigueur ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>VERSION EN VIGUEUR</ThemedText>
          <ThemedText style={styles.versionInfo}>{doc.version}</ThemedText>
          <Pressable
            style={styles.readBtn}
            onPress={() => router.push(`/reader/${id ?? '1'}` as any)}>
            <IconSymbol name="book.fill" size={18} color="#fff" />
            <ThemedText style={styles.readBtnText}>Lire le texte</ThemedText>
          </Pressable>
        </View>

        {/* ── Historique des versions ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Historique des versions</ThemedText>
            <Pressable hitSlop={8} onPress={() => router.push(`/versions/${id ?? '1'}` as any)}>
              <ThemedText style={styles.seeAll}>Voir tout</ThemedText>
            </Pressable>
          </View>
          {doc.versions.slice(0, 3).map((v, i) => (
            <View key={v.num} style={styles.versionRow}>
              <View style={styles.versionTimeline}>
                <View style={[styles.versionDot, i === 0 && styles.versionDotActive]} />
                {i < 2 && <View style={styles.versionLine} />}
              </View>
              <View style={styles.versionContent}>
                <ThemedText style={[styles.versionNum, i === 0 && styles.versionNumActive]}>
                  {v.num} — {v.date}
                </ThemedText>
                {v.jorci ? (
                  <ThemedText style={styles.versionJorci}>{v.jorci}</ThemedText>
                ) : null}
                <ThemedText style={styles.versionDetail}>{v.detail}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* ── Actualités liées ── */}
        {doc.actualites.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Actualités liées</ThemedText>
            {doc.actualites.map(a => (
              <Pressable
                key={a.id}
                style={({ pressed }) => [styles.newsCard, pressed && styles.pressed]}
                onPress={() => router.push(`/actualite/${a.id}` as any)}>
                <View style={styles.newsCatBadge}>
                  <ThemedText style={styles.newsCatText}>{a.categorie.toUpperCase()}</ThemedText>
                </View>
                <ThemedText style={styles.newsTitre} numberOfLines={2}>{a.titre}</ThemedText>
                <ThemedText style={styles.newsDate}>{a.date}</ThemedText>
              </Pressable>
            ))}
          </View>
        )}
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

  content: { paddingBottom: 40 },

  hero: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
    gap: 14,
  },
  heroBadges: { flexDirection: 'row', gap: 8 },
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
    letterSpacing: 0.6,
  },
  statutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statutDot: { width: 6, height: 6, borderRadius: 3 },
  statutText: { fontSize: 11, fontFamily: Fonts.body.semiBold },
  heroTitle: {
    fontSize: 26,
    fontFamily: Fonts.heading.bold,
    color: '#fff',
    lineHeight: 34,
  },

  metaBlock: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 4,
  },
  metaDomaine: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 18,
  },
  metaDate: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  descBlock: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 6,
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

  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 18,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '40',
    backgroundColor: '#fff',
  },
  followBtnActive: {
    borderColor: '#C0392B',
    backgroundColor: '#FDEDEB',
  },
  followBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  followBtnTextActive: { color: '#C0392B' },

  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  versionInfo: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    marginBottom: 12,
  },
  readBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  readBtnText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },

  versionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  versionTimeline: {
    alignItems: 'center',
    width: 16,
    paddingTop: 3,
  },
  versionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Palette.accent2,
    backgroundColor: '#fff',
  },
  versionDotActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primary,
  },
  versionLine: {
    flex: 1,
    width: 2,
    backgroundColor: Palette.accent2 + '40',
    marginVertical: 2,
    minHeight: 32,
  },
  versionContent: {
    flex: 1,
    paddingBottom: 20,
    gap: 3,
  },
  versionNum: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
  },
  versionNumActive: { color: Palette.primary },
  versionJorci: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  versionDetail: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 18,
  },

  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 7,
  },
  newsCatBadge: {
    backgroundColor: Palette.accent1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  newsCatText: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
    letterSpacing: 0.5,
  },
  newsTitre: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 19,
  },
  newsDate: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  pressed: { opacity: 0.72 },
});
