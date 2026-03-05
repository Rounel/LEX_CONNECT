import { useState } from 'react';
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

// ─── Types ────────────────────────────────────────────────────────────────────

type Fiche = {
  id: string;
  titre: string;
  domaine: string;
  chapitres: number;
  progression: number;
  color: string;
  icon: React.ComponentProps<typeof IconSymbol>['name'];
};

type Session = {
  id: string;
  date: string;
  duree: string;
  sujet: string;
  score?: number;
};

// ─── Données ──────────────────────────────────────────────────────────────────

const FICHES: Fiche[] = [
  {
    id: 'f1',
    titre: 'Droit constitutionnel',
    domaine: 'Magistrature / ENA',
    chapitres: 12,
    progression: 65,
    color: '#162660',
    icon: 'building.columns.fill',
  },
  {
    id: 'f2',
    titre: 'Droit du travail',
    domaine: 'Tous concours',
    chapitres: 9,
    progression: 40,
    color: '#2E7D32',
    icon: 'person.2.fill',
  },
  {
    id: 'f3',
    titre: 'Procédure pénale',
    domaine: 'Magistrature / Greffiers',
    chapitres: 10,
    progression: 0,
    color: '#BF360C',
    icon: 'hammer.fill',
  },
  {
    id: 'f4',
    titre: 'Droit administratif',
    domaine: 'ENA / Magistrature',
    chapitres: 14,
    progression: 50,
    color: '#6A1B9A',
    icon: 'doc.text.fill',
  },
  {
    id: 'f5',
    titre: 'Culture générale ivoirienne',
    domaine: 'Tous concours',
    chapitres: 8,
    progression: 30,
    color: '#F4A900',
    icon: 'globe.americas.fill',
  },
  {
    id: 'f6',
    titre: 'Droit OHADA',
    domaine: 'Greffiers / ENA',
    chapitres: 11,
    progression: 10,
    color: '#4A148C',
    icon: 'doc.badge.plus',
  },
];

const SESSIONS: Session[] = [
  { id: 's1', date: '05 mars', duree: '45 min', sujet: 'Droit constitutionnel', score: 82 },
  { id: 's2', date: '03 mars', duree: '30 min', sujet: 'Procédure pénale' },
  { id: 's3', date: '01 mars', duree: '1h10', sujet: 'Culture générale ivoirienne', score: 74 },
  { id: 's4', date: '27 fév.', duree: '25 min', sujet: 'Droit du travail', score: 91 },
  { id: 's5', date: '24 fév.', duree: '50 min', sujet: 'Droit administratif' },
];

const PROGRAMME = [
  { jour: 'LUN', sujet: 'Droit constitutionnel', fait: true },
  { jour: 'MAR', sujet: 'Culture générale', fait: true },
  { jour: 'MER', sujet: 'Procédure pénale', fait: false, auj: true },
  { jour: 'JEU', sujet: 'Droit du travail', fait: false },
  { jour: 'VEN', sujet: 'Révision générale', fait: false },
  { jour: 'SAM', sujet: 'QCM entraînement', fait: false },
  { jour: 'DIM', sujet: 'Repos', fait: false },
];

// ─── Composants ───────────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

function FicheCard({ item, onPress }: { item: Fiche; onPress: () => void }) {
  const pct = item.progression;
  return (
    <Pressable
      style={({ pressed }) => [styles.ficheCard, pressed && styles.pressed]}
      onPress={onPress}>
      <View style={[styles.ficheIcon, { backgroundColor: item.color + '20' }]}>
        <IconSymbol name={item.icon} size={22} color={item.color} />
      </View>
      <ThemedText style={styles.ficheTitre} numberOfLines={2}>
        {item.titre}
      </ThemedText>
      <ThemedText style={styles.ficheDomaine} numberOfLines={1}>
        {item.domaine}
      </ThemedText>
      <ThemedText style={styles.ficheChapitres}>{item.chapitres} chapitres</ThemedText>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: item.color }]} />
      </View>
      <View style={styles.ficheFooter}>
        <ThemedText style={[styles.fichePct, { color: item.color }]}>{pct}%</ThemedText>
        <Pressable style={[styles.ficheBtn, { backgroundColor: item.color }]} onPress={onPress}>
          <ThemedText style={styles.ficheBtnText}>
            {pct === 0 ? 'Commencer' : 'Continuer'}
          </ThemedText>
        </Pressable>
      </View>
    </Pressable>
  );
}

function SessionRow({ item }: { item: Session }) {
  return (
    <View style={styles.sessionRow}>
      <View style={styles.sessionLeft}>
        <ThemedText style={styles.sessionDate}>{item.date}</ThemedText>
        <ThemedText style={styles.sessionDuree}>{item.duree}</ThemedText>
      </View>
      <View style={styles.sessionMiddle}>
        <ThemedText style={styles.sessionSujet} numberOfLines={1}>
          {item.sujet}
        </ThemedText>
      </View>
      {item.score !== undefined && (
        <View
          style={[
            styles.scoreBadge,
            { backgroundColor: item.score >= 80 ? '#E8F5E9' : item.score >= 60 ? '#FFF8E1' : '#FFEBEE' },
          ]}>
          <ThemedText
            style={[
              styles.scoreText,
              { color: item.score >= 80 ? '#2E7D32' : item.score >= 60 ? '#F57F17' : '#C62828' },
            ]}>
            {item.score}%
          </ThemedText>
        </View>
      )}
    </View>
  );
}

// ─── Écran ────────────────────────────────────────────────────────────────────

export default function PreparationScreen() {
  const router = useRouter();
  const [onglet, setOnglet] = useState<'fiches' | 'programme' | 'historique'>('fiches');

  const totalProg = Math.round(
    FICHES.reduce((acc, f) => acc + f.progression, 0) / FICHES.length,
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── Stats globales ── */}
        <View style={styles.statsRow}>
          <StatCard label="Progression" value={`${totalProg}%`} color={Palette.primary} />
          <StatCard label="Sessions" value="14" color="#2E7D32" />
          <StatCard label="Quiz faits" value="58" color="#F4A900" />
        </View>

        {/* ── Onglets ── */}
        <View style={styles.tabs}>
          {(['fiches', 'programme', 'historique'] as const).map(t => (
            <Pressable
              key={t}
              style={[styles.tab, onglet === t && styles.tabActive]}
              onPress={() => setOnglet(t)}>
              <ThemedText style={[styles.tabText, onglet === t && styles.tabTextActive]}>
                {t === 'fiches' ? 'Fiches' : t === 'programme' ? 'Programme' : 'Historique'}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* ── Contenu ── */}
        {onglet === 'fiches' && (
          <View>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Mes fiches de révision</ThemedText>
              <Pressable
                hitSlop={8}
                onPress={() => router.push('/concours/quiz' as any)}>
                <ThemedText style={styles.seeAll}>Faire un quiz</ThemedText>
              </Pressable>
            </View>
            <FlatList
              data={FICHES}
              keyExtractor={f => f.id}
              renderItem={({ item }) => (
                <FicheCard
                  item={item}
                  onPress={() => router.push('/concours/quiz' as any)}
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.ficheRow}
              scrollEnabled={false}
            />
          </View>
        )}

        {onglet === 'programme' && (
          <View>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Programme de la semaine</ThemedText>
            </View>
            <View style={styles.programmeCard}>
              {PROGRAMME.map((p, i) => (
                <View key={p.jour}>
                  <View style={[styles.programmeRow, p.auj && styles.programmeRowAuj]}>
                    <View style={[styles.jourBadge, p.auj && { backgroundColor: Palette.primary }]}>
                      <ThemedText style={[styles.jourText, p.auj && { color: '#fff' }]}>
                        {p.jour}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={[
                        styles.programmeSujet,
                        p.fait && styles.programmeSujetFait,
                        p.auj && styles.programmeSujetAuj,
                      ]}>
                      {p.sujet}
                    </ThemedText>
                    {p.fait ? (
                      <IconSymbol name="checkmark.circle.fill" size={20} color="#2E7D32" />
                    ) : p.auj ? (
                      <Pressable
                        style={styles.commencerBtn}
                        onPress={() => router.push('/concours/quiz' as any)}>
                        <ThemedText style={styles.commencerBtnText}>Commencer</ThemedText>
                      </Pressable>
                    ) : (
                      <View style={styles.circleEmpty} />
                    )}
                  </View>
                  {i < PROGRAMME.length - 1 && <View style={styles.programmeSep} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {onglet === 'historique' && (
          <View>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Sessions récentes</ThemedText>
            </View>
            <View style={styles.sessionCard}>
              {SESSIONS.map((s, i) => (
                <View key={s.id}>
                  <SessionRow item={s} />
                  {i < SESSIONS.length - 1 && <View style={styles.sessionSep} />}
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.background },
  content: { paddingBottom: 48, paddingTop: 8 },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    marginTop: 2,
    textAlign: 'center',
  },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  tabActive: { backgroundColor: Palette.primary },
  tabText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
  },
  tabTextActive: { color: '#fff' },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  ficheRow: { paddingHorizontal: 16, gap: 10, marginBottom: 10 },
  ficheCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  pressed: { opacity: 0.85 },
  ficheIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ficheTitre: {
    fontSize: 13,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    marginBottom: 3,
  },
  ficheDomaine: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    marginBottom: 4,
  },
  ficheChapitres: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    marginBottom: 8,
  },
  barBg: {
    height: 5,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginBottom: 8,
  },
  barFill: {
    height: 5,
    borderRadius: 3,
  },
  ficheFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fichePct: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
  },
  ficheBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ficheBtnText: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },

  programmeCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  programmeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  programmeRowAuj: { backgroundColor: Palette.accent1 },
  jourBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jourText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  programmeSujet: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  programmeSujetFait: {
    textDecorationLine: 'line-through',
    color: Palette.accent2,
  },
  programmeSujetAuj: {
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  circleEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '60',
  },
  commencerBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  commencerBtnText: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },
  programmeSep: {
    height: 1,
    backgroundColor: Palette.background,
    marginLeft: 68,
  },

  sessionCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  sessionLeft: { width: 70, gap: 2 },
  sessionDate: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  sessionDuree: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  sessionMiddle: { flex: 1 },
  sessionSujet: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
  },
  sessionSep: {
    height: 1,
    backgroundColor: Palette.background,
    marginLeft: 16,
  },
});
