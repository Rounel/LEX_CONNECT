import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type Favori = {
  id: string;
  type: 'document' | 'actualite' | 'concours';
  titre: string;
  sousTitre: string;
  date: string;
  accentColor: string;
};

// ─── Données ──────────────────────────────────────────────────────────────────

const FAVORIS: Favori[] = [
  {
    id: 'fav1',
    type: 'document',
    titre: 'Code Civil ivoirien',
    sousTitre: 'Code · Droit civil · Côte d\'Ivoire',
    date: '05 mars 2026',
    accentColor: '#162660',
  },
  {
    id: 'fav2',
    type: 'actualite',
    titre: 'Promulgation de la loi n° 2026-012 portant modification du Code du travail',
    sousTitre: 'Actualité · Présidence de la République',
    date: '18 fév. 2026',
    accentColor: '#92400E',
  },
  {
    id: 'fav3',
    type: 'document',
    titre: 'Actes uniformes OHADA',
    sousTitre: 'Code · Droit commercial · OHADA',
    date: '12 fév. 2026',
    accentColor: '#4A148C',
  },
  {
    id: 'fav4',
    type: 'concours',
    titre: 'Concours de la Magistrature',
    sousTitre: 'Concours · École Nationale de la Magistrature',
    date: '10 fév. 2026',
    accentColor: '#162660',
  },
  {
    id: 'fav5',
    type: 'actualite',
    titre: 'Règlement UEMOA harmonisant le cadre juridique du commerce électronique',
    sousTitre: 'Actualité · UEMOA',
    date: '8 fév. 2026',
    accentColor: '#065F46',
  },
  {
    id: 'fav6',
    type: 'document',
    titre: 'Code du Travail de Côte d\'Ivoire',
    sousTitre: 'Code · Droit social · Côte d\'Ivoire',
    date: '5 fév. 2026',
    accentColor: '#2E7D32',
  },
];

const TYPE_ICON: Record<Favori['type'], React.ComponentProps<typeof IconSymbol>['name']> = {
  document: 'doc.text.fill',
  actualite: 'newspaper.fill',
  concours: 'trophy.fill',
};

const FILTRES = ['Tous', 'Documents', 'Actualités', 'Concours'] as const;
type Filtre = (typeof FILTRES)[number];

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
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}>
      <ThemedText style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function FavoriCard({
  item,
  onPress,
  onRemove,
}: {
  item: Favori;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}>
      <View style={[styles.cardAccent, { backgroundColor: item.accentColor }]} />
      <View style={styles.cardIcon}>
        <IconSymbol name={TYPE_ICON[item.type]} size={18} color={item.accentColor} />
      </View>
      <View style={styles.cardBody}>
        <ThemedText style={styles.cardTitre} numberOfLines={2}>
          {item.titre}
        </ThemedText>
        <ThemedText style={styles.cardSousTitre} numberOfLines={1}>
          {item.sousTitre}
        </ThemedText>
        <ThemedText style={styles.cardDate}>{item.date}</ThemedText>
      </View>
      <Pressable onPress={onRemove} hitSlop={10} style={styles.removeBtn}>
        <IconSymbol name="bookmark.fill" size={18} color={Palette.primary} />
      </Pressable>
    </Pressable>
  );
}

// ─── Écran ────────────────────────────────────────────────────────────────────

export default function FavoritesScreen() {
  const router = useRouter();
  const [filtre, setFiltre] = useState<Filtre>('Tous');
  const [favoris, setFavoris] = useState<Favori[]>(FAVORIS);

  const filtered = favoris.filter(f => {
    if (filtre === 'Tous') return true;
    if (filtre === 'Documents') return f.type === 'document';
    if (filtre === 'Actualités') return f.type === 'actualite';
    if (filtre === 'Concours') return f.type === 'concours';
    return true;
  });

  const remove = (id: string) => setFavoris(prev => prev.filter(f => f.id !== id));

  const navigate = (item: Favori) => {
    if (item.type === 'document') router.push(`/document/${item.id}` as any);
    else if (item.type === 'actualite') router.push(`/actualite/${item.id}` as any);
    else if (item.type === 'concours') router.push(`/concours/${item.id}` as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Filtres */}
      <View style={styles.filtresRow}>
        {FILTRES.map(f => (
          <FiltreChip key={f} label={f} active={filtre === f} onPress={() => setFiltre(f)} />
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FavoriCard
            item={item}
            onPress={() => navigate(item)}
            onRemove={() => remove(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconSymbol name="bookmark" size={44} color={Palette.accent2 + '60'} />
            <ThemedText style={styles.emptyTitle}>Aucun favori</ThemedText>
            <ThemedText style={styles.emptyText}>
              Marquez des documents, actualités ou concours avec{' '}
              <IconSymbol name="bookmark.fill" size={13} color={Palette.accent2} /> pour les
              retrouver ici.
            </ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.background },

  filtresRow: {
    flexDirection: 'row',
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
  chipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  chipTextActive: { color: '#fff' },

  list: { paddingHorizontal: 16, paddingBottom: 48 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  pressed: { opacity: 0.85 },
  cardAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  cardIcon: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 8,
    gap: 3,
  },
  cardTitre: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 20,
  },
  cardSousTitre: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  cardDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  removeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  sep: { height: 8 },

  empty: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 22,
  },
});
