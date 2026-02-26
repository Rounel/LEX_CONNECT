import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Fonts, Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ─── Types ────────────────────────────────────────────────────────────────────

type Evenement = {
  id: string;
  institution: string;
  categorie: string;
  statut: 'En cours' | 'Adopté' | 'Promulgué' | 'Publié' | 'Annoncé' | 'Rejeté';
  titre: string;
  description?: string;
  pays: string;
  drapeau: string;
  date: string;
  isLive?: boolean;
};

// ─── Référentiels ─────────────────────────────────────────────────────────────

const FILTRES = ['Tout', 'Parlement', 'Gouvernement', 'Juridictions', 'J.O.', 'International'];

const CAT_INST: Record<string, string> = {
  'Assemblée nationale': 'Parlement',
  Sénat: 'Parlement',
  'Conseil des ministres': 'Gouvernement',
  'Présidence de la République': 'Gouvernement',
  'Cour Suprême': 'Juridictions',
  'Conseil constitutionnel': 'Juridictions',
  'Journal officiel': 'J.O.',
  UEMOA: 'International',
  CEDEAO: 'International',
  OHADA: 'International',
};

const INST_COLOR: Record<string, string> = {
  'Assemblée nationale': '#162660',
  Sénat: '#1D4ED8',
  'Conseil des ministres': '#B91C1C',
  'Présidence de la République': '#92400E',
  'Cour Suprême': '#0F766E',
  'Conseil constitutionnel': '#0E7490',
  'Journal officiel': '#6D28D9',
  UEMOA: '#065F46',
  CEDEAO: '#14532D',
  OHADA: '#4A148C',
};

const STATUT_STYLE: Record<string, { bg: string; text: string }> = {
  'En cours': { bg: '#FEF3C7', text: '#D97706' },
  Adopté: { bg: '#DCFCE7', text: '#15803D' },
  Promulgué: { bg: '#DBEAFE', text: '#1D4ED8' },
  Publié: { bg: '#EDE9FE', text: '#6D28D9' },
  Annoncé: { bg: '#F3F4F6', text: '#4B5563' },
  Rejeté: { bg: '#FFE4E6', text: '#BE123C' },
};

// ─── Données ──────────────────────────────────────────────────────────────────

const EVENEMENTS: Evenement[] = [
  {
    id: '1',
    institution: 'Assemblée nationale',
    categorie: 'Parlement',
    statut: 'En cours',
    isLive: true,
    titre: "Examen en première lecture du projet de loi portant Code du numérique",
    description:
      "La commission des lois examine le texte avant son passage en séance plénière prévue pour le 28 février. Le projet vise à encadrer les transactions électroniques et la protection des données.",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '25 fév. 2026',
  },
  {
    id: '2',
    institution: 'Conseil des ministres',
    categorie: 'Gouvernement',
    statut: 'Adopté',
    titre: "Adoption du projet de loi relatif à la cybersécurité et à la lutte contre la cybercriminalité",
    description:
      "Le Conseil des ministres a adopté le projet qui sera soumis à l'Assemblée nationale pour ratification lors de la session de mars.",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '22 fév. 2026',
  },
  {
    id: '3',
    institution: 'Présidence de la République',
    categorie: 'Gouvernement',
    statut: 'Promulgué',
    titre: "Promulgation de la loi n° 2026-012 portant modification du Code du travail",
    description:
      "Le Chef de l'État a promulgué la loi modifiant les dispositions relatives au contrat de travail à durée déterminée et au télétravail.",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '18 fév. 2026',
  },
  {
    id: '4',
    institution: 'Journal officiel',
    categorie: 'J.O.',
    statut: 'Publié',
    titre: "Décret n° 2026-089 portant organisation des concours de la fonction publique",
    description:
      "Le décret fixe le calendrier, les conditions d'admission et les modalités des concours administratifs pour l'année 2026.",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '15 fév. 2026',
  },
  {
    id: '5',
    institution: 'Sénat',
    categorie: 'Parlement',
    statut: 'Adopté',
    titre: "Vote de la loi de finances rectificative pour l'exercice budgétaire 2026",
    description:
      "Le Sénat a adopté à la majorité la loi de finances rectificative ajustant les prévisions de recettes et de dépenses de l'État.",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '12 fév. 2026',
  },
  {
    id: '6',
    institution: 'Assemblée nationale',
    categorie: 'Parlement',
    statut: 'Annoncé',
    titre: "Session extraordinaire convoquée pour examiner le projet de loi électoral révisé",
    description:
      "Le Président de l'Assemblée a convoqué une session extraordinaire du 10 au 20 mars 2026 dédiée à l'examen du projet de révision du Code électoral.",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '10 fév. 2026',
  },
  {
    id: '7',
    institution: 'UEMOA',
    categorie: 'International',
    statut: 'Adopté',
    titre: "Règlement UEMOA harmonisant le cadre juridique du commerce électronique",
    description:
      "Le Conseil des ministres de l'UEMOA a adopté un règlement créant un cadre commun pour les transactions numériques dans les 8 États membres.",
    pays: 'UEMOA',
    drapeau: '🌍',
    date: '8 fév. 2026',
  },
  {
    id: '8',
    institution: 'Journal officiel',
    categorie: 'J.O.',
    statut: 'Publié',
    titre: "Arrêtés interministériels fixant les conditions d'exercice des professions juridiques réglementées",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '5 fév. 2026',
  },
  {
    id: '9',
    institution: 'Conseil constitutionnel',
    categorie: 'Juridictions',
    statut: 'Publié',
    titre: "Décision n° 2026-003 DC : conformité à la Constitution de la loi sur les sociétés coopératives",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '3 fév. 2026',
  },
  {
    id: '10',
    institution: 'Conseil des ministres',
    categorie: 'Gouvernement',
    statut: 'Adopté',
    titre: "Projet de loi portant protection et promotion des investissements privés en Côte d'Ivoire",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '1 fév. 2026',
  },
  {
    id: '11',
    institution: 'Assemblée nationale',
    categorie: 'Parlement',
    statut: 'Adopté',
    titre: "Loi portant création de l'Autorité nationale de régulation des données personnelles (ANRDP)",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '28 jan. 2026',
  },
  {
    id: '12',
    institution: 'CEDEAO',
    categorie: 'International',
    statut: 'Annoncé',
    titre: "Sommet extraordinaire sur l'harmonisation des législations fiscales en Afrique de l'Ouest",
    description:
      "Les chefs d'État et de gouvernement se réuniront à Abuja le 15 mars pour adopter un cadre commun de fiscalité des entreprises numériques.",
    pays: 'CEDEAO',
    drapeau: '🌍',
    date: '25 jan. 2026',
  },
  {
    id: '13',
    institution: 'Cour Suprême',
    categorie: 'Juridictions',
    statut: 'Publié',
    titre: "Rapport annuel 2025 : bilan de l'activité juridictionnelle de la Cour Suprême",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '20 jan. 2026',
  },
  {
    id: '14',
    institution: 'OHADA',
    categorie: 'International',
    statut: 'Annoncé',
    titre: "Révision de l'Acte uniforme OHADA sur le droit des sûretés : consultation publique ouverte",
    description:
      "Le Secrétariat permanent de l'OHADA invite les États membres et les praticiens à soumettre leurs observations avant le 31 mars 2026.",
    pays: 'OHADA',
    drapeau: '🌍',
    date: '15 jan. 2026',
  },
];

// ─── Composants ───────────────────────────────────────────────────────────────

function FiltreChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>{label}</ThemedText>
    </Pressable>
  );
}

function StatutBadge({ statut }: { statut: Evenement['statut'] }) {
  const s = STATUT_STYLE[statut];
  return (
    <View style={[styles.statutBadge, { backgroundColor: s.bg }]}>
      <ThemedText style={[styles.statutText, { color: s.text }]}>{statut}</ThemedText>
    </View>
  );
}

function FeaturedCard({ evt }: { evt: Evenement }) {
  const color = INST_COLOR[evt.institution] ?? Palette.primary;
  return (
    <Pressable style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}>
      {/* Bandeau institution */}
      <View style={[styles.featuredBanner, { backgroundColor: color }]}>
        <ThemedText style={styles.featuredInst}>{evt.institution}</ThemedText>
        <View style={styles.featuredRight}>
          {evt.isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <ThemedText style={styles.liveText}>EN DIRECT</ThemedText>
            </View>
          )}
          <ThemedText style={styles.featuredDrapeau}>{evt.drapeau}</ThemedText>
        </View>
      </View>

      {/* Corps */}
      <View style={styles.featuredBody}>
        <View style={styles.featuredTopRow}>
          <StatutBadge statut={evt.statut} />
          <ThemedText style={styles.featuredDate}>{evt.date}</ThemedText>
        </View>
        <ThemedText style={styles.featuredTitre} numberOfLines={3}>
          {evt.titre}
        </ThemedText>
        {evt.description && (
          <ThemedText style={styles.featuredDesc} numberOfLines={2}>
            {evt.description}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

function EvenementCard({ evt }: { evt: Evenement }) {
  const color = INST_COLOR[evt.institution] ?? Palette.primary;
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.cardAccent, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <ThemedText style={[styles.cardInst, { color }]} numberOfLines={1}>
            {evt.institution}
          </ThemedText>
          <ThemedText style={styles.cardDrapeau}>{evt.drapeau}</ThemedText>
        </View>
        <View style={styles.cardMidRow}>
          <StatutBadge statut={evt.statut} />
          {evt.isLive && (
            <View style={styles.liveBadgeSmall}>
              <View style={styles.liveDotSmall} />
              <ThemedText style={styles.liveTextSmall}>LIVE</ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={styles.cardTitre} numberOfLines={2}>
          {evt.titre}
        </ThemedText>
        {evt.description && (
          <ThemedText style={styles.cardDesc} numberOfLines={2}>
            {evt.description}
          </ThemedText>
        )}
        <ThemedText style={styles.cardDate}>{evt.date}</ThemedText>
      </View>
    </Pressable>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function ActualitesScreen() {
  const [filtre, setFiltre] = useState('Tout');

  const evenementsFiltres = useMemo(
    () =>
      filtre === 'Tout'
        ? EVENEMENTS
        : EVENEMENTS.filter((e) => CAT_INST[e.institution] === filtre || e.categorie === filtre),
    [filtre],
  );

  const featured = evenementsFiltres[0];
  const liste = evenementsFiltres.slice(1);

  const ListHeader = (
    <>
      {/* Filtres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}>
        {FILTRES.map((f) => (
          <FiltreChip key={f} label={f} active={filtre === f} onPress={() => setFiltre(f)} />
        ))}
      </ScrollView>

      {/* Événement à la une */}
      {featured && (
        <View style={styles.featuredWrapper}>
          <FeaturedCard evt={featured} />
        </View>
      )}

      {/* En-tête liste */}
      {liste.length > 0 && (
        <View style={styles.listHeader}>
          <ThemedText style={styles.listHeaderText}>
            {liste.length} autre{liste.length !== 1 ? 's' : ''} événement
            {liste.length !== 1 ? 's' : ''}
          </ThemedText>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={liste}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <EvenementCard evt={item} />
          </View>
        )}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconSymbol name="newspaper.fill" size={40} color={Palette.accent2} />
            <ThemedText style={styles.emptyText}>Aucun événement dans cette catégorie</ThemedText>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  listContent: {
    paddingBottom: 40,
  },

  // Chips
  chipsRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Palette.accent2 + '30',
  },
  chipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  chipTextActive: {
    color: '#fff',
  },

  // Carte featured
  featuredWrapper: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
  },
  featuredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  featuredInst: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
    flex: 1,
  },
  featuredRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredDrapeau: {
    fontSize: 20,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FCD34D',
  },
  liveText: {
    fontSize: 10,
    fontFamily: Fonts.body.bold,
    color: '#fff',
    letterSpacing: 0.6,
  },
  featuredBody: {
    padding: 16,
    gap: 10,
  },
  featuredTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredDate: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  featuredTitre: {
    fontSize: 17,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 24,
  },
  featuredDesc: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 19,
  },

  // Badge statut
  statutBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statutText: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
  },

  // En-tête liste
  listHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // Carte événement
  cardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInst: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    flex: 1,
  },
  cardDrapeau: {
    fontSize: 16,
    marginLeft: 6,
  },
  cardMidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    gap: 4,
  },
  liveDotSmall: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D97706',
  },
  liveTextSmall: {
    fontSize: 9,
    fontFamily: Fonts.body.bold,
    color: '#D97706',
    letterSpacing: 0.5,
  },
  cardTitre: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 17,
  },
  cardDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    marginTop: 2,
  },

  // Vide
  empty: {
    paddingTop: 48,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // Pressed
  pressed: {
    opacity: 0.7,
  },
});
