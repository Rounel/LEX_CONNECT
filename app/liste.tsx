import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';
import { contentService } from '@/services/api/content.service';
import type { DocumentStatus, DocumentSummary, DocumentType } from '@/services/api/types';

// ─── Constantes ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

type Mode = 'documents' | 'jurisprudences';

// Filtres par mode — seuls ces tableaux diffèrent entre les sections
const STATUS_FILTERS: { id: DocumentStatus | null; label: string }[] = [
  { id: null, label: 'Tous' },
  { id: 'en_vigueur', label: 'En vigueur' },
  { id: 'abroge', label: 'Abrogé' },
  { id: 'modifie', label: 'Modifié' },
  { id: 'suspendu', label: 'Suspendu' },
];

const MATTER_FILTERS: { id: string | null; label: string }[] = [
  { id: null, label: 'Toutes' },
  { id: 'civil', label: 'Civil' },
  { id: 'pénal', label: 'Pénal' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'social', label: 'Social' },
  { id: 'administratif', label: 'Administratif' },
  { id: 'constitutionnel', label: 'Constitutionnel' },
];

const STATUS_STYLES: Record<DocumentStatus, { bg: string; text: string; label: string }> = {
  en_vigueur: { bg: '#E6F6EE', text: '#1E7A47', label: 'En vigueur' },
  abroge: { bg: '#FDEDEB', text: '#C0392B', label: 'Abrogé' },
  modifie: { bg: '#FEF4E8', text: '#D4821A', label: 'Modifié' },
  suspendu: { bg: '#F0F0F0', text: '#767676', label: 'Suspendu' },
};

const TYPE_COLORS: Record<DocumentType, string> = {
  code: Palette.primary,
  texte_de_loi: '#1565C0',
  jurisprudence: '#4A148C',
  reglement: '#2E7D32',
  autre: Palette.accent2,
};

const TYPE_LABELS: Record<DocumentType, string> = {
  code: 'Code',
  texte_de_loi: 'Loi',
  jurisprudence: 'Jurisprudence',
  reglement: 'Règlement',
  autre: 'Autre',
};

const COUNTRY_INFO: Record<string, { flag: string; name: string }> = {
  CI: { flag: '🇨🇮', name: "Côte d'Ivoire" },
  SN: { flag: '🇸🇳', name: 'Sénégal' },
  ML: { flag: '🇲🇱', name: 'Mali' },
  BF: { flag: '🇧🇫', name: 'Burkina Faso' },
  GN: { flag: '🇬🇳', name: 'Guinée' },
  TG: { flag: '🇹🇬', name: 'Togo' },
  BJ: { flag: '🇧🇯', name: 'Bénin' },
  NE: { flag: '🇳🇪', name: 'Niger' },
  CM: { flag: '🇨🇲', name: 'Cameroun' },
  FR: { flag: '🇫🇷', name: 'France' },
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function DocumentCard({ item, onPress }: { item: DocumentSummary; onPress: () => void }) {
  const [followed, setFollowed] = useState(false);
  const status = STATUS_STYLES[item.status];
  const typeColor = TYPE_COLORS[item.type] ?? Palette.accent2;
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;
  const country = COUNTRY_INFO[item.country] ?? { flag: '🌍', name: item.country };
  const date = formatDate(item.publication_date);
  const isCode = item.type === 'code';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}>
      {/* <View style={[styles.cardAccent, { backgroundColor: typeColor }]} /> */}
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <ThemedText style={[styles.cardType, { color: typeColor }]}>
            {typeLabel}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <ThemedText style={[styles.statusText, { color: status.text }]}>
              {status.label}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </ThemedText>

        {item.summary !== null && (
          <ThemedText style={styles.cardSummary} numberOfLines={2}>
            {item.summary}
          </ThemedText>
        )}

        {isCode ? (
          <View style={styles.cardFooterCode}>
            <View style={styles.codeStats}>
              {item.texts_count != null && (
                <View style={styles.codeStat}>
                  <ThemedText style={styles.codeStatValue}>{item.texts_count}</ThemedText>
                  <ThemedText style={styles.codeStatLabel}>textes</ThemedText>
                </View>
              )}
              {item.articles_count != null && (
                <View style={styles.codeStat}>
                  <ThemedText style={styles.codeStatValue}>{item.articles_count}</ThemedText>
                  <ThemedText style={styles.codeStatLabel}>articles</ThemedText>
                </View>
              )}
              {item.edition != null && (
                <View style={styles.codeStat}>
                  <ThemedText style={styles.codeStatValue}>{item.edition}</ThemedText>
                  <ThemedText style={styles.codeStatLabel}>édition</ThemedText>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={[styles.followBtn, followed && styles.followBtnActive]}
              onPress={(e) => {
                e.stopPropagation();
                setFollowed((v) => !v);
              }}
              activeOpacity={0.75}>
              <IconSymbol
                name={followed ? 'bookmark.fill' : 'bookmark'}
                size={13}
                color={followed ? '#fff' : Palette.primary}
              />
              <ThemedText style={[styles.followBtnText, followed && styles.followBtnTextActive]}>
                {followed ? 'Suivi' : 'Suivre'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardFooter}>
            <ThemedText style={styles.cardMeta}>
              {country.flag} {country.name}
            </ThemedText>
            {date !== null && (
              <ThemedText style={styles.cardDate}>{date}</ThemedText>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function ListeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title?: string;
    mode?: string;
    type?: string;
    defaultStatus?: string;
  }>();

  const title = params.title ?? 'Documents';
  const mode: Mode = params.mode === 'jurisprudences' ? 'jurisprudences' : 'documents';
  const fixedType = params.type as DocumentType | undefined;

  // ── State filtres ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeStatus, setActiveStatus] = useState<DocumentStatus | null>(
    (params.defaultStatus as DocumentStatus) ?? null,
  );
  const [activeMatter, setActiveMatter] = useState<string | null>(null);

  // ── State liste ───────────────────────────────────────────────────────────────
  const [items, setItems] = useState<DocumentSummary[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Debounce recherche ────────────────────────────────────────────────────────
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  // ── Chargement initial + reset sur changement de filtre ───────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data =
          mode === 'jurisprudences'
            ? await contentService.getJurisprudences({
                matter: activeMatter ?? undefined,
                q: debouncedQuery || undefined,
                page: 1,
                size: PAGE_SIZE,
              })
            : await contentService.getDocuments({
                type: fixedType,
                status: activeStatus ?? undefined,
                q: debouncedQuery || undefined,
                page: 1,
                size: PAGE_SIZE,
              });

        if (!cancelled) {
          setItems(data.items);
          setHasMore(data.page < data.pages);
          setPage(1);
        }
      } catch {
        if (!cancelled) {
          setError('Impossible de charger les données. Vérifiez votre connexion.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [mode, fixedType, activeStatus, activeMatter, debouncedQuery]);

  // ── Chargement page suivante ──────────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data =
        mode === 'jurisprudences'
          ? await contentService.getJurisprudences({
              matter: activeMatter ?? undefined,
              q: debouncedQuery || undefined,
              page: nextPage,
              size: PAGE_SIZE,
            })
          : await contentService.getDocuments({
              type: fixedType,
              status: activeStatus ?? undefined,
              q: debouncedQuery || undefined,
              page: nextPage,
              size: PAGE_SIZE,
            });

      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.page < data.pages);
      setPage(nextPage);
    } catch {
      // Echec silencieux — l'utilisateur peut rescroller pour réessayer
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, isLoading, page, mode, fixedType, activeStatus, activeMatter, debouncedQuery]);

  // ── Helpers filtres (les deux modes partagent la même logique de chip) ────────
  const filters = mode === 'jurisprudences' ? MATTER_FILTERS : STATUS_FILTERS;
  const activeFilterId = mode === 'jurisprudences' ? activeMatter : activeStatus;

  const handleFilterPress = (id: string | null) => {
    if (mode === 'jurisprudences') {
      setActiveMatter(id);
    } else {
      setActiveStatus(id as DocumentStatus | null);
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: DocumentSummary }) => (
      <View style={styles.cardWrapper}>
        <DocumentCard
          item={item}
          onPress={() => router.push(`/document/${item.id}` as any)}
        />
      </View>
    ),
    [router],
  );

  const ListFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator color={Palette.primary} />
        </View>
      );
    }
    if (!hasMore && items.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <ThemedText style={styles.footerText}>Tous les résultats affichés</ThemedText>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, items.length]);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle} numberOfLines={1}>
          {title}
        </ThemedText>
      </View>

      {/* ── Barre de recherche ── */}
      <View style={styles.searchWrapper}>
        <IconSymbol name="magnifyingglass" size={16} color={Palette.accent2} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher…"
          placeholderTextColor={Palette.accent2}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <IconSymbol name="xmark" size={14} color={Palette.accent2} />
          </Pressable>
        )}
      </View>

      {/* ── Chips de filtre — seule partie qui diffère selon la section ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersWrapper}>
        {filters.map((f) => (
          <FilterChip
            key={String(f.id)}
            label={f.label}
            active={activeFilterId === f.id}
            onPress={() => handleFilterPress(f.id)}
          />
        ))}
      </ScrollView>

      {/* ── Liste ── */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Palette.primary} />
        </View>
      ) : error !== null ? (
        <View style={styles.centered}>
          <IconSymbol name="wifi.slash" size={40} color={Palette.accent2} />
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <Pressable
            onPress={() => {
              setError(null);
              setItems([]);
            }}
            style={styles.retryBtn}>
            <ThemedText style={styles.retryText}>Réessayer</ThemedText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={
            <View style={styles.centered}>
              <IconSymbol name="doc.text" size={40} color={Palette.accent2} />
              <ThemedText style={styles.emptyText}>
                {debouncedQuery
                  ? `Aucun résultat pour « ${debouncedQuery} »`
                  : 'Aucun document dans cette catégorie.'}
              </ThemedText>
            </View>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.background },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 4,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  backText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },

  // Recherche
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    padding: 0,
  },

  // Filtres (la seule partie qui varie selon le mode)
  filtersWrapper: { backgroundColor: Palette.background },
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Palette.accent2 + '30',
  },
  chipActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  chipText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  chipTextActive: { color: '#fff' },

  // Liste
  listContent: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  // Carte document
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F5E2',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardPressed: { opacity: 0.72 },
  cardAccent: { width: 4 },
  cardBody: {
    flex: 1,
    padding: 14,
    gap: 7,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardType: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 20,
  },
  cardSummary: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  cardMeta: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  cardDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // Footer spécifique aux codes
  cardFooterCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.accent2 + '30',
  },
  codeStats: {
    flexDirection: 'row',
    gap: 14,
  },
  codeStat: {
    alignItems: 'center',
  },
  codeStatValue: {
    fontSize: 13,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.primary,
    lineHeight: 17,
  },
  codeStatLabel: {
    fontSize: 10,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 13,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.primary,
    backgroundColor: 'transparent',
  },
  followBtnActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  followBtnText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  followBtnTextActive: {
    color: '#fff',
  },

  // Footer pagination
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // États vide / erreur
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 21,
  },
  errorText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 21,
  },
  retryBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  retryText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },
});
