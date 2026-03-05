import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Mock data ────────────────────────────────────────────────────────────────

type Epreuve = {
  id: string;
  titre: string;
  matiere: string;
  concours: string;
};

type Section = {
  title: string;
  data: Epreuve[];
};

const SECTIONS: Section[] = [
  {
    title: '2026',
    data: [
      { id: 'e1', titre: 'Épreuve de Droit civil', matiere: 'Droit civil', concours: 'INFJ' },
      { id: 'e2', titre: 'Épreuve de Droit pénal', matiere: 'Droit pénal', concours: 'INFJ' },
      { id: 'e3', titre: 'Épreuve de Procédure civile', matiere: 'Procédure civile', concours: 'INFJ' },
      { id: 'e4', titre: 'Composition de Culture juridique', matiere: 'Culture générale juridique', concours: 'INFJ' },
    ],
  },
  {
    title: '2025',
    data: [
      { id: 'e5', titre: 'Épreuve de Droit civil', matiere: 'Droit civil', concours: 'INFJ' },
      { id: 'e6', titre: 'Épreuve de OHADA', matiere: 'Droit commercial OHADA', concours: 'INFJ' },
      { id: 'e7', titre: 'Épreuve de Droit pénal', matiere: 'Droit pénal', concours: 'INFJ' },
      { id: 'e8', titre: 'Dissertation juridique', matiere: 'Droit constitutionnel', concours: 'INFJ' },
    ],
  },
  {
    title: '2024',
    data: [
      { id: 'e9', titre: 'Épreuve de Droit civil', matiere: 'Droit civil', concours: 'INFJ' },
      { id: 'e10', titre: 'Cas pratique — Contrat de travail', matiere: 'Droit social', concours: 'INFJ' },
      { id: 'e11', titre: 'Épreuve de Droit pénal général', matiere: 'Droit pénal', concours: 'INFJ' },
    ],
  },
  {
    title: '2023',
    data: [
      { id: 'e12', titre: 'Épreuve de Droit civil', matiere: 'Droit civil', concours: 'INFJ' },
      { id: 'e13', titre: 'Composition de Procédure pénale', matiere: 'Procédure pénale', concours: 'INFJ' },
    ],
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AnnalesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Annales · Magistrature</ThemedText>
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionYear}>{section.title}</ThemedText>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <View style={[
            styles.itemWrapper,
            index === section.data.length - 1 && styles.itemWrapperLast,
          ]}>
            <View style={styles.item}>
              <View style={styles.itemLeft}>
                <View style={styles.iconWrap}>
                  <IconSymbol name="doc.text.fill" size={16} color={Palette.primary} />
                </View>
                <View style={styles.itemTexts}>
                  <ThemedText style={styles.itemTitre}>{item.titre}</ThemedText>
                  <ThemedText style={styles.itemMeta}>
                    {item.matiere} · {item.concours} · {
                      SECTIONS.find(s => s.data.includes(item))?.title
                    }
                  </ThemedText>
                </View>
              </View>
              <Pressable style={styles.openBtn}>
                <ThemedText style={styles.openBtnText}>Ouvrir</ThemedText>
              </Pressable>
            </View>
            {index < section.data.length - 1 && <View style={styles.separator} />}
          </View>
        )}
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
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },

  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionYear: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },

  itemWrapper: {
    backgroundColor: '#fff',
    borderRadius: 0,
    overflow: 'hidden',
  },
  itemWrapperLast: {
    marginBottom: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  itemTexts: { flex: 1, gap: 3 },
  itemTitre: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
    lineHeight: 19,
  },
  itemMeta: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  openBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    flexShrink: 0,
  },
  openBtnText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  separator: {
    height: 1,
    backgroundColor: Palette.background,
    marginHorizontal: 14,
  },
});
