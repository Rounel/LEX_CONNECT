import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

const SCREEN_W = Dimensions.get('window').width;
const H_PADDING = 16;

// ─── Types ───────────────────────────────────────────────────────────────────

type Concours = {
  id: string;
  titre: string;
  institution: string;
  dateEpreuve: Date;
  dateCloture: Date;
  lieu: string;
  niveau: string;
  color: string;
  postes: number;
};

type Formation = {
  id: string;
  titre: string;
  concours: string;
  chapitres: number;
  progression: number; // 0–100
  color: string;
};

type Exercice = {
  id: string;
  titre: string;
  concours: string;
  questions: number;
  difficulte: 'Facile' | 'Moyen' | 'Difficile';
  color: string;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const CONCOURS: Concours[] = [
  {
    id: 'c1',
    titre: 'Concours de la Magistrature',
    institution: "École Nationale de la Magistrature",
    dateEpreuve: new Date(2026, 2, 15),
    dateCloture: new Date(2026, 1, 28),
    lieu: 'Abidjan',
    niveau: 'Bac+5',
    color: '#162660',
    postes: 30,
  },
  {
    id: 'c2',
    titre: 'CAFOP — Instituteurs',
    institution: "Centre d'Animation et de Formation Pédagogique",
    dateEpreuve: new Date(2026, 2, 22),
    dateCloture: new Date(2026, 2, 7),
    lieu: 'Multi-sites',
    niveau: 'BEPC + CQP',
    color: '#2E7D32',
    postes: 1200,
  },
  {
    id: 'c3',
    titre: 'Concours ENA',
    institution: "École Nationale d'Administration",
    dateEpreuve: new Date(2026, 3, 20),
    dateCloture: new Date(2026, 3, 5),
    lieu: 'Abidjan',
    niveau: 'Bac+3 / Bac+5',
    color: '#6A1B9A',
    postes: 60,
  },
  {
    id: 'c4',
    titre: 'Concours des Greffiers',
    institution: 'Ministère de la Justice',
    dateEpreuve: new Date(2026, 4, 5),
    dateCloture: new Date(2026, 3, 20),
    lieu: 'Abidjan',
    niveau: 'Bac',
    color: '#BF360C',
    postes: 80,
  },
  {
    id: 'c5',
    titre: 'Concours Police Nationale',
    institution: 'Direction Générale de la Police',
    dateEpreuve: new Date(2026, 5, 10),
    dateCloture: new Date(2026, 4, 25),
    lieu: 'Multi-sites',
    niveau: 'BEPC / Bac',
    color: '#004D40',
    postes: 500,
  },
  {
    id: 'c6',
    titre: 'INPHB — Grandes Écoles',
    institution: 'Institut National Polytechnique Félix Houphouët-Boigny',
    dateEpreuve: new Date(2026, 6, 8),
    dateCloture: new Date(2026, 5, 20),
    lieu: 'Yamoussoukro',
    niveau: 'Bac',
    color: '#E65100',
    postes: 2000,
  },
];

const FORMATIONS: Formation[] = [
  {
    id: 'f1',
    titre: 'Droit constitutionnel — Bases',
    concours: 'Magistrature / ENA',
    chapitres: 12,
    progression: 65,
    color: '#162660',
  },
  {
    id: 'f2',
    titre: 'Culture générale ivoirienne',
    concours: 'Tous concours',
    chapitres: 8,
    progression: 30,
    color: '#F4A900',
  },
  {
    id: 'f3',
    titre: 'Procédure pénale',
    concours: 'Magistrature / Greffiers',
    chapitres: 10,
    progression: 0,
    color: '#BF360C',
  },
  {
    id: 'f4',
    titre: 'Droit administratif',
    concours: 'ENA / Magistrature',
    chapitres: 14,
    progression: 50,
    color: '#6A1B9A',
  },
  {
    id: 'f5',
    titre: 'Mathématiques INPHB',
    concours: 'INPHB',
    chapitres: 20,
    progression: 10,
    color: '#E65100',
  },
];

const EXERCICES: Exercice[] = [
  {
    id: 'e1',
    titre: 'QCM Droit constitutionnel',
    concours: 'Magistrature',
    questions: 30,
    difficulte: 'Moyen',
    color: '#162660',
  },
  {
    id: 'e2',
    titre: 'Dissertation juridique',
    concours: 'ENA',
    questions: 5,
    difficulte: 'Difficile',
    color: '#6A1B9A',
  },
  {
    id: 'e3',
    titre: 'Culture générale — Série A',
    concours: 'Tous concours',
    questions: 20,
    difficulte: 'Facile',
    color: '#F4A900',
  },
  {
    id: 'e4',
    titre: 'Logique & raisonnement',
    concours: 'Police / Greffiers',
    questions: 25,
    difficulte: 'Moyen',
    color: '#004D40',
  },
  {
    id: 'e5',
    titre: 'Mathématiques avancées',
    concours: 'INPHB',
    questions: 15,
    difficulte: 'Difficile',
    color: '#E65100',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

// Monday-first week start for a given date
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')} ${MONTH_NAMES_FR[date.getMonth()].substring(0, 3)}. ${date.getFullYear()}`;
}

function daysBetween(a: Date, b: Date) {
  return Math.ceil((b.getTime() - a.getTime()) / 86400000);
}

const DAY_ABBR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const DIFF_COLOR: Record<Exercice['difficulte'], { bg: string; text: string }> = {
  Facile: { bg: '#E8F5E9', text: '#2E7D32' },
  Moyen: { bg: '#FFF8E1', text: '#F57F17' },
  Difficile: { bg: '#FFEBEE', text: '#C62828' },
};

// ─── Calendar ────────────────────────────────────────────────────────────────

function Calendar({
  concours,
  selectedDate,
  onSelectDate,
}: {
  concours: Concours[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(selectedDate));

  // If selectedDate moves outside the displayed week, follow it
  useEffect(() => {
    const ws = getWeekStart(selectedDate);
    if (ws.getTime() !== weekStart.getTime()) {
      setWeekStart(ws);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
      }),
    [weekStart],
  );

  const prevWeek = () =>
    setWeekStart(ws => {
      const d = new Date(ws);
      d.setDate(d.getDate() - 7);
      return d;
    });

  const nextWeek = () =>
    setWeekStart(ws => {
      const d = new Date(ws);
      d.setDate(d.getDate() + 7);
      return d;
    });

  // Map "Y-M-D" → color for days with a concours
  const dotMap = useMemo(() => {
    const m = new Map<string, string>();
    concours.forEach(c => {
      const k = `${c.dateEpreuve.getFullYear()}-${c.dateEpreuve.getMonth()}-${c.dateEpreuve.getDate()}`;
      m.set(k, c.color);
    });
    return m;
  }, [concours]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Month label: show one or two months if the week spans a boundary
  const monthLabel = useMemo(() => {
    const first = weekDays[0];
    const last = weekDays[6];
    if (first.getMonth() === last.getMonth()) {
      return `${MONTH_NAMES_FR[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${MONTH_NAMES_FR[first.getMonth()].substring(0, 3)}. – ${MONTH_NAMES_FR[last.getMonth()].substring(0, 3)}. ${last.getFullYear()}`;
  }, [weekDays]);

  return (
    <View style={cal.wrapper}>
      {/* ─ Month navigation ─ */}
      <View style={cal.header}>
        <TouchableOpacity onPress={prevWeek} hitSlop={10}>
          <IconSymbol name="chevron.left" size={20} color={Palette.foreground} />
        </TouchableOpacity>
        <Text style={cal.monthLabel}>{monthLabel}</Text>
        <TouchableOpacity onPress={nextWeek} hitSlop={10}>
          <IconSymbol name="chevron.right" size={20} color={Palette.foreground} />
        </TouchableOpacity>
      </View>

      {/* ─ Week strip ─ */}
      <View style={cal.strip}>
        {weekDays.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
          const dotColor = dotMap.get(key);

          return (
            <TouchableOpacity
              key={i}
              style={cal.dayCol}
              onPress={() => onSelectDate(day)}
              activeOpacity={0.7}
            >
              {/* Number with circle */}
              <View style={[cal.numCircle, isSelected && cal.numCircleSelected]}>
                <Text
                  style={[
                    cal.numText,
                    isToday && !isSelected && { color: Palette.primary },
                    isSelected && cal.numTextSelected,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </View>

              {/* Day abbreviation */}
              <Text
                style={[
                  cal.abbr,
                  isSelected && { color: Palette.primary, fontFamily: Fonts.body.semiBold },
                ]}
              >
                {DAY_ABBR[day.getDay()].toUpperCase()}
              </Text>

              {/* Concours dot */}
              {dotColor && (
                <View
                  style={[
                    cal.dot,
                    { backgroundColor: isSelected ? Palette.primary : dotColor },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Event list (concours on selected day) ────────────────────────────────────

function DayEvents({ events }: { events: Concours[] }) {
  if (events.length === 0) {
    return (
      <View style={evt.empty}>
        <Text style={evt.emptyText}>Aucun concours ce jour</Text>
      </View>
    );
  }
  return (
    <View style={evt.card}>
      {events.map((c, i) => (
        <React.Fragment key={c.id}>
          <View style={evt.row}>
            <View style={[evt.indicator, { backgroundColor: c.color }]} />
            <View style={evt.rowContent}>
              <Text style={evt.rowTitle}>{c.titre}</Text>
              <Text style={evt.rowInst} numberOfLines={1}>{c.institution}</Text>
            </View>
            <Text style={evt.rowDate}>{formatDate(c.dateEpreuve)}</Text>
          </View>
          {i < events.length - 1 && <View style={evt.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
}

// ─── Concours card ────────────────────────────────────────────────────────────

function ConcoursCard({ item }: { item: Concours }) {
  const today = new Date();
  const daysLeft = daysBetween(today, item.dateCloture);
  const cloturePassee = daysLeft < 0;

  return (
    <View style={[card.wrapper, { borderLeftColor: item.color }]}>
      {/* Date badge */}
      <View style={[card.dateBadge, { backgroundColor: item.color }]}>
        <Text style={card.badgeDay}>{item.dateEpreuve.getDate()}</Text>
        <Text style={card.badgeMth}>
          {MONTH_NAMES_FR[item.dateEpreuve.getMonth()].substring(0, 3).toUpperCase()}
        </Text>
      </View>

      {/* Content */}
      <View style={card.content}>
        <Text style={card.titre} numberOfLines={2}>{item.titre}</Text>
        <Text style={card.institution} numberOfLines={1}>{item.institution}</Text>

        <View style={card.meta}>
          <View style={card.metaItem}>
            <IconSymbol name="mappin.fill" size={12} color="#999" />
            <Text style={card.metaText}>{item.lieu}</Text>
          </View>
          <View style={card.metaItem}>
            <IconSymbol name="person.fill" size={12} color="#999" />
            <Text style={card.metaText}>{item.niveau}</Text>
          </View>
          <View style={card.metaItem}>
            <IconSymbol name="person.2.fill" size={12} color="#999" />
            <Text style={card.metaText}>{item.postes} postes</Text>
          </View>
        </View>

        <View style={card.footer}>
          <View
            style={[
              card.clotureBadge,
              {
                backgroundColor: cloturePassee
                  ? '#FFEBEE'
                  : daysLeft <= 7
                  ? '#FFF8E1'
                  : '#E8F5E9',
              },
            ]}
          >
            <IconSymbol
              name="clock.fill"
              size={11}
              color={cloturePassee ? '#C62828' : daysLeft <= 7 ? '#F57F17' : '#2E7D32'}
            />
            <Text
              style={[
                card.clotureText,
                {
                  color: cloturePassee
                    ? '#C62828'
                    : daysLeft <= 7
                    ? '#F57F17'
                    : '#2E7D32',
                },
              ]}
            >
              {cloturePassee
                ? 'Clôturé'
                : daysLeft === 0
                ? "Clôture aujourd'hui"
                : `Clôture dans ${daysLeft}j`}
            </Text>
          </View>
          <Text style={card.epreuveDate}>Épreuve : {formatDate(item.dateEpreuve)}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Formation card ───────────────────────────────────────────────────────────

function FormationCard({ item }: { item: Formation }) {
  return (
    <View style={[fcard.wrapper, { borderTopColor: item.color }]}>
      <View style={[fcard.iconWrap, { backgroundColor: item.color + '22' }]}>
        <IconSymbol name="book.fill" size={24} color={item.color} />
      </View>
      <Text style={fcard.titre} numberOfLines={2}>{item.titre}</Text>
      <Text style={fcard.concours} numberOfLines={1}>{item.concours}</Text>
      <Text style={fcard.chapitres}>{item.chapitres} chapitres</Text>
      <View style={fcard.barBg}>
        <View
          style={[fcard.barFill, { width: `${item.progression}%` as any, backgroundColor: item.color }]}
        />
      </View>
      <View style={fcard.progressRow}>
        <Text style={fcard.progressPct}>{item.progression}%</Text>
        <TouchableOpacity style={[fcard.btn, { backgroundColor: item.color }]}>
          <Text style={fcard.btnText}>{item.progression > 0 ? 'Continuer' : 'Commencer'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Exercice card ────────────────────────────────────────────────────────────

function ExerciceCard({ item }: { item: Exercice }) {
  const diff = DIFF_COLOR[item.difficulte];
  return (
    <View style={[ecard.wrapper, { borderTopColor: item.color }]}>
      <View style={[ecard.iconWrap, { backgroundColor: item.color + '22' }]}>
        <IconSymbol name="pencil.fill" size={22} color={item.color} />
      </View>
      <Text style={ecard.titre} numberOfLines={2}>{item.titre}</Text>
      <Text style={ecard.concours} numberOfLines={1}>{item.concours}</Text>
      <View style={ecard.meta}>
        <Text style={ecard.questions}>{item.questions} questions</Text>
        <View style={[ecard.diffBadge, { backgroundColor: diff.bg }]}>
          <Text style={[ecard.diffText, { color: diff.text }]}>{item.difficulte}</Text>
        </View>
      </View>
      <TouchableOpacity style={[ecard.btn, { backgroundColor: item.color }]}>
        <IconSymbol name="play.fill" size={13} color="#fff" />
        <Text style={ecard.btnText}>Démarrer</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function ConcoursScreen() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const selectedDayConcours = useMemo(
    () => CONCOURS.filter(c => isSameDay(c.dateEpreuve, selectedDate)),
    [selectedDate],
  );

  const upcomingConcours = useMemo(
    () => [...CONCOURS].sort((a, b) => a.dateEpreuve.getTime() - b.dateEpreuve.getTime()),
    [],
  );

  const ListHeader = () => (
    <>
      {/* ── Calendar ── */}
      <View style={styles.sectionHeader}>
        <IconSymbol name="calendar" size={18} color={Palette.primary} />
        <Text style={styles.sectionTitle}>Calendrier des concours</Text>
      </View>

      <Calendar
        concours={CONCOURS}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Events on selected day */}
      <DayEvents events={selectedDayConcours} />

      {/* ── Formations ── */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <IconSymbol name="graduationcap.fill" size={18} color={Palette.primary} />
        <Text style={styles.sectionTitle}>Formations</Text>
      </View>
      <Text style={styles.sectionSub}>Préparez-vous avec nos cours thématiques</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
      >
        {FORMATIONS.map(f => (
          <FormationCard key={f.id} item={f} />
        ))}
      </ScrollView>

      {/* ── Exercices ── */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <IconSymbol name="pencil.fill" size={18} color={Palette.primary} />
        <Text style={styles.sectionTitle}>Exercices</Text>
      </View>
      <Text style={styles.sectionSub}>Entraînez-vous avec des annales et QCM</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
      >
        {EXERCICES.map(e => (
          <ExerciceCard key={e.id} item={e} />
        ))}
      </ScrollView>

      {/* ── Upcoming list header ── */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <IconSymbol name="trophy.fill" size={18} color={Palette.primary} />
        <Text style={styles.sectionTitle}>Prochains concours</Text>
      </View>
    </>
  );

  return (
    <FlatList
      data={upcomingConcours}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: H_PADDING }}>
          <ConcoursCard item={item} />
        </View>
      )}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: Palette.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: H_PADDING,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: Fonts.heading.bold,
    fontSize: 17,
    color: Palette.foreground,
  },
  sectionSub: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: '#666',
    paddingHorizontal: H_PADDING,
    marginBottom: 12,
  },
  hScroll: {
    paddingHorizontal: H_PADDING,
    gap: 12,
    paddingBottom: 4,
  },
});

// Calendar
const cal = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    marginHorizontal: H_PADDING,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  monthLabel: {
    fontFamily: Fonts.heading.bold,
    fontSize: 15,
    color: Palette.foreground,
  },
  strip: {
    flexDirection: 'row',
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  numCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numCircleSelected: {
    borderWidth: 1.5,
    borderColor: Palette.foreground,
  },
  numText: {
    fontFamily: Fonts.heading.bold,
    fontSize: 17,
    color: Palette.foreground,
  },
  numTextSelected: {
    color: Palette.foreground,
  },
  abbr: {
    fontFamily: Fonts.body.regular,
    fontSize: 10,
    color: '#aaa',
    letterSpacing: 0.3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
});

// Day events
const evt = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: H_PADDING,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Palette.foreground,
  },
  rowInst: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  rowDate: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: '#bbb',
    flexShrink: 0,
  },
  separator: {
    height: 1,
    marginHorizontal: 14,
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: '#e0e0e0',
  },
  empty: {
    backgroundColor: '#fff',
    marginHorizontal: H_PADDING,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  emptyText: {
    fontFamily: Fonts.body.regular,
    fontSize: 13,
    color: '#ccc',
  },
});

// Concours card
const card = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    gap: 12,
  },
  dateBadge: {
    width: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flexShrink: 0,
  },
  badgeDay: {
    fontFamily: Fonts.heading.bold,
    fontSize: 18,
    color: '#fff',
    lineHeight: 22,
  },
  badgeMth: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 10,
    color: '#ffffffcc',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titre: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 14,
    color: Palette.foreground,
    lineHeight: 19,
  },
  institution: {
    fontFamily: Fonts.body.regular,
    fontSize: 12,
    color: '#666',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 4,
  },
  clotureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  clotureText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 11,
  },
  epreuveDate: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: '#999',
  },
});

// Formation card
const fcard = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderTopWidth: 3,
    width: 180,
    padding: 12,
    gap: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  titre: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Palette.foreground,
    lineHeight: 18,
  },
  concours: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: '#888',
  },
  chapitres: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: '#aaa',
  },
  barBg: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginTop: 4,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressPct: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: '#666',
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  btnText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 11,
    color: '#fff',
  },
});

// Exercice card
const ecard = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderTopWidth: 3,
    width: 170,
    padding: 12,
    gap: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  titre: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 13,
    color: Palette.foreground,
    lineHeight: 18,
  },
  concours: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: '#888',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  questions: {
    fontFamily: Fonts.body.regular,
    fontSize: 11,
    color: '#aaa',
  },
  diffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
  },
  diffText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 10,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 4,
  },
  btnText: {
    fontFamily: Fonts.body.semiBold,
    fontSize: 12,
    color: '#fff',
  },
});
