import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Mock data ────────────────────────────────────────────────────────────────

type Conv = {
  id: string;
  titre: string;
  preview: string;
  date: string;
  messages: number;
  unread: boolean;
};

const CONVERSATIONS: Conv[] = [
  { id: 'c1', titre: 'Contrat de travail en Côte d\'Ivoire', preview: "Qu'est-ce que le CDI selon le Code du Travail ivoirien ?", date: '05 mars 2026', messages: 4, unread: false },
  { id: 'c2', titre: "Droits du locataire", preview: "Mon propriétaire peut-il augmenter le loyer sans préavis ?", date: '02 mars 2026', messages: 8, unread: true },
  { id: 'c3', titre: "Procédure de divorce", preview: "Quelles sont les étapes d'un divorce par consentement mutuel ?", date: '28 fév. 2026', messages: 12, unread: false },
  { id: 'c4', titre: "Droit des successions OHADA", preview: "Comment fonctionne la dévolution successorale selon l'OHADA ?", date: '25 fév. 2026', messages: 6, unread: false },
  { id: 'c5', titre: "Création d'entreprise en CI", preview: "Quelles sont les étapes pour créer une SARL en Côte d'Ivoire ?", date: '20 fév. 2026', messages: 10, unread: true },
  { id: 'c6', titre: "Protection des données personnelles", preview: "Quelles sont les obligations de l'ANRDP pour les entreprises ?", date: '15 fév. 2026', messages: 3, unread: false },
];

// ─── Components ───────────────────────────────────────────────────────────────

function WigAvatar() {
  return (
    <View style={styles.wig}>
      <ThemedText style={styles.wigEmoji}>⚖</ThemedText>
    </View>
  );
}

function ConvCard({ item, onPress, onDelete }: { item: Conv; onPress: () => void; onDelete: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, item.unread && styles.cardUnread, pressed && styles.pressed]}
      onPress={onPress}>
      <WigAvatar />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <ThemedText style={styles.cardTitre} numberOfLines={1}>{item.titre}</ThemedText>
          <ThemedText style={styles.cardDate}>{item.date}</ThemedText>
        </View>
        <ThemedText style={styles.cardPreview} numberOfLines={1}>{item.preview}</ThemedText>
        <View style={styles.cardMeta}>
          <ThemedText style={styles.cardMsgCount}>{item.messages} messages</ThemedText>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </View>
      <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
        <IconSymbol name="trash" size={16} color="#C0392B" />
      </Pressable>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HistoriqueAlexiaScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [convs, setConvs] = useState(CONVERSATIONS);

  const filtered = search.trim()
    ? convs.filter(c =>
        c.titre.toLowerCase().includes(search.toLowerCase()) ||
        c.preview.toLowerCase().includes(search.toLowerCase()),
      )
    : convs;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Mes conversations</ThemedText>
      </View>

      {/* ── Recherche ── */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={16} color={Palette.accent2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une conversation…"
            placeholderTextColor={Palette.accent2}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <IconSymbol name="xmark" size={14} color={Palette.accent2} />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Liste ── */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ConvCard
              item={item}
              onPress={() => router.back()}
              onDelete={() => setConvs(prev => prev.filter(c => c.id !== item.id))}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={styles.emptyText}>Aucune conversation trouvée</ThemedText>
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
    paddingBottom: 6,
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

  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    padding: 0,
  },

  listContent: { paddingBottom: 40 },
  cardWrapper: { paddingHorizontal: 16, marginBottom: 10 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cardUnread: {
    backgroundColor: Palette.accent1,
  },

  wig: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F0E8',
    borderWidth: 1,
    borderColor: '#E0D8CC',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  wigEmoji: { fontSize: 22 },

  cardBody: { flex: 1, gap: 4 },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardTitre: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  cardDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    flexShrink: 0,
  },
  cardPreview: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardMsgCount: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
  },

  deleteBtn: { padding: 4 },

  empty: { paddingTop: 48, alignItems: 'center' },
  emptyText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  pressed: { opacity: 0.72 },
});
