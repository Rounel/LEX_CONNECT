import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Types & Data ─────────────────────────────────────────────────────────────

type Statut = 'En vigueur' | 'Abrogé' | 'Modifié';

type SuiviItem = {
  id: string;
  type: string;
  titre: string;
  domaine: string;
  domaineKey: string;
  statut: Statut;
  dateMaj: string;
  accentColor: string;
};

const STATUT_COLOR: Record<Statut, { bg: string; text: string }> = {
  'En vigueur': { bg: '#E6F6EE', text: '#1E7A47' },
  'Abrogé': { bg: '#FDEDEB', text: '#C0392B' },
  'Modifié': { bg: '#FEF4E8', text: '#D4821A' },
};

const SUIVIS: SuiviItem[] = [
  { id: 's1', type: 'Code', titre: 'Code Civil ivoirien', domaine: 'Droit civil', domaineKey: 'civil', statut: 'En vigueur', dateMaj: '15 janv. 2024', accentColor: '#162660' },
  { id: 's2', type: 'Loi', titre: 'Code du Travail', domaine: 'Droit social', domaineKey: 'social', statut: 'Modifié', dateMaj: '03 mars 2024', accentColor: '#2E7D32' },
  { id: 's3', type: 'Ordonnance', titre: 'Ordonnance relative aux sociétés commerciales', domaine: 'Droit commercial', domaineKey: 'commercial', statut: 'En vigueur', dateMaj: '10 déc. 2023', accentColor: '#E65100' },
  { id: 's4', type: 'Décret', titre: 'Décret n°2023-472 portant fiscalité des entreprises', domaine: 'Droit fiscal', domaineKey: 'commercial', statut: 'En vigueur', dateMaj: '22 nov. 2023', accentColor: '#BF360C' },
  { id: 's5', type: 'Code', titre: 'Code de Procédure Pénale', domaine: 'Droit pénal', domaineKey: 'penal', statut: 'En vigueur', dateMaj: '5 fév. 2024', accentColor: '#7C2D12' },
  { id: 's6', type: 'Loi', titre: 'Loi relative à la cybersécurité', domaine: 'Droit numérique', domaineKey: 'administratif', statut: 'Modifié', dateMaj: '20 fév. 2026', accentColor: '#1565C0' },
  { id: 's7', type: 'Loi', titre: "Loi n°2026-012 portant modification du Code de procédure civile", domaine: 'Droit civil', domaineKey: 'civil', statut: 'En vigueur', dateMaj: '18 fév. 2026', accentColor: '#162660' },
  { id: 's8', type: 'Décret', titre: "Décret portant organisation du Ministère de la Justice", domaine: 'Droit administratif', domaineKey: 'administratif', statut: 'En vigueur', dateMaj: '15 jan. 2026', accentColor: '#4527A0' },
];

const FILTRES = [
  { id: 'tous', label: 'Tous' },
  { id: 'civil', label: 'Civil' },
  { id: 'penal', label: 'Pénal' },
  { id: 'social', label: 'Social' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'administratif', label: 'Administratif' },
];

// ─── Components ───────────────────────────────────────────────────────────────

function SuiviCard({ item, onPress, onUnfollow }: { item: SuiviItem; onPress: () => void; onUnfollow: () => void }) {
  const statut = STATUT_COLOR[item.statut];
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}>
      <View style={[styles.cardAccent, { backgroundColor: item.accentColor }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <ThemedText style={[styles.cardType, { color: item.accentColor }]}>
              {item.type}
            </ThemedText>
            <View style={[styles.statutBadge, { backgroundColor: statut.bg }]}>
              <ThemedText style={[styles.statutText, { color: statut.text }]}>
                {item.statut}
              </ThemedText>
            </View>
          </View>
          <Pressable onPress={onUnfollow} hitSlop={8}>
            <IconSymbol name="heart.fill" size={17} color="#C0392B" />
          </Pressable>
        </View>
        <ThemedText style={styles.cardTitre} numberOfLines={2}>{item.titre}</ThemedText>
        <View style={styles.cardFooter}>
          <ThemedText style={styles.cardDomaine}>{item.domaine}</ThemedText>
          <ThemedText style={styles.cardDate}>Màj {item.dateMaj}</ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SuivisScreen() {
  const router = useRouter();
  const [filtre, setFiltre] = useState('tous');
  const [suivis, setSuivis] = useState(SUIVIS);

  const filtered = useMemo(() =>
    filtre === 'tous' ? suivis : suivis.filter(s => s.domaineKey === filtre),
    [filtre, suivis],
  );

  const unfollow = (id: string) => setSuivis(prev => prev.filter(s => s.id !== id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Mes textes suivis</ThemedText>
      </View>

      {/* ── Filtres ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtreRow}
        style={styles.filtreWrapper}>
        {FILTRES.map(f => (
          <Pressable
            key={f.id}
            style={[styles.chip, filtre === f.id && styles.chipActive]}
            onPress={() => setFiltre(f.id)}>
            <ThemedText style={[styles.chipText, filtre === f.id && styles.chipTextActive]}>
              {f.label}
            </ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Liste ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <SuiviCard
              item={item}
              onPress={() => router.push(`/document/${item.id}` as any)}
              onUnfollow={() => unfollow(item.id)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconSymbol name="building.columns.fill" size={48} color={Palette.accent2} />
            <ThemedText style={styles.emptyTitle}>Aucun texte suivi</ThemedText>
            <ThemedText style={styles.emptyDesc}>
              Suivez des textes juridiques pour être notifié de leurs mises à jour.
            </ThemedText>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.replace('/(tabs)/bibliotheque' as any)}>
              <ThemedText style={styles.emptyBtnText}>Explorer la bibliothèque</ThemedText>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.background },

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

  filtreWrapper: { backgroundColor: Palette.background },
  filtreRow: {
    paddingHorizontal: 16,
    paddingBottom: 14,
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

  listContent: { paddingBottom: 40 },
  cardWrapper: { paddingHorizontal: 16, marginBottom: 10 },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  cardAccent: { width: 4 },
  cardBody: { flex: 1, padding: 14, gap: 7 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTopLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardType: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statutBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statutText: { fontSize: 10, fontFamily: Fonts.body.semiBold },
  cardTitre: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDomaine: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  cardDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  empty: {
    paddingTop: 64,
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 21,
  },
  emptyBtn: {
    marginTop: 8,
    backgroundColor: Palette.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },

  pressed: { opacity: 0.72 },
});
