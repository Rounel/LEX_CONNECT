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

type ModuleKey = 'bibliotheque' | 'actualites' | 'concours';

type Notif = {
  id: string;
  module: ModuleKey;
  titre: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  iconColor: string;
  iconBg: string;
};

const NOTIFS: Notif[] = [
  { id: 'n1', module: 'bibliotheque', titre: 'Texte modifié', description: 'Le Code du Travail a été modifié. Voir les nouvelles dispositions.', time: 'Il y a 2 heures', read: false, icon: 'building.columns.fill', iconColor: '#162660', iconBg: '#E3F2FD' },
  { id: 'n2', module: 'actualites', titre: 'Nouvelle actualité', description: '"Réforme du code de commerce ivoirien : les points clés"', time: 'Hier à 09:15', read: true, icon: 'newspaper.fill', iconColor: '#6D28D9', iconBg: '#EDE9FE' },
  { id: 'n3', module: 'concours', titre: 'Concours ouvert', description: 'Les inscriptions pour le concours ENA 2026 sont ouvertes jusqu\'au 5 avril.', time: 'Il y a 2 jours', read: true, icon: 'trophy.fill', iconColor: '#2E7D32', iconBg: '#E8F5E9' },
  { id: 'n4', module: 'bibliotheque', titre: 'Nouveau texte ajouté', description: 'Décret n°2026-089 portant organisation des concours de la fonction publique.', time: 'Il y a 3 jours', read: true, icon: 'building.columns.fill', iconColor: '#162660', iconBg: '#E3F2FD' },
  { id: 'n5', module: 'concours', titre: 'Rappel clôture', description: 'La clôture des inscriptions au concours de la Magistrature est dans 3 jours.', time: 'Il y a 4 jours', read: false, icon: 'clock.fill', iconColor: '#BF360C', iconBg: '#FBE9E7' },
  { id: 'n6', module: 'actualites', titre: 'Texte suivi modifié', description: 'Une actualité liée à votre Code Civil a été publiée.', time: 'Il y a 5 jours', read: true, icon: 'newspaper.fill', iconColor: '#6D28D9', iconBg: '#EDE9FE' },
];

const FILTRES = [
  { id: 'tous', label: 'Tous' },
  { id: 'bibliotheque', label: 'Bibliothèque' },
  { id: 'actualites', label: 'Actualités' },
  { id: 'concours', label: 'Concours' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const router = useRouter();
  const [filtre, setFiltre] = useState('tous');
  const [notifs, setNotifs] = useState(NOTIFS);

  const filtered = useMemo(() =>
    filtre === 'tous' ? notifs : notifs.filter(n => n.module === filtre),
    [filtre, notifs],
  );

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <ThemedText style={styles.unreadBadgeText}>{unreadCount}</ThemedText>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} hitSlop={8}>
            <ThemedText style={styles.markAllText}>✓ Tout lire</ThemedText>
          </Pressable>
        )}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.notifCard, !item.read && styles.notifCardUnread]}
            onPress={() => markRead(item.id)}>
            <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
              <IconSymbol name={item.icon} size={18} color={item.iconColor} />
            </View>
            <View style={styles.notifBody}>
              <View style={styles.notifTop}>
                <ThemedText style={styles.notifTitre}>{item.titre}</ThemedText>
                {!item.read && <View style={styles.dot} />}
              </View>
              <ThemedText style={styles.notifDesc} numberOfLines={2}>{item.description}</ThemedText>
              <ThemedText style={styles.notifTime}>{item.time}</ThemedText>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconSymbol name="bell.slash.fill" size={40} color={Palette.accent2} />
            <ThemedText style={styles.emptyText}>Aucune notification</ThemedText>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  unreadBadge: {
    backgroundColor: Palette.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontFamily: Fonts.body.bold,
    color: '#fff',
  },
  markAllText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  filtreWrapper: { backgroundColor: Palette.background },
  filtreRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  chipText: { fontSize: 13, fontFamily: Fonts.body.semiBold, color: Palette.foreground },
  chipTextActive: { color: '#fff' },

  listContent: { paddingHorizontal: 16, paddingBottom: 48 },

  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  notifCardUnread: {
    backgroundColor: Palette.accent1,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifBody: { flex: 1, gap: 4 },
  notifTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifTitre: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
    flexShrink: 0,
  },
  notifDesc: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  sep: { height: 8 },

  empty: { paddingTop: 48, alignItems: 'center', gap: 12 },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
});
