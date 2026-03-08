import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';
import { contentService } from '@/services/api/content.service';
import { ApiError } from '@/services/api/client';
import { useAuth } from '@/contexts/auth-context';
import type { Article, DocumentHierarchical } from '@/services/api/types';

// ─── Types locaux ─────────────────────────────────────────────────────────────

type ViewState = 'sommaire' | 'reader';
type ReaderMode = 'article' | 'texte';
type TocTab = 'sommaire' | 'ajoutes' | 'modifies' | 'abroges' | 'anciens';

const TOC_TABS: { key: TocTab; label: string }[] = [
  { key: 'sommaire', label: 'Sommaire' },
  { key: 'ajoutes', label: 'Ajoutés' },
  { key: 'modifies', label: 'Modifiés' },
  { key: 'abroges', label: 'Abrogés' },
  { key: 'anciens', label: 'Anciens' },
];

type TocEntry =
  | { kind: 'partie'; id: string; title: string }
  | { kind: 'initiative'; id: string; title: string }
  | { kind: 'titre'; id: string; title: string }
  | { kind: 'chapitre'; id: string; title: string }
  | { kind: 'section'; id: string; title: string }
  | { kind: 'article'; id: string; number: string; flatIndex: number };

type RichArticle = Article & {
  titreTitle: string;
  chapitreTitle: string;
  sectionTitle: string | null;
};

// Config visuelle par niveau hiérarchique (paddingLeft, fontSize, font, color, bg, paddingV)
const TOC_CONFIGS: Record<
  Exclude<TocEntry['kind'], 'article'>,
  { pl: number; fs: number; fw: string; color: string; bg: string; pv: number }
> = {
  partie: {
    pl: 0, fs: 13, fw: Fonts.heading.bold,
    color: Palette.primary, bg: Palette.primary + '10', pv: 12,
  },
  initiative: {
    pl: 8, fs: 12, fw: Fonts.body.semiBold,
    color: Palette.foreground, bg: 'transparent', pv: 9,
  },
  titre: {
    pl: 16, fs: 12, fw: Fonts.body.semiBold,
    color: Palette.foreground, bg: 'transparent', pv: 8,
  },
  chapitre: {
    pl: 24, fs: 11, fw: Fonts.body.semiBold,
    color: Palette.accent2, bg: 'transparent', pv: 7,
  },
  section: {
    pl: 32, fs: 11, fw: Fonts.body.regular,
    color: Palette.accent2, bg: 'transparent', pv: 6,
  },
};

// ─── Traitement des données hiérarchiques ─────────────────────────────────────

function processDoc(doc: DocumentHierarchical): {
  toc: TocEntry[];
  articles: RichArticle[];
} {
  const toc: TocEntry[] = [];
  const articles: RichArticle[] = [];

  for (const partie of doc.parties) {
    toc.push({ kind: 'partie', id: partie.id, title: partie.title });

    for (const initiative of partie.initiatives) {
      toc.push({ kind: 'initiative', id: initiative.id, title: initiative.title });

      for (const titre of initiative.titres) {
        toc.push({ kind: 'titre', id: titre.id, title: titre.title });

        for (const chapitre of titre.chapitres) {
          toc.push({ kind: 'chapitre', id: chapitre.id, title: chapitre.title });

          // Articles directement dans le chapitre (sans section)
          const directArts = [...chapitre.articles].sort((a, b) => a.order_index - b.order_index);
          for (const art of directArts) {
            toc.push({ kind: 'article', id: art.id, number: art.number, flatIndex: articles.length });
            articles.push({ ...art, titreTitle: titre.title, chapitreTitle: chapitre.title, sectionTitle: null });
          }

          for (const section of chapitre.sections) {
            toc.push({ kind: 'section', id: section.id, title: section.title });

            const sectionArts = [...section.articles].sort((a, b) => a.order_index - b.order_index);
            for (const art of sectionArts) {
              toc.push({ kind: 'article', id: art.id, number: art.number, flatIndex: articles.length });
              articles.push({ ...art, titreTitle: titre.title, chapitreTitle: chapitre.title, sectionTitle: section.title });
            }
          }
        }
      }
    }
  }

  return { toc, articles };
}

// ─── Composant entrée TOC ─────────────────────────────────────────────────────

function TocItem({
  entry,
  onArticlePress,
}: {
  entry: TocEntry;
  onArticlePress: (idx: number) => void;
}) {
  if (entry.kind === 'article') {
    return (
      <Pressable
        style={({ pressed }) => [styles.tocArticleRow, pressed && styles.tocArticlePressed]}
        onPress={() => onArticlePress(entry.flatIndex)}>
        <ThemedText style={styles.tocArticleText}>{entry.number}</ThemedText>
        <IconSymbol name="chevron.right" size={13} color={Palette.accent2} />
      </Pressable>
    );
  }

  const cfg = TOC_CONFIGS[entry.kind];
  return (
    <View
      style={{
        paddingLeft: 16 + cfg.pl,
        paddingRight: 16,
        paddingVertical: cfg.pv,
        backgroundColor: cfg.bg,
      }}>
      <ThemedText
        style={{ fontSize: cfg.fs, fontFamily: cfg.fw, color: cfg.color, lineHeight: cfg.fs * 1.5 }}
        numberOfLines={4}>
        {'title' in entry ? entry.title : ''}
      </ThemedText>
    </View>
  );
}

// ─── Composant résultat de recherche ─────────────────────────────────────────

function SearchResultItem({
  article,
  onPress,
}: {
  article: RichArticle;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.searchResultRow, pressed && styles.tocArticlePressed]}
      onPress={onPress}>
      <View style={styles.searchResultLeft}>
        <ThemedText style={styles.searchResultBreadcrumb} numberOfLines={1}>
          {article.chapitreTitle}
          {article.sectionTitle ? ` · ${article.sectionTitle}` : ''}
        </ThemedText>
        <ThemedText style={styles.searchResultNum}>{article.number}</ThemedText>
        <ThemedText style={styles.searchResultPreview} numberOfLines={2}>
          {article.content}
        </ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={13} color={Palette.accent2} />
    </Pressable>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function ReaderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isPremium } = useAuth();

  // ── Données ───────────────────────────────────────────────────────────────────
  const [doc, setDoc] = useState<DocumentHierarchical | null>(null);
  const [toc, setToc] = useState<TocEntry[]>([]);
  const [articles, setArticles] = useState<RichArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremiumRequired, setIsPremiumRequired] = useState(false);

  // ── État vue ──────────────────────────────────────────────────────────────────
  const [view, setView] = useState<ViewState>('sommaire');
  const [articleIdx, setArticleIdx] = useState(0);
  const [readerMode, setReaderMode] = useState<ReaderMode>('article');

  // ── Onglets sommaire ──────────────────────────────────────────────────────────
  const [tocTab, setTocTab] = useState<TocTab>('sommaire');

  // ── Recherche (sommaire) ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const isSearching = searchQuery.trim().length > 0;

  // ── Refs ──────────────────────────────────────────────────────────────────────
  const texteScrollRef = useRef<ScrollView>(null);
  const articleScrollRef = useRef<ScrollView>(null);
  // Map articleId → Y offset pour le scroll automatique en mode texte
  const yOffsets = useRef<Map<string, number>>(new Map());

  // ── Chargement ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);

    contentService
      .getDocumentHierarchical(id)
      .then((data) => {
        setDoc(data);
        const { toc: t, articles: a } = processDoc(data);
        setToc(t);
        setArticles(a);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 403) {
          setIsPremiumRequired(true);
        } else {
          setError('Impossible de charger ce document. Vérifiez votre connexion.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // ── Résultats de recherche (filtre côté client sur le TOC) ───────────────────
  const searchResults = useMemo<RichArticle[]>(() => {
    if (!isSearching) return [];
    const q = searchQuery.trim().toLowerCase();
    return articles.filter(
      (art) =>
        art.number.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q),
    );
  }, [searchQuery, articles, isSearching]);

  // ── Ouvrir un article depuis le sommaire ──────────────────────────────────────
  const openArticle = useCallback((idx: number) => {
    setArticleIdx(idx);
    setView('reader');
    setSearchQuery('');
  }, []);

  // ── Navigation Précédent / Suivant ────────────────────────────────────────────
  const prev = useCallback(() => {
    setArticleIdx((i) => {
      const next = Math.max(0, i - 1);
      articleScrollRef.current?.scrollTo({ y: 0, animated: false });
      return next;
    });
  }, []);

  const next = useCallback(() => {
    setArticleIdx((i) => {
      const next = Math.min(articles.length - 1, i + 1);
      articleScrollRef.current?.scrollTo({ y: 0, animated: false });
      return next;
    });
  }, [articles.length]);

  // ── Toggle mode : si on passe en texte → auto-scroll vers l'article actif ────
  const toggleMode = useCallback(() => {
    setReaderMode((m) => (m === 'article' ? 'texte' : 'article'));
  }, []);

  // ── Auto-scroll en mode texte quand articleIdx ou mode change ─────────────────
  useEffect(() => {
    if (view !== 'reader' || readerMode !== 'texte' || !articles[articleIdx]) return;
    const t = setTimeout(() => {
      const y = yOffsets.current.get(articles[articleIdx].id);
      if (y !== undefined) {
        texteScrollRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });
      }
    }, 120);
    return () => clearTimeout(t);
  }, [view, readerMode, articleIdx, articles]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Écrans d'état (loading, paywall, erreur)
  // ─────────────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.stateHeader}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          </Pressable>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Palette.primary} />
          <ThemedText style={styles.stateText}>Chargement du document…</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (isPremiumRequired) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.stateHeader}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          </Pressable>
        </View>
        <View style={styles.centered}>
          <IconSymbol name="lock.fill" size={48} color={Palette.primary} />
          <ThemedText style={styles.paywallTitle}>Contenu Premium</ThemedText>
          <ThemedText style={styles.paywallDesc}>
            L&apos;accès aux articles complets nécessite un abonnement Wilex Premium.
          </ThemedText>
          <Pressable style={styles.upgradeBtn} onPress={() => router.back()}>
            <ThemedText style={styles.upgradeBtnText}>Découvrir Premium</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !doc) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.stateHeader}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          </Pressable>
        </View>
        <View style={styles.centered}>
          <IconSymbol name="wifi.slash" size={40} color={Palette.accent2} />
          <ThemedText style={styles.stateText}>{error ?? 'Erreur de chargement.'}</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const currentArticle = articles[articleIdx];
  const total = articles.length;
  const progress = total > 0 ? ((articleIdx + 1) / total) * 100 : 0;

  // ─────────────────────────────────────────────────────────────────────────────
  // VUE SOMMAIRE
  // ─────────────────────────────────────────────────────────────────────────────

  if (view === 'sommaire') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.sommaireHeader}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          </Pressable>
          <View style={styles.sommaireHeaderText}>
            <ThemedText style={styles.sommaireTitle} numberOfLines={2}>
              {doc.title}
            </ThemedText>
            <ThemedText style={styles.sommaireCount}>
              {total} article{total !== 1 ? 's' : ''}
            </ThemedText>
          </View>
        </View>

        {/* Onglets */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tocTabsScroll}
          contentContainerStyle={styles.tocTabsContent}>
          {TOC_TABS.map((tab) => {
            const active = tocTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[styles.tocTabBtn, active && styles.tocTabBtnActive]}
                onPress={() => setTocTab(tab.key)}>
                <ThemedText style={[styles.tocTabLabel, active && styles.tocTabLabelActive]}>
                  {tab.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Barre de recherche */}
        <View style={styles.searchWrapper}>
          <IconSymbol name="magnifyingglass" size={16} color={Palette.accent2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un article…"
            placeholderTextColor={Palette.accent2}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {isSearching && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <IconSymbol name="xmark" size={14} color={Palette.accent2} />
            </Pressable>
          )}
        </View>

        {tocTab !== 'sommaire' ? (
          /* ── Onglets vides (Ajoutés / Modifiés / Abrogés / Anciens) ── */
          <View style={styles.emptyTab}>
            <ThemedText style={styles.emptyTabText}>
              Aucun article {TOC_TABS.find((t) => t.key === tocTab)?.label.toLowerCase()} dans ce texte.
            </ThemedText>
          </View>
        ) : isSearching ? (
          /* ── Résultats de recherche ── */
          <FlatList
            data={searchResults}
            keyExtractor={(art) => art.id}
            renderItem={({ item }) => (
              <SearchResultItem
                article={item}
                onPress={() => openArticle(articles.indexOf(item))}
              />
            )}
            contentContainerStyle={styles.searchResultsList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptySearch}>
                <ThemedText style={styles.emptySearchText}>
                  Aucun résultat pour « {searchQuery} »
                </ThemedText>
              </View>
            }
          />
        ) : (
          /* ── Table des matières ── */
          <FlatList
            data={toc}
            keyExtractor={(entry, i) => `${entry.kind}-${entry.id}-${i}`}
            renderItem={({ item }) => <TocItem entry={item} onArticlePress={openArticle} />}
            contentContainerStyle={styles.tocList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={30}
            maxToRenderPerBatch={20}
            windowSize={10}
            removeClippedSubviews
          />
        )}
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // VUE LECTEUR
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.readerSafe} edges={['top', 'bottom']}>

      {/* ── Header lecteur ── */}
      <View style={styles.readerHeader}>
        {/* Retour → sommaire */}
        <Pressable onPress={() => setView('sommaire')} hitSlop={10} style={styles.iconBtn}>
          <IconSymbol name="chevron.left" size={22} color={Palette.foreground} />
        </Pressable>

        <ThemedText style={styles.readerHeaderTitle} numberOfLines={1}>
          {doc.title}
        </ThemedText>

        {/* Toggle mode d'affichage */}
        <Pressable onPress={toggleMode} hitSlop={10} style={styles.modeToggleBtn}>
          <IconSymbol
            name={readerMode === 'article' ? 'doc.text' : 'square.split.2x1'}
            size={18}
            color={Palette.primary}
          />
          <ThemedText style={styles.modeToggleLabel}>
            {readerMode === 'article' ? 'Texte' : 'Article'}
          </ThemedText>
        </Pressable>
      </View>

      {/* ── Barre de progression ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>

      {/* ── Breadcrumb (position dans le code) ── */}
      {currentArticle && (
        <View style={styles.breadcrumbBar}>
          <ThemedText style={styles.breadcrumbText} numberOfLines={1}>
            {currentArticle.titreTitle}
            {currentArticle.chapitreTitle ? ` · ${currentArticle.chapitreTitle}` : ''}
            {currentArticle.sectionTitle ? ` · ${currentArticle.sectionTitle}` : ''}
          </ThemedText>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* MODE ARTICLE — split screen 50/50                                     */}
      {/* ══════════════════════════════════════════════════════════════════════ */}

      {readerMode === 'article' && currentArticle && (
        <View style={styles.splitContainer}>
          {/* Moitié haute — contenu de l'article */}
          <View style={styles.articleHalf}>
            <ScrollView
              ref={articleScrollRef}
              contentContainerStyle={styles.articleScrollContent}
              showsVerticalScrollIndicator={false}>
              <ThemedText style={styles.articleNumber}>{currentArticle.number}</ThemedText>
              {currentArticle.title !== null && (
                <ThemedText style={styles.articleTitle}>{currentArticle.title}</ThemedText>
              )}
              <ThemedText style={styles.articleBody}>{currentArticle.content}</ThemedText>
            </ScrollView>
          </View>

          {/* Séparateur drag-handle */}
          <View style={styles.splitDivider}>
            <View style={styles.splitHandle} />
          </View>

          {/* Moitié basse — commentaires / explications */}
          <View style={styles.commentsHalf}>
            <View style={styles.commentsHeaderRow}>
              <IconSymbol name="bubble.left.and.bubble.right.fill" size={13} color={Palette.accent2} />
              <ThemedText style={styles.commentsHeaderTitle}>
                Commentaires & Explications
              </ThemedText>
            </View>
            <ScrollView
              contentContainerStyle={styles.commentsScrollContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.alexiaCta}>
                <ThemedText style={styles.alexiaCtaText}>
                  Alexia peut expliquer cet article, le comparer à d&apos;autres textes et répondre à vos questions juridiques.
                </ThemedText>
                <Pressable
                  style={styles.alexiaBtn}
                  onPress={() => router.push('/(tabs)/alexia' as any)}>
                  <IconSymbol name="sparkles" size={14} color="#fff" />
                  <ThemedText style={styles.alexiaBtnText}>Demander à Alexia</ThemedText>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* MODE TEXTE COMPLET — tout le code en scroll                           */}
      {/* ══════════════════════════════════════════════════════════════════════ */}

      {readerMode === 'texte' && (
        <ScrollView
          ref={texteScrollRef}
          style={styles.texteScroll}
          contentContainerStyle={styles.texteContent}
          showsVerticalScrollIndicator={false}>
          {articles.map((art, idx) => {
            const prevArt = articles[idx - 1];
            const showTitre = idx === 0 || art.titreTitle !== prevArt.titreTitle;
            const showChapitre = idx === 0 || art.chapitreTitle !== prevArt.chapitreTitle;
            const showSection =
              art.sectionTitle !== null &&
              (idx === 0 || art.sectionTitle !== prevArt.sectionTitle);
            const isActive = idx === articleIdx;

            return (
              <View
                key={art.id}
                onLayout={(e) => {
                  yOffsets.current.set(art.id, e.nativeEvent.layout.y);
                }}>
                {showTitre && (
                  <ThemedText style={styles.texteTitreHeader}>{art.titreTitle}</ThemedText>
                )}
                {showChapitre && (
                  <ThemedText style={styles.texteChapitreHeader}>{art.chapitreTitle}</ThemedText>
                )}
                {showSection && (
                  <ThemedText style={styles.texteSectionHeader}>{art.sectionTitle}</ThemedText>
                )}

                <Pressable
                  style={[styles.texteArticle, isActive && styles.texteArticleActive]}
                  onPress={() => setArticleIdx(idx)}>
                  <ThemedText
                    style={[styles.texteArticleNum, isActive && styles.texteArticleNumActive]}>
                    {art.number}
                  </ThemedText>
                  {art.title !== null && (
                    <ThemedText style={styles.texteArticleTitle}>{art.title}</ThemedText>
                  )}
                  <ThemedText style={styles.texteArticleBody}>{art.content}</ThemedText>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* ── Barre de navigation Précédent / Suivant ── */}
      <View style={styles.navBar}>
        <Pressable
          style={[styles.navBtn, articleIdx === 0 && styles.navBtnDisabled]}
          onPress={prev}
          disabled={articleIdx === 0}>
          <IconSymbol
            name="chevron.left"
            size={14}
            color={articleIdx === 0 ? Palette.accent2 : Palette.primary}
          />
          <ThemedText style={[styles.navBtnText, articleIdx === 0 && styles.navBtnTextOff]}>
            Précédent
          </ThemedText>
        </Pressable>

        <View style={styles.navCenter}>
          <ThemedText style={styles.navCounter}>
            {articleIdx + 1} / {total}
          </ThemedText>
          <Pressable onPress={() => setView('sommaire')} hitSlop={6}>
            <ThemedText style={styles.navSommaireLink}>Sommaire</ThemedText>
          </Pressable>
        </View>

        <Pressable
          style={[styles.navBtn, styles.navBtnRight, articleIdx === total - 1 && styles.navBtnDisabled]}
          onPress={next}
          disabled={articleIdx === total - 1}>
          <ThemedText style={[styles.navBtnText, articleIdx === total - 1 && styles.navBtnTextOff]}>
            Suivant
          </ThemedText>
          <IconSymbol
            name="chevron.right"
            size={14}
            color={articleIdx === total - 1 ? Palette.accent2 : Palette.primary}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Communs ──────────────────────────────────────────────────────────────────
  safe: { flex: 1, backgroundColor: Palette.background },
  readerSafe: { flex: 1, backgroundColor: '#fff' },
  stateHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  stateText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 21,
  },

  // ── Paywall ──────────────────────────────────────────────────────────────────
  paywallTitle: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    textAlign: 'center',
  },
  paywallDesc: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 21,
  },
  upgradeBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 8,
  },
  upgradeBtnText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },

  // ── Sommaire — Header ────────────────────────────────────────────────────────
  sommaireHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 12,
  },
  backBtn: { padding: 4, marginTop: 2 },
  sommaireHeaderText: { flex: 1, gap: 3 },
  sommaireTitle: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 27,
  },
  sommaireCount: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // ── Onglets sommaire ─────────────────────────────────────────────────────────
  tocTabsScroll: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  tocTabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    flexDirection: 'row',
    gap: 4,
  },
  tocTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tocTabBtnActive: {
    borderBottomColor: Palette.primary,
  },
  tocTabLabel: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  tocTabLabelActive: {
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  emptyTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTabText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },

  // ── Recherche ─────────────────────────────────────────────────────────────────
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
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

  // ── TOC ───────────────────────────────────────────────────────────────────────
  tocList: { paddingBottom: 40 },
  tocArticleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 56,
    paddingRight: 16,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebebeb',
    gap: 8,
    backgroundColor: '#fff',
  },
  tocArticlePressed: { opacity: 0.6 },
  tocArticleText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },

  // ── Résultats de recherche ────────────────────────────────────────────────────
  searchResultsList: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 10 },
  searchResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  searchResultLeft: { flex: 1, gap: 4 },
  searchResultBreadcrumb: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  searchResultNum: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.primary,
  },
  searchResultPreview: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 18,
  },
  emptySearch: { paddingTop: 48, alignItems: 'center', paddingHorizontal: 32 },
  emptySearchText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },

  // ── Lecteur — Header ──────────────────────────────────────────────────────────
  readerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e8e8e8',
    gap: 8,
  },
  iconBtn: { padding: 4 },
  readerHeaderTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
  },
  modeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Palette.accent1,
  },
  modeToggleLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  // ── Barre de progression ──────────────────────────────────────────────────────
  progressTrack: { height: 3, backgroundColor: '#eeeeee' },
  progressFill: { height: 3, backgroundColor: Palette.primary, borderRadius: 2 },

  // ── Breadcrumb ────────────────────────────────────────────────────────────────
  breadcrumbBar: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: Palette.accent1 + '60',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  breadcrumbText: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // ── Mode article — split screen ───────────────────────────────────────────────
  splitContainer: { flex: 1 },

  articleHalf: {
    flex: 1,
    borderBottomWidth: 0, // géré par le divider
  },
  articleScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  articleNumber: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  articleTitle: {
    fontSize: 15,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 22,
  },
  articleBody: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 28,
  },

  // Séparateur
  splitDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginTop: -2,
  },

  // Moitié basse — commentaires
  commentsHalf: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  commentsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ebebeb',
  },
  commentsHeaderTitle: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  commentsScrollContent: {
    padding: 16,
  },
  alexiaCta: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Palette.primary + '20',
  },
  alexiaCtaText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 20,
  },
  alexiaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: Palette.primary,
    paddingVertical: 11,
    borderRadius: 10,
  },
  alexiaBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },

  // ── Mode texte complet ────────────────────────────────────────────────────────
  texteScroll: { flex: 1 },
  texteContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  texteTitreHeader: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 28,
    marginBottom: 4,
  },
  texteChapitreHeader: {
    fontSize: 16,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 10,
  },
  texteSectionHeader: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    marginTop: 14,
    marginBottom: 6,
  },
  texteArticle: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eeeeee',
    gap: 8,
  },
  texteArticleActive: {
    backgroundColor: Palette.primary + '08',
    paddingHorizontal: 10,
    marginHorizontal: -10,
    borderRadius: 10,
    borderBottomWidth: 0,
  },
  texteArticleNum: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  texteArticleNumActive: { color: Palette.primary },
  texteArticleTitle: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 20,
  },
  texteArticleBody: {
    fontSize: 15,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 26,
  },

  // ── Barre de navigation Précédent / Suivant ───────────────────────────────────
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e8e8e8',
    backgroundColor: '#fff',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: Palette.accent1,
    minWidth: 100,
  },
  navBtnRight: { justifyContent: 'flex-end' },
  navBtnDisabled: { backgroundColor: '#f4f4f4' },
  navBtnText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  navBtnTextOff: { color: Palette.accent2 },
  navCenter: { alignItems: 'center', gap: 2 },
  navCounter: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  navSommaireLink: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
    textDecorationLine: 'underline',
  },
});
