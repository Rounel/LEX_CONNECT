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
import { useRouter } from 'expo-router';

import { Fonts, Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ─── Catégories de filtre ─────────────────────────────────────────────────────

const FILTRES_CAT = [
  { id: 'tous', label: 'Tous' },
  { id: 'codes', label: 'Codes' },
  { id: 'lois', label: 'Lois' },
  { id: 'decrets', label: 'Décrets' },
  { id: 'jurisprudences', label: 'Jurisprudences' },
  { id: 'ordonnances', label: 'Ordonnances' },
  { id: 'reglements', label: 'Règlements' },
] as const;

type FiltreCatId = (typeof FILTRES_CAT)[number]['id'];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COL_W = (SCREEN_WIDTH - 40) / 5; // grille 5 colonnes, padding 20px de chaque côté

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

// ─── Textes suivis & récemment consultés ─────────────────────────────────────

type FollowedItem = {
  id: string;
  type: string;
  titre: string;
  domaine: string;
  statut: 'En vigueur' | 'Abrogé' | 'Modifié';
  accentColor: string;
};

const TEXTES_SUIVIS: FollowedItem[] = [
  {
    id: 'f1',
    type: 'Code',
    titre: 'Code Civil ivoirien',
    domaine: 'Droit civil',
    statut: 'En vigueur',
    accentColor: '#162660',
  },
  {
    id: 'f2',
    type: 'Loi',
    titre: 'Code du Travail',
    domaine: 'Droit social',
    statut: 'Modifié',
    accentColor: '#2E7D32',
  },
  {
    id: 'f3',
    type: 'Ordonnance',
    titre: 'Ordonnance relative aux sociétés commerciales',
    domaine: 'Droit commercial',
    statut: 'En vigueur',
    accentColor: '#E65100',
  },
  {
    id: 'f4',
    type: 'Décret',
    titre: 'Décret n°2023-472 portant fiscalité des entreprises',
    domaine: 'Droit fiscal',
    statut: 'En vigueur',
    accentColor: '#BF360C',
  },
];

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

/** Chip de filtre horizontal */
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
    <Pressable
      onPress={onPress}
      style={[styles.filtreChip, active && styles.filtreChipActive]}>
      <ThemedText style={[styles.filtreChipText, active && styles.filtreChipTextActive]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

/** Carte compacte pour "Mes textes suivis" et "Récemment consultés" */
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

function RecentCard({ item, onPress }: { item: RecentItem; onPress?: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.recentCard, pressed && styles.cardPressed]} onPress={onPress}>
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

function CodeCard({ item, onPress }: { item: CodeItem; onPress?: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.codeCard, pressed && styles.cardPressed]} onPress={onPress}>
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

function JurisprudenceCard({ item, onPress }: { item: JurisItem; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
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

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function BibliothequeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filtreCat, setFiltreCat] = useState<FiltreCatId>('tous');

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

  // Sections visibles selon le filtre actif
  const showCodes = filtreCat === 'tous' || filtreCat === 'codes';
  const showLois = filtreCat === 'tous' || filtreCat === 'lois';
  const showDecrets = filtreCat === 'tous' || filtreCat === 'decrets';
  const showJuris = filtreCat === 'tous' || filtreCat === 'jurisprudences';
  const showOrdonnances = filtreCat === 'tous' || filtreCat === 'ordonnances';
  const showReglements = filtreCat === 'tous' || filtreCat === 'reglements';
  const showTout = filtreCat === 'tous';

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
          renderItem={({ item }) => <SearchResultItem item={item} onPress={() => router.push(`/document/${item.id}` as any)} />}
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
        /* ── Sections de découverte ── */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>

          {/* ── FilterRow catégories ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtreRow}
            style={styles.filtreRowWrapper}>
            {FILTRES_CAT.map((f) => (
              <FiltreChip
                key={f.id}
                label={f.label}
                active={filtreCat === f.id}
                onPress={() => setFiltreCat(f.id)}
              />
            ))}
          </ScrollView>

          {/* ── Mes textes suivis ── */}
          {showTout && (
            <View style={styles.section}>
              <SectionHeader title="Mes textes suivis" onSeeAll={() => router.push('/suivis' as any)} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}>
                {TEXTES_SUIVIS.map((item) => (
                  <FollowedCard key={item.id} item={item} onPress={() => router.push(`/document/${item.id}` as any)} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Récemment consultés ── */}
          {showTout && (
            <View style={styles.section}>
              <SectionHeader title="Récemment consultés" onSeeAll={() => {}} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}>
                {RECENTS_CONSULTES.map((item) => (
                  <FollowedCard key={item.id} item={item} onPress={() => router.push(`/document/${item.id}` as any)} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Récemment modifiés ── */}
          {(showTout || showLois || showDecrets || showOrdonnances || showReglements) && (
            <View style={styles.section}>
              <SectionHeader
                title="Récemment modifiés"
                onSeeAll={() =>
                  router.push({
                    pathname: '/liste',
                    params: { title: 'Récemment modifiés', mode: 'documents', defaultStatus: 'modifie' },
                  } as any)
                }
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}>
                {RECENTS
                  .filter((r) =>
                    showTout ||
                    (showLois && r.type === 'Loi') ||
                    (showDecrets && r.type === 'Décret') ||
                    (showOrdonnances && r.type === 'Ordonnance') ||
                    (showReglements && r.type === 'Arrêté'),
                  )
                  .map((item) => (
                    <RecentCard key={item.id} item={item} onPress={() => router.push(`/document/${item.id}` as any)} />
                  ))}
              </ScrollView>
            </View>
          )}

          {/* ── Catégories ── */}
          {showTout && (
            <View style={styles.section}>
              <SectionHeader title="Textes législatifs et Réglementaires" />
              <View style={styles.catGrid}>
                {CATEGORIES.map((item) => (
                  <CategoryGridItem key={item.id} item={item} />
                ))}
              </View>
            </View>
          )}

          {/* ── Codes et recueils ── */}
          {(showCodes || showTout) && (
            <View style={styles.section}>
              <SectionHeader
                title="Codes et recueils"
                onSeeAll={() =>
                  router.push({
                    pathname: '/liste',
                    params: { title: 'Codes et recueils', mode: 'documents', type: 'code' },
                  } as any)
                }
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}>
                {CODES.map((item) => (
                  <CodeCard key={item.id} item={item} onPress={() => router.push(`/document/${item.id}` as any)} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* ── Jurisprudence ── */}
          {(showJuris || showTout) && (
            <View style={styles.section}>
              <SectionHeader
                title="Jurisprudence"
                onSeeAll={() =>
                  router.push({
                    pathname: '/liste',
                    params: { title: 'Jurisprudence', mode: 'jurisprudences' },
                  } as any)
                }
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.hScroll}>
                {JURISPRUDENCES.map((item) => (
                  <JurisprudenceCard key={item.id} item={item} onPress={() => router.push(`/document/${item.id}` as any)} />
                ))}
              </ScrollView>
            </View>
          )}

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

  // FilterRow catégories
  filtreRowWrapper: {
    backgroundColor: Palette.background,
  },
  filtreRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 8,
  },
  filtreChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Palette.accent2 + '30',
  },
  filtreChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  filtreChipText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  filtreChipTextActive: {
    color: '#fff',
  },

  // Carte suivie (Mes textes suivis / Récemment consultés)
  followedCard: {
    width: 200,
    backgroundColor: '#fff',
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

  // Feedback pression
  cardPressed: {
    opacity: 0.72,
  },
});
