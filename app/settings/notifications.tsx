import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Data ─────────────────────────────────────────────────────────────────────

type Toggle = {
  id: string;
  label: string;
  value: boolean;
};

type Section = {
  title: string;
  items: Toggle[];
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsNotificationsScreen() {
  const router = useRouter();

  const [sections, setSections] = useState<Section[]>([
    {
      title: 'BIBLIOTHÈQUE',
      items: [
        { id: 'biblio_modif', label: 'Modifications de textes suivis', value: true },
        { id: 'biblio_new', label: 'Nouveaux textes ajoutés', value: true },
      ],
    },
    {
      title: 'ACTUALITÉS',
      items: [
        { id: 'actu_new', label: 'Nouvelles publications', value: true },
        { id: 'actu_suivi', label: 'Actualités liées à mes textes', value: true },
      ],
    },
    {
      title: 'CONCOURS',
      items: [
        { id: 'concours_open', label: "Ouverture d'inscriptions", value: true },
        { id: 'concours_rappel', label: 'Rappels dates limites', value: true },
        { id: 'concours_result', label: 'Résultats publiés', value: false },
      ],
    },
    {
      title: 'ALEXIA',
      items: [
        { id: 'alexia_recap', label: 'Résumé hebdomadaire', value: false },
      ],
    },
  ]);

  const toggle = (sectionTitle: string, itemId: string) => {
    setSections(prev =>
      prev.map(s => s.title === sectionTitle
        ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, value: !i.value } : i) }
        : s,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <View key={item.id}>
                  <View style={styles.row}>
                    <ThemedText style={styles.rowLabel}>{item.label}</ThemedText>
                    <Switch
                      value={item.value}
                      onValueChange={() => toggle(section.title, item.id)}
                      trackColor={{ false: '#ddd', true: Palette.primary + '80' }}
                      thumbColor={item.value ? Palette.primary : '#fff'}
                    />
                  </View>
                  {i < section.items.length - 1 && <View style={styles.sep} />}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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

  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
    gap: 0,
  },

  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 20,
  },

  sep: {
    height: 1,
    backgroundColor: Palette.background,
    marginLeft: 16,
  },
});
