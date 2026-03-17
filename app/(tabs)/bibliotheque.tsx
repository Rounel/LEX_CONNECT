import { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

const CARD_W = (Dimensions.get('window').width - 16 * 2 - 12) / 2;
import { useRouter } from 'expo-router';

import { Fonts, Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ─── Types ────────────────────────────────────────────────────────────────────

type FollowedItem = {
  id: string;
  type: string;
  titre: string;
  domaine: string;
  statut: 'En vigueur' | 'Abrogé' | 'Modifié';
  accentColor: string;
};

type CategoryCard = {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  accent: string;
  bg: string;
  route: string;
};

type SearchResult = {
  id: string;
  type: string;
  titre: string;
  pays: string;
  drapeau: string;
};

// ─── Données ──────────────────────────────────────────────────────────────────

const RECENTS_CONSULTES: FollowedItem[] = [
  {
    id: 'rc1',
    type: 'Jurisprudence',
    titre: 'Cour Suprême — Arrêt n°001/2026',
    domaine: 'Droit de la famille',
    statut: 'En vigueur',
    accentColor: '#0F766E',
  },
  {
    id: 'rc2',
    type: 'Code',
    titre: 'Code de Procédure Pénale',
    domaine: 'Droit pénal',
    statut: 'En vigueur',
    accentColor: '#7C2D12',
  },
  {
    id: 'rc3',
    type: 'Loi',
    titre: 'Loi relative à la cybersécurité',
    domaine: 'Droit numérique',
    statut: 'Modifié',
    accentColor: '#1565C0',
  },
];

const STATUT_COLOR: Record<FollowedItem['statut'], { bg: string; text: string }> = {
  'En vigueur': { bg: '#E6F6EE', text: '#1E7A47' },
  'Abrogé': { bg: '#FDEDEB', text: '#C0392B' },
  'Modifié': { bg: '#FEF4E8', text: '#D4821A' },
};

const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'ohada',
    label: 'OHADA',
    description: 'Actes uniformes, traités et jurisprudence CCJA',
    icon: 'globe',
    accent: '#4A148C',
    bg: '#F3E5F5',
    route: '/liste?category=ohada',
  },
  {
    id: 'legislatif',
    label: 'Textes législatifs et Réglementaires',
    description: 'Lois, décrets, ordonnances, arrêtés',
    icon: 'building.columns.fill',
    accent: Palette.primary,
    bg: Palette.accent1,
    route: '/liste?category=legislatif',
  },
  {
    id: 'codes',
    label: 'Codes et Recueils de Texte',
    description: 'Codes civils, pénaux, commerciaux et recueils',
    icon: 'books.vertical.fill',
    accent: '#2E7D32',
    bg: '#E8F5E9',
    route: '/liste?category=codes',
  },
  {
    id: 'jurisprudence',
    label: 'Jurisprudence',
    description: 'Arrêts, décisions et avis des juridictions',
    icon: 'hammer.fill',
    accent: '#8B2500',
    bg: '#FBE9E7',
    route: '/liste?category=jurisprudence',
  },
];

const ALL_SEARCHABLE: SearchResult[] = [];

// ─── Composants ───────────────────────────────────────────────────────────────

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {onSeeAll !== undefined && (
        <Pressable hitSlop={8} onPress={onSeeAll}>
          <ThemedText style={styles.seeAll}>Voir tout</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

function FollowedCard({ item, onPress }: { item: FollowedItem; onPress?: () => void }) {
  const statut = STATUT_COLOR[item.statut];
  return (
    <Pressable style={({ pressed }) => [styles.followedCard, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={[styles.followedAccent, { backgroundColor: item.accentColor }]} />
      <View style={styles.followedBody}>
        <View style={styles.followedTopRow}>
          <ThemedText style={[styles.followedType, { color: item.accentColor }]}>
            {item.type}
          </ThemedText>
          <View style={[styles.statutBadge, { backgroundColor: statut.bg }]}>
            <ThemedText style={[styles.statutText, { color: statut.text }]}>
              {item.statut}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.followedTitre} numberOfLines={2}>
          {item.titre}
        </ThemedText>
        <ThemedText style={styles.followedDomaine}>{item.domaine}</ThemedText>
      </View>
    </Pressable>
  );
}

function NavCard({ item, onPress }: { item: CategoryCard; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.navCard, pressed && styles.cardPressed]}
      onPress={onPress}>
      {/* <View style={[styles.navCardIconWrap, { backgroundColor: item.bg }]}>
        <IconSymbol name={item.icon} size={28} color={item.accent} />
      </View> */}
      <ThemedText style={styles.navCardLabel}>
        {item.label}
      </ThemedText>
      <ThemedText style={styles.navCardDesc} numberOfLines={3}>
        {item.description}
      </ThemedText>
    </Pressable>
  );
}

function SearchResultItem({ item, onPress }: { item: SearchResult; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.searchResultItem, pressed && styles.cardPressed]} onPress={onPress}>
      <View style={styles.searchResultLeft}>
        <ThemedText style={styles.searchResultType}>{item.type}</ThemedText>
        <ThemedText style={styles.searchResultTitle} numberOfLines={2}>
          {item.titre}
        </ThemedText>
        <ThemedText style={styles.searchResultPays}>
          {item.drapeau} {item.pays}
        </ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={18} color={Palette.accent2} />
    </Pressable>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function BibliothequeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const searchResults = useMemo<SearchResult[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return ALL_SEARCHABLE.filter(
      (item) =>
        item.titre.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.pays.toLowerCase().includes(q),
    );
  }, [search]);

  const isSearching = search.trim().length > 0;

  return (
    <View style={styles.container}>
      {/* ── Barre de recherche ── */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={18} color={Palette.accent2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un texte juridique…"
            placeholderTextColor={Palette.accent2}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {isSearching ? (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <IconSymbol name="xmark" size={16} color={Palette.accent2} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push('/filtres' as any)}
              hitSlop={8}
              style={styles.filterBtn}>
              <IconSymbol name="slider.horizontal.3" size={18} color={Palette.primary} />
            </Pressable>
          )}
        </View>
      </View>

      {isSearching ? (
        /* ── Résultats de recherche ── */
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SearchResultItem
              item={item}
              onPress={() => router.push(`/document/${item.id}` as any)}
            />
          )}
          contentContainerStyle={styles.searchResultsList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <ThemedText style={styles.emptySearchText}>
                Aucun résultat pour « {search} »
              </ThemedText>
            </View>
          }
        />
      ) : (
        /* ── Contenu principal ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

          {/* ── Récemment consultés ── */}
          <View style={styles.section}>
            <SectionHeader title="Récemment consultés" onSeeAll={() => {}} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}>
              {RECENTS_CONSULTES.map((item) => (
                <FollowedCard
                  key={item.id}
                  item={item}
                  onPress={() => router.push(`/document/${item.id}` as any)}
                />
              ))}
            </ScrollView>
          </View>

          {/* ── Catégories de navigation ── */}
          <View style={styles.section}>
            <SectionHeader title="Parcourir par catégorie" />
            <View style={styles.navCardGrid}>
              {CATEGORY_CARDS.map((item) => (
                <NavCard
                  key={item.id}
                  item={item}
                  onPress={() => router.push(item.route as any)}
                />
              ))}
            </View>
          </View>

        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },

  // Recherche
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: Palette.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  filterBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Palette.accent1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    padding: 0,
  },

  // Contenu principal
  content: {
    paddingBottom: 40,
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  hScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },

  // Cards de navigation catégories (grille 2 colonnes)
  navCardGrid: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  navCard: {
    width: CARD_W,
    backgroundColor: Palette.accent4,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  navCardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navCardLabel: {
    fontSize: 20,
    textAlign: 'auto',
    fontFamily: Fonts.heading.bold,
    lineHeight: 19,
    color: Palette.foreground2,
  },
  navCardDesc: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground2,
    textAlign: 'auto',
    lineHeight: 17,
  },

  // Carte "Récemment consultés"
  followedCard: {
    width: 200,
    backgroundColor: Palette.accent3,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  followedAccent: {
    width: 4,
  },
  followedBody: {
    flex: 1,
    padding: 13,
    gap: 7,
  },
  followedTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  followedType: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  followedTitre: {
    fontSize: 13,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 18,
  },
  followedDomaine: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  statutBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  statutText: {
    fontSize: 9,
    fontFamily: Fonts.body.semiBold,
    letterSpacing: 0.3,
  },

  // Résultats de recherche
  searchResultsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  searchResultLeft: {
    flex: 1,
    gap: 4,
  },
  searchResultType: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    textTransform: 'uppercase',
    color: Palette.accent2,
    letterSpacing: 0.4,
  },
  searchResultTitle: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 19,
  },
  searchResultPays: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // État vide recherche
  emptySearch: {
    paddingTop: 48,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },

  // Feedback pression
  cardPressed: {
    opacity: 0.72,
  },
});
