import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ARTICLE = {
  categorie: 'LÉGISLATION',
  categorieColor: '#162660',
  categorieBg: '#E3F2FD',
  date: '05 mars 2026',
  readTime: '4 min de lecture',
  titre: 'Nouvelle réforme du Code du Travail : ce qui change pour les employeurs et salariés',
  auteur: 'Rédaction Wilex',
  corps: [
    `La loi n°2026-012 du 18 février 2026 portant modification du Code du Travail apporte des changements significatifs dans les relations entre employeurs et salariés en Côte d'Ivoire.`,
    `Parmi les mesures phares, on note l'encadrement renforcé du télétravail, désormais soumis à un accord écrit entre les parties. L'article 16 bis nouveau dispose que tout salarié effectuant du télétravail bénéficie des mêmes droits que les travailleurs sur site.`,
    `Sur la question du contrat à durée déterminée (CDD), la réforme limite désormais les renouvellements successifs à deux fois, après quoi le contrat est réputé à durée indéterminée de plein droit. Cette disposition entre en vigueur le 1er juillet 2026.`,
    `En matière de licenciement économique, le texte introduit une obligation de plan de sauvegarde de l'emploi (PSE) pour les entreprises de plus de 50 salariés souhaitant procéder à des licenciements collectifs.`,
  ],
  textesMentionnes: [
    { id: 't1', type: 'Loi', titre: 'Code du Travail ivoirien (modifié)' },
    { id: 't2', type: 'Loi', titre: 'Loi n°2026-012 du 18 février 2026' },
    { id: 't3', type: 'Décret', titre: "Décret d'application — conditions du télétravail" },
  ],
  voirAussi: [
    { id: 'v1', categorie: 'JURISPRUDENCE', titre: 'Cour Suprême : arrêt sur le licenciement abusif', date: '3 mars 2026', color: '#0F766E', bg: '#D1FAE5' },
    { id: 'v2', categorie: 'CONCOURS', titre: 'Ouverture du concours de la Magistrature 2026', date: '1 mars 2026', color: '#162660', bg: '#E3F2FD' },
    { id: 'v3', categorie: 'LÉGISLATION', titre: 'Publication du décret sur la protection des données', date: '28 fév. 2026', color: '#6D28D9', bg: '#EDE9FE' },
  ],
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ActualiteDetailScreen() {
  const router = useRouter();
  useLocalSearchParams<{ id: string }>();
  const article = MOCK_ARTICLE;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Header transparent flottant ── */}
        <View style={styles.floatHeader}>
          <Pressable onPress={() => router.back()} style={styles.floatBtn} hitSlop={10}>
            <IconSymbol name="chevron.left" size={20} color={Palette.foreground} />
          </Pressable>
          <View style={styles.floatActions}>
            <Pressable style={styles.floatBtn} hitSlop={10}>
              <IconSymbol name="square.and.arrow.up" size={19} color={Palette.foreground} />
            </Pressable>
            <Pressable style={styles.floatBtn} hitSlop={10}>
              <IconSymbol name="bookmark" size={19} color={Palette.foreground} />
            </Pressable>
          </View>
        </View>

        {/* ── Hero image (placeholder coloré) ── */}
        <View style={[styles.hero, { backgroundColor: article.categorieColor }]}>
          <IconSymbol name="newspaper.fill" size={48} color="rgba(255,255,255,0.3)" />
        </View>

        {/* ── Meta ── */}
        <View style={styles.body}>
          <View style={styles.metaRow}>
            <View style={[styles.catBadge, { backgroundColor: article.categorieBg }]}>
              <ThemedText style={[styles.catText, { color: article.categorieColor }]}>
                {article.categorie}
              </ThemedText>
            </View>
            <ThemedText style={styles.metaDate}>{article.date}</ThemedText>
            <ThemedText style={styles.metaRead}>{article.readTime}</ThemedText>
          </View>

          {/* ── Titre ── */}
          <ThemedText style={styles.titre}>{article.titre}</ThemedText>
          <ThemedText style={styles.auteur}>{article.auteur}</ThemedText>

          {/* ── Corps ── */}
          <View style={styles.corps}>
            {article.corps.map((para, i) => (
              <ThemedText key={i} style={styles.para}>{para}</ThemedText>
            ))}
          </View>

          {/* ── Textes mentionnés ── */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionLabel}>TEXTES DE LOI MENTIONNÉS</ThemedText>
            {article.textesMentionnes.map(t => (
              <Pressable
                key={t.id}
                style={({ pressed }) => [styles.texteItem, pressed && styles.pressed]}
                onPress={() => router.push(`/document/${t.id}` as any)}>
                <View style={styles.texteLeft}>
                  <IconSymbol name="doc.text.fill" size={16} color={Palette.primary} />
                  <View>
                    <ThemedText style={styles.texteType}>{t.type}</ThemedText>
                    <ThemedText style={styles.texteTitre}>{t.titre}</ThemedText>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={14} color={Palette.accent2} />
              </Pressable>
            ))}
          </View>

          {/* ── Voir aussi ── */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Voir aussi</ThemedText>
            {article.voirAussi.map(v => (
              <Pressable
                key={v.id}
                style={({ pressed }) => [styles.voirCard, pressed && styles.pressed]}
                onPress={() => router.push(`/actualite/${v.id}` as any)}>
                <View style={[styles.voirCatBadge, { backgroundColor: v.bg }]}>
                  <ThemedText style={[styles.voirCatText, { color: v.color }]}>
                    {v.categorie}
                  </ThemedText>
                </View>
                <ThemedText style={styles.voirTitre} numberOfLines={2}>{v.titre}</ThemedText>
                <ThemedText style={styles.voirDate}>{v.date}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 48 },

  floatHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  floatBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  floatActions: { flexDirection: 'row', gap: 8 },

  hero: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
    backgroundColor: '#fff',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  catBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
  },
  catText: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    letterSpacing: 0.5,
  },
  metaDate: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  metaRead: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  titre: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 30,
  },
  auteur: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    marginTop: -8,
  },

  corps: { gap: 14 },
  para: {
    fontSize: 15,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 24,
  },

  section: { gap: 10 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },

  texteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.background,
    borderRadius: 10,
    padding: 12,
  },
  texteLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  texteType: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
  },
  texteTitre: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
    lineHeight: 18,
  },

  voirCard: {
    backgroundColor: Palette.background,
    borderRadius: 12,
    padding: 13,
    gap: 6,
  },
  voirCatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  voirCatText: { fontSize: 10, fontFamily: Fonts.body.semiBold, letterSpacing: 0.4 },
  voirTitre: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 19,
  },
  voirDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  pressed: { opacity: 0.72 },
});
