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

import { Fonts, Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COL_W = (SCREEN_WIDTH - 32) / 5; // grille 5 colonnes, padding 16px de chaque côté

// ─── Types ────────────────────────────────────────────────────────────────────

type RecentItem = {
  id: string;
  type: string;
  titre: string;
  pays: string;
  drapeau: string;
  updated: string;
  accentColor: string;
};

type CategoryItem = {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  bg: string;
  color: string;
};

type CodeItem = {
  id: string;
  titre: string;
  pays: string;
  drapeau: string;
  articles: number;
  bg: string;
};

type JurisItem = {
  id: string;
  cour: string;
  titre: string;
  pays: string;
  drapeau: string;
  date: string;
  accentColor: string;
};

type SearchResult = {
  id: string;
  type: string;
  titre: string;
  pays: string;
  drapeau: string;
};

// ─── Données ──────────────────────────────────────────────────────────────────

const RECENTS: RecentItem[] = [
  {
    id: '1',
    type: 'Loi',
    titre: 'Loi relative à la cybersécurité et à la lutte contre la cybercriminalité',
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    updated: '20 fév. 2026',
    accentColor: '#1565C0',
  },
  {
    id: '2',
    type: 'Décret',
    titre: "Décret portant organisation du Ministère de la Justice",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    updated: '18 fév. 2026',
    accentColor: '#BF360C',
  },
  {
    id: '3',
    type: 'Ordonnance',
    titre: "Ordonnance relative à la fiscalité des entreprises numériques",
    pays: 'Sénégal',
    drapeau: '🇸🇳',
    updated: '15 fév. 2026',
    accentColor: '#2E7D32',
  },
  {
    id: '4',
    type: 'Arrêté',
    titre: "Arrêté fixant les conditions d'exercice de la profession de notaire",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    updated: '12 fév. 2026',
    accentColor: '#283593',
  },
  {
    id: '5',
    type: 'Traité',
    titre: "Traité de l'UEMOA sur la libre circulation des personnes et des biens",
    pays: 'CEDEAO',
    drapeau: '🌍',
    updated: '8 fév. 2026',
    accentColor: '#6A1B9A',
  },
];

const CATEGORIES: CategoryItem[] = [
  { id: '1', label: 'Traités', icon: 'doc.text.fill', bg: '#E3F2FD', color: '#1565C0' },
  { id: '2', label: 'Conventions', icon: 'person.2.fill', bg: '#E8F5E9', color: '#2E7D32' },
  { id: '3', label: 'Actes uniformes', icon: 'checkmark.seal.fill', bg: '#FFF3E0', color: '#E65100' },
  { id: '4', label: 'Accords', icon: 'handshake.fill', bg: '#F3E5F5', color: '#6A1B9A' },
  {
    id: '5',
    label: 'Protocoles additionnels',
    icon: 'doc.badge.plus',
    bg: '#FCE4EC',
    color: '#AD1457',
  },
  { id: '6', label: 'Lois', icon: 'building.columns.fill', bg: '#E8EAF6', color: '#162660' },
  { id: '7', label: 'Ordonnances', icon: 'scroll.fill', bg: '#F1F8E9', color: '#33691E' },
  { id: '8', label: 'Décrets', icon: 'hammer.fill', bg: '#FBE9E7', color: '#BF360C' },
  {
    id: '9',
    label: 'Arrêtés interministériels',
    icon: 'person.3.fill',
    bg: '#E0F7FA',
    color: '#006064',
  },
  { id: '10', label: 'Arrêtés', icon: 'doc.fill', bg: '#EDE7F6', color: '#4527A0' },
  {
    id: '11',
    label: 'Décisions interministérielles',
    icon: 'checklist',
    bg: '#F9FBE7',
    color: '#827717',
  },
  { id: '12', label: 'Circulaires', icon: 'repeat', bg: '#FFF8E1', color: '#F57F17' },
];

const CODES: CodeItem[] = [
  { id: '1', titre: 'Code Civil', pays: "Côte d'Ivoire", drapeau: '🇨🇮', articles: 2283, bg: '#162660' },
  { id: '2', titre: 'Code Pénal', pays: "Côte d'Ivoire", drapeau: '🇨🇮', articles: 645, bg: '#C62828' },
  { id: '3', titre: 'Code du Travail', pays: "Côte d'Ivoire", drapeau: '🇨🇮', articles: 189, bg: '#2E7D32' },
  { id: '4', titre: 'Code de Commerce', pays: "Côte d'Ivoire", drapeau: '🇨🇮', articles: 904, bg: '#E65100' },
  { id: '5', titre: 'Code Civil', pays: 'Sénégal', drapeau: '🇸🇳', articles: 1047, bg: '#1565C0' },
  { id: '6', titre: 'Actes uniformes OHADA', pays: 'OHADA', drapeau: '🌍', articles: 3200, bg: '#4A148C' },
  { id: '7', titre: 'Code du Travail', pays: 'Sénégal', drapeau: '🇸🇳', articles: 214, bg: '#283593' },
  { id: '8', titre: 'Code Pénal', pays: 'Mali', drapeau: '🇲🇱', articles: 512, bg: '#827717' },
];

const JURISPRUDENCES: JurisItem[] = [
  {
    id: '1',
    cour: 'Cour Suprême',
    titre: "Arrêt n° 001/2026 – Protection des droits fondamentaux en droit de la famille",
    pays: "Côte d'Ivoire",
    drapeau: '🇨🇮',
    date: '5 jan. 2026',
    accentColor: '#162660',
  },
  {
    id: '2',
    cour: 'Cour de Justice CEDEAO',
    titre: "Affaire CEDEAO/CI n° 2025-12 – Liberté de circulation et droits des migrants",
    pays: 'CEDEAO',
    drapeau: '🌍',
    date: '12 déc. 2025',
    accentColor: '#1565C0',
  },
  {
    id: '3',
    cour: 'Cour Suprême',
    titre: "Arrêt relatif à l'interprétation du licenciement abusif dans le Code du travail",
    pays: 'Sénégal',
    drapeau: '🇸🇳',
    date: '22 nov. 2025',
    accentColor: '#2E7D32',
  },
  {
    id: '4',
    cour: 'CCJA – OHADA',
    titre: "Avis n° 003/2025 – Interprétation des actes uniformes relatifs aux sociétés commerciales",
    pays: 'OHADA',
    drapeau: '🌍',
    date: '8 oct. 2025',
    accentColor: '#4A148C',
  },
];

// Dataset de recherche unifié
const ALL_SEARCHABLE: SearchResult[] = [
  ...CODES.map((c) => ({ id: `c-${c.id}`, type: 'Code', titre: c.titre, pays: c.pays, drapeau: c.drapeau })),
  ...RECENTS.map((r) => ({ id: `r-${r.id}`, type: r.type, titre: r.titre, pays: r.pays, drapeau: r.drapeau })),
  ...JURISPRUDENCES.map((j) => ({ id: `j-${j.id}`, type: j.cour, titre: j.titre, pays: j.pays, drapeau: j.drapeau })),
];

// ─── Composants ───────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <Pressable hitSlop={8}>
        <ThemedText style={styles.seeAll}>Voir tout</ThemedText>
      </Pressable>
    </View>
  );
}

function RecentCard({ item }: { item: RecentItem }) {
  return (
    <Pressable style={({ pressed }) => [styles.recentCard, pressed && styles.cardPressed]}>
      <View style={[styles.recentAccent, { backgroundColor: item.accentColor }]} />
      <View style={styles.recentBody}>
        <ThemedText style={[styles.recentType, { color: item.accentColor }]}>
          {item.type}
        </ThemedText>
        <ThemedText style={styles.recentTitle} numberOfLines={3}>
          {item.titre}
        </ThemedText>
        <View style={styles.recentFooter}>
          <ThemedText style={styles.recentMeta}>
            {item.drapeau} {item.pays}
          </ThemedText>
          <ThemedText style={styles.recentDate}>{item.updated}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

function CategoryGridItem({ item }: { item: CategoryItem }) {
  return (
    <Pressable style={({ pressed }) => [styles.catItem, pressed && { opacity: 0.7 }]}>
      <View style={[styles.catIcon, { backgroundColor: item.bg }]}>
        <IconSymbol name={item.icon} size={22} color={item.color} />
      </View>
      <ThemedText style={styles.catLabel} numberOfLines={2}>
        {item.label}
      </ThemedText>
    </Pressable>
  );
}

function CodeCard({ item }: { item: CodeItem }) {
  return (
    <Pressable style={({ pressed }) => [styles.codeCard, pressed && styles.cardPressed]}>
      <View style={[styles.codeTop, { backgroundColor: item.bg }]}>
        <ThemedText style={styles.codeDrapeau}>{item.drapeau}</ThemedText>
      </View>
      <View style={styles.codeBottom}>
        <ThemedText style={styles.codeTitle} numberOfLines={2}>
          {item.titre}
        </ThemedText>
        <ThemedText style={styles.codeMeta}>{item.articles} articles</ThemedText>
      </View>
    </Pressable>
  );
}

function JurisprudenceCard({ item }: { item: JurisItem }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.jurisCard,
        { borderTopColor: item.accentColor },
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.jurisHeader}>
        <ThemedText style={[styles.jurisCour, { color: item.accentColor }]}>
          {item.drapeau} {item.cour}
        </ThemedText>
      </View>
      <ThemedText style={styles.jurisTitre} numberOfLines={3}>
        {item.titre}
      </ThemedText>
      <ThemedText style={styles.jurisDate}>{item.date}</ThemedText>
    </Pressable>
  );
}

function SearchResultItem({ item }: { item: SearchResult }) {
  return (
    <Pressable style={({ pressed }) => [styles.searchResultItem, pressed && styles.cardPressed]}>
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

export default function LoisScreen() {
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
      {/* Barre de recherche */}
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
          {isSearching && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <IconSymbol name="xmark" size={16} color={Palette.accent2} />
            </Pressable>
          )}
        </View>
      </View>

      {isSearching ? (
        /* ── Résultats de recherche ── */
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SearchResultItem item={item} />}
          contentContainerStyle={styles.searchResultsList}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <ThemedText style={styles.emptySearchText}>Aucun résultat pour « {search} »</ThemedText>
            </View>
          }
        />
      ) : (
        /* ── Sections de découverte ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {/* Modifié récemment */}
          <View style={styles.section}>
            <SectionHeader title="Modifié récemment" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}>
              {RECENTS.map((item) => (
                <RecentCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>

          {/* Catégories */}
          <View style={styles.section}>
            <SectionHeader title="Catégories" />
            <View style={styles.catGrid}>
              {CATEGORIES.map((item) => (
                <CategoryGridItem key={item.id} item={item} />
              ))}
            </View>
          </View>

          {/* Codes et recueils */}
          <View style={styles.section}>
            <SectionHeader title="Codes et recueils de textes" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}>
              {CODES.map((item) => (
                <CodeCard key={item.id} item={item} />
              ))}
            </ScrollView>
          </View>

          {/* Jurisprudence */}
          <View style={styles.section}>
            <SectionHeader title="Jurisprudence" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}>
              {JURISPRUDENCES.map((item) => (
                <JurisprudenceCard key={item.id} item={item} />
              ))}
            </ScrollView>
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

  // Carte "Modifié récemment"
  recentCard: {
    width: 196,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  recentAccent: {
    width: 4,
  },
  recentBody: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  recentType: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  recentTitle: {
    fontSize: 13,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 18,
    flex: 1,
  },
  recentFooter: {
    gap: 2,
  },
  recentMeta: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  recentDate: {
    fontSize: 10,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // Grille catégories
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  catItem: {
    width: COL_W,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    gap: 7,
  },
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: {
    fontSize: 10,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    textAlign: 'center',
    lineHeight: 13,
  },

  // Carte "Codes et recueils"
  codeCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  codeTop: {
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeDrapeau: {
    fontSize: 32,
  },
  codeBottom: {
    padding: 12,
    gap: 4,
  },
  codeTitle: {
    fontSize: 13,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 18,
  },
  codeMeta: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // Carte Jurisprudence
  jurisCard: {
    width: 224,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderTopWidth: 3,
  },
  jurisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jurisCour: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  jurisTitre: {
    fontSize: 13,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 19,
  },
  jurisDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
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
