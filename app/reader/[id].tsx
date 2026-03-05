import { useRef, useState } from 'react';
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

// ─── Mock content ─────────────────────────────────────────────────────────────

const ARTICLES = [
  {
    id: 'a1',
    titre: 'TITRE PREMIER — Des personnes physiques',
    chapitre: 'Chapitre I — De la personnalité juridique',
    num: '1',
    corps: `Le Code Civil de Côte d'Ivoire régit les relations entre les personnes physiques et morales, les actes et les faits juridiques qui donnent naissance à des droits et obligations.`,
  },
  {
    id: 'a2',
    chapitre: null,
    num: '2',
    corps: `Toute personne humaine est dotée de la personnalité juridique dès sa naissance. Celle-ci s'éteint à la mort de la personne physique, sous réserve des effets d'une conception antérieure.`,
  },
  {
    id: 'a3',
    chapitre: null,
    num: '3',
    corps: `La personnalité juridique confère à son titulaire la capacité d'être sujet de droit, d'acquérir des droits et de contracter des obligations dans les conditions prévues par la loi.`,
  },
  {
    id: 'a4',
    chapitre: 'Chapitre II — De l\'état civil',
    num: '4',
    corps: `L'état civil est la situation d'une personne dans la société, déterminée par ses qualités personnelles, familiales et nationales. Il est établi et conservé par les services de l'état civil.`,
  },
  {
    id: 'a5',
    chapitre: null,
    num: '5',
    corps: `Tout fait ou acte d'état civil doit être enregistré dans les registres tenus à cet effet par les officiers de l'état civil, conformément aux dispositions du présent Code.`,
  },
  {
    id: 'a6',
    chapitre: null,
    num: '6',
    corps: `Les actes de l'état civil font foi jusqu'à inscription de faux. Ils ne peuvent être annulés que par décision judiciaire, dans les conditions et selon les formes prévues par les lois et règlements en vigueur.`,
  },
];

const TOTAL = ARTICLES.length;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LecteurScreen() {
  const router = useRouter();
  useLocalSearchParams<{ id: string }>();
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const prev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };
  const next = () => {
    if (currentIdx < TOTAL - 1) {
      setCurrentIdx(i => i + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const article = ARTICLES[currentIdx];
  const progress = ((currentIdx + 1) / TOTAL) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <IconSymbol name="chevron.left" size={22} color={Palette.foreground} />
        </Pressable>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          Code Civil ivoirien
        </ThemedText>
        <View style={styles.headerActions}>
          <Pressable hitSlop={10} style={styles.iconBtn}>
            <IconSymbol name="magnifyingglass" size={19} color={Palette.foreground} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.iconBtn}>
            <IconSymbol name="bookmark.fill" size={19} color={Palette.foreground} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.iconBtn}>
            <IconSymbol name="square.and.arrow.up" size={19} color={Palette.foreground} />
          </Pressable>
          <Pressable hitSlop={10} style={styles.iconBtn}>
            <IconSymbol name="list.bullet" size={19} color={Palette.foreground} />
          </Pressable>
        </View>
      </View>

      {/* ── Progress bar ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>

      {/* ── Content ── */}
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.articleContent}
        showsVerticalScrollIndicator={false}>

        {/* Titre de section */}
        {article.titre && (
          <ThemedText style={styles.sectionTitle}>{article.titre}</ThemedText>
        )}

        {/* Chapitre */}
        {article.chapitre && (
          <ThemedText style={styles.chapitreTitle}>{article.chapitre}</ThemedText>
        )}

        {/* Article */}
        <View style={styles.articleRow}>
          <ThemedText style={styles.artNum}>Art. {article.num}</ThemedText>
          <ThemedText style={styles.artBody}>{article.corps}</ThemedText>
        </View>
      </ScrollView>

      {/* ── Navigation basse ── */}
      <View style={styles.navBar}>
        <Pressable
          style={[styles.navBtn, currentIdx === 0 && styles.navBtnDisabled]}
          onPress={prev}
          disabled={currentIdx === 0}>
          <IconSymbol name="chevron.left" size={16} color={currentIdx === 0 ? Palette.accent2 : Palette.primary} />
          <ThemedText style={[styles.navBtnText, currentIdx === 0 && styles.navBtnTextDisabled]}>
            Préc.
          </ThemedText>
        </Pressable>

        <ThemedText style={styles.navCounter}>
          Art. {currentIdx + 1}/{TOTAL}
        </ThemedText>

        <Pressable
          style={[styles.navBtn, styles.navBtnRight, currentIdx === TOTAL - 1 && styles.navBtnDisabled]}
          onPress={next}
          disabled={currentIdx === TOTAL - 1}>
          <ThemedText style={[styles.navBtnText, currentIdx === TOTAL - 1 && styles.navBtnTextDisabled]}>
            Suiv.
          </ThemedText>
          <IconSymbol name="chevron.right" size={16} color={currentIdx === TOTAL - 1 ? Palette.accent2 : Palette.primary} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
  },
  headerActions: { flexDirection: 'row', gap: 10 },

  progressTrack: {
    height: 3,
    backgroundColor: '#eee',
  },
  progressFill: {
    height: 3,
    backgroundColor: Palette.primary,
    borderRadius: 2,
  },

  scroll: { flex: 1 },
  articleContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 20,
  },

  sectionTitle: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  chapitreTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 26,
  },
  articleRow: {
    flexDirection: 'row',
    gap: 16,
  },
  artNum: {
    width: 48,
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    paddingTop: 3,
    flexShrink: 0,
  },
  artBody: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 28,
  },

  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Palette.accent1,
  },
  navBtnRight: {},
  navBtnDisabled: { backgroundColor: '#f5f5f5' },
  navBtnText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  navBtnTextDisabled: { color: Palette.accent2 },
  navCounter: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
});
