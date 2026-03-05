import { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type Conversation = {
  id: string;
  question: string;
  date: string;
  messages: number;
  unread: boolean;
};

type SuggestedQuestion = {
  id: string;
  question: string;
  theme: string;
};

// ─── Données ──────────────────────────────────────────────────────────────────

const SUGGESTIONS: SuggestedQuestion[] = [
  {
    id: 'sq1',
    question: "Qu'est-ce que le contrat à durée indéterminée en CI ?",
    theme: 'Droit du travail',
  },
  {
    id: 'sq2',
    question: "Comment porter plainte pour vol en Côte d'Ivoire ?",
    theme: 'Procédure pénale',
  },
  {
    id: 'sq3',
    question: "Quels sont les droits du locataire ivoirien ?",
    theme: 'Droit civil',
  },
  {
    id: 'sq4',
    question: "Qu'est-ce que l'OHADA et comment s'applique-t-il en CI ?",
    theme: 'Droit commercial',
  },
  {
    id: 'sq5',
    question: "Quelle est la procédure de divorce en Côte d'Ivoire ?",
    theme: 'Droit de la famille',
  },
  {
    id: 'sq6',
    question: "Comment hériter d'un bien immobilier en CI ?",
    theme: 'Droit des successions',
  },
];

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    question: "Qu'est-ce que le contrat de travail à durée indéterminée ?",
    date: '05 mars 2026',
    messages: 4,
    unread: false,
  },
  {
    id: 'c2',
    question: "Mon propriétaire peut-il augmenter le loyer sans préavis ?",
    date: '02 mars 2026',
    messages: 8,
    unread: true,
  },
  {
    id: 'c3',
    question: "Quelle est la durée de prescription en droit pénal ivoirien ?",
    date: '28 fév. 2026',
    messages: 6,
    unread: false,
  },
  {
    id: 'c4',
    question: "Comment constituer une SARL en Côte d'Ivoire selon l'OHADA ?",
    date: '25 fév. 2026',
    messages: 12,
    unread: false,
  },
];

// ─── Composants ───────────────────────────────────────────────────────────────

/** Icône perruque de magistrat — rendu SVG simplifié via Text */
function WigIcon({ size = 24, color = Palette.primary }: { size?: number; color?: string }) {
  return (
    <View style={[wig.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <ThemedText style={[wig.text, { fontSize: size * 0.52, color }]}>⚖</ThemedText>
    </View>
  );
}

function SuggestionCard({ item, onPress }: { item: SuggestedQuestion; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.suggCard, pressed && styles.pressed]}>
      <View style={styles.suggContent}>
        <ThemedText style={styles.suggTheme}>{item.theme}</ThemedText>
        <ThemedText style={styles.suggQuestion} numberOfLines={3}>
          {item.question}
        </ThemedText>
      </View>
      <View style={styles.suggArrow}>
        <IconSymbol name="chevron.right" size={14} color={Palette.accent2} />
      </View>
    </Pressable>
  );
}

function ConversationCard({
  item,
  onPress,
}: {
  item: Conversation;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.convCard,
        item.unread && styles.convCardUnread,
        pressed && styles.pressed,
      ]}>
      {/* Avatar Alexia */}
      <View style={styles.convAvatar}>
        <WigIcon size={36} color={Palette.primary} />
      </View>

      {/* Contenu */}
      <View style={styles.convContent}>
        <ThemedText style={styles.convQuestion} numberOfLines={2}>
          {item.question}
        </ThemedText>
        <View style={styles.convMeta}>
          <ThemedText style={styles.convDate}>{item.date}</ThemedText>
          <ThemedText style={styles.convMessages}>· {item.messages} messages</ThemedText>
        </View>
      </View>

      {/* Indicateur non-lu */}
      {item.unread && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

// ─── Vue conversation (simulation) ───────────────────────────────────────────

type ChatMsg = { id: string; role: 'user' | 'alexia'; text: string };

const DEMO_MESSAGES: ChatMsg[] = [
  {
    id: 'm1',
    role: 'user',
    text: "Qu'est-ce que le contrat à durée indéterminée en Côte d'Ivoire ?",
  },
  {
    id: 'm2',
    role: 'alexia',
    text:
      "Le contrat à durée indéterminée (CDI) est défini par l'article 14 du Code du Travail ivoirien comme le contrat de droit commun en matière de travail salarié. Il ne comporte pas de terme préfixé et peut être rompu à l'initiative de l'une ou l'autre des parties, sous réserve du respect d'un préavis.\n\nSa durée n'est pas limitée dans le temps, ce qui confère une stabilité de l'emploi au salarié.",
  },
  {
    id: 'm3',
    role: 'user',
    text: 'Quelle est la durée maximale de la période d\'essai pour un cadre ?',
  },
  {
    id: 'm4',
    role: 'alexia',
    text:
      "Selon l'article 16.3 du Code du Travail de Côte d'Ivoire, la période d'essai pour les cadres et assimilés ne peut excéder 6 mois, renouvellement inclus. Elle peut être renouvelée une fois, mais la durée totale ne peut dépasser cette limite.",
  },
];

function ChatView({ onBack }: { onBack: () => void }) {
  const [messages] = useState<ChatMsg[]>(DEMO_MESSAGES);
  const [inputText, setInputText] = useState('');

  return (
    <View style={chat.container}>
      {/* Header */}
      <View style={chat.header}>
        <Pressable onPress={onBack} hitSlop={12} style={chat.backBtn}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
        </Pressable>
        <WigIcon size={28} color={Palette.primary} />
        <ThemedText style={chat.headerTitle} numberOfLines={1}>
          Contrat de travail CDI
        </ThemedText>
        <Pressable hitSlop={12}>
          <IconSymbol name="trash.fill" size={18} color={Palette.accent2} />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView
        style={chat.messages}
        contentContainerStyle={chat.messagesContent}
        showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              chat.msgRow,
              msg.role === 'user' ? chat.msgRowUser : chat.msgRowAlexia,
            ]}>
            {msg.role === 'alexia' && (
              <View style={chat.alexiaAvatarMini}>
                <WigIcon size={24} color={Palette.primary} />
              </View>
            )}
            <View
              style={[
                chat.bubble,
                msg.role === 'user' ? chat.bubbleUser : chat.bubbleAlexia,
              ]}>
              <ThemedText
                style={[
                  chat.bubbleText,
                  msg.role === 'user' && chat.bubbleTextUser,
                ]}>
                {msg.text}
              </ThemedText>
            </View>
          </View>
        ))}

        {/* Source citée dans le dernier message Alexia */}
        <View style={chat.citationCard}>
          <View style={chat.citationHeader}>
            <IconSymbol name="doc.text.fill" size={14} color={Palette.primary} />
            <ThemedText style={chat.citationTitle}>Code du Travail de CI</ThemedText>
          </View>
          <ThemedText style={chat.citationArticle}>Art. 16.3 — Période d'essai des cadres</ThemedText>
          <Pressable>
            <ThemedText style={chat.citationLink}>Consulter →</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      {/* Barre de saisie */}
      <View style={chat.inputBar}>
        <TextInput
          style={chat.input}
          placeholder="Posez votre question…"
          placeholderTextColor={Palette.accent2}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <Pressable
          style={[chat.sendBtn, !inputText.trim() && chat.sendBtnDisabled]}
          disabled={!inputText.trim()}>
          <IconSymbol
            name="arrow.up"
            size={18}
            color={inputText.trim() ? '#fff' : Palette.accent2}
          />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Écran principal Alexia ───────────────────────────────────────────────────

export default function AlexiaScreen() {
  const router = useRouter();
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [newConv, setNewConv] = useState(false);

  // Affiche la vue conversation si besoin
  if (activeConv || newConv) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ChatView onBack={() => { setActiveConv(null); setNewConv(false); }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Zone d'accueil ── */}
        <View style={styles.hero}>
          {/* Icône Alexia grande */}
          <View style={styles.heroIcon}>
            <ThemedText style={styles.heroEmoji}>⚖️</ThemedText>
          </View>
          <ThemedText type="title" style={styles.heroTitle}>
            Bonjour, je suis Alexia
          </ThemedText>
          <ThemedText style={styles.heroSubtitle}>
            Posez-moi vos questions sur le droit ivoirien —{' '}
            je cite toujours mes sources.
          </ThemedText>
        </View>

        {/* ── Questions fréquentes ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Questions fréquentes</ThemedText>
          </View>
          <View style={styles.suggGrid}>
            {SUGGESTIONS.map((s) => (
              <SuggestionCard
                key={s.id}
                item={s}
                onPress={() => setNewConv(true)}
              />
            ))}
          </View>
        </View>

        {/* ── Conversations récentes ── */}
        {CONVERSATIONS.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Conversations récentes</ThemedText>
              <Pressable hitSlop={8} onPress={() => router.push('/alexia/historique' as any)}>
                <ThemedText style={styles.seeAll}>Voir tout</ThemedText>
              </Pressable>
            </View>
            <View style={styles.convList}>
              {CONVERSATIONS.map((c) => (
                <ConversationCard
                  key={c.id}
                  item={c}
                  onPress={() => setActiveConv(c.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* ── Disclaimer ── */}
        <View style={styles.disclaimer}>
          <IconSymbol name="info.circle" size={14} color={Palette.accent2} />
          <ThemedText style={styles.disclaimerText}>
            Alexia est un assistant IA. Ses réponses ne remplacent pas l'avis d'un professionnel du droit.
          </ThemedText>
        </View>

      </ScrollView>

      {/* ── FAB Nouvelle conversation ── */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
        onPress={() => setNewConv(true)}>
        <IconSymbol name="plus" size={22} color="#fff" />
        <ThemedText style={styles.fabLabel}>Nouvelle conversation</ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Hero
  hero: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 36,
    paddingBottom: 32,
    gap: 12,
  },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroEmoji: {
    fontSize: 40,
  },
  heroTitle: {
    textAlign: 'center',
    color: Palette.foreground,
    fontSize: 22,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 22,
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

  // Grille questions suggérées (2 colonnes)
  suggGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  suggCard: {
    width: (SCREEN_W - 32 - 10) / 2,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Palette.accent2 + '25',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggContent: {
    flex: 1,
    gap: 5,
  },
  suggTheme: {
    fontSize: 10,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  suggQuestion: {
    fontSize: 12,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 17,
  },
  suggArrow: {
    marginTop: 2,
    flexShrink: 0,
  },

  // Conversations
  convList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Palette.accent2 + '20',
  },
  convCardUnread: {
    backgroundColor: Palette.primary + '06',
    borderColor: Palette.primary + '30',
  },
  convAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  convContent: {
    flex: 1,
    gap: 5,
  },
  convQuestion: {
    fontSize: 13,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    lineHeight: 18,
  },
  convMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  convDate: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  convMessages: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
    flexShrink: 0,
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 17,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Palette.primary,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 8,
  },
  fabLabel: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },

  pressed: {
    opacity: 0.72,
  },
});

// ─── Styles chat ──────────────────────────────────────────────────────────────

const chat = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF8F4',
    borderBottomWidth: 1,
    borderBottomColor: Palette.accent2 + '20',
    gap: 10,
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowAlexia: {
    justifyContent: 'flex-start',
  },
  alexiaAvatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    padding: 14,
  },
  bubbleUser: {
    backgroundColor: Palette.primary,
    borderBottomRightRadius: 6,
  },
  bubbleAlexia: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: Palette.accent2 + '25',
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 21,
  },
  bubbleTextUser: {
    color: '#fff',
  },

  // Citation card
  citationCard: {
    marginLeft: 36,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Palette.primary,
    padding: 12,
    gap: 6,
  },
  citationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  citationTitle: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  citationArticle: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  citationLink: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  // Barre saisie
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Palette.accent2 + '20',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#FAF8F4',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Palette.accent2 + '30',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: {
    backgroundColor: Palette.accent2 + '30',
  },
});

// Styles icône wig
const wig = StyleSheet.create({
  container: {
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
