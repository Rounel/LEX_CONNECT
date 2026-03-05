import { useState } from 'react';
import {
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const TYPES = ['Code', 'Loi', 'Décret', 'Jurisprudence', 'Ordonnance', 'Règlement'];

const DOMAINES = [
  'Droit civil',
  'Droit pénal',
  'Droit commercial',
  'Droit administratif',
  'Droit social',
  'Droit constitutionnel',
  'Droit international',
];

const STATUTS = ['En vigueur', 'Abrogé', 'Tous'];

// ─── Composants ───────────────────────────────────────────────────────────────

function Checkbox({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle} hitSlop={6}>
      <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>
        {checked && <IconSymbol name="checkmark" size={11} color="#fff" />}
      </View>
      <ThemedText style={styles.checkLabel}>{label}</ThemedText>
    </Pressable>
  );
}

function RadioItem({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <Pressable style={styles.radioRow} onPress={onSelect} hitSlop={6}>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <ThemedText style={styles.radioLabel}>{label}</ThemedText>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FiltresScreen() {
  const router = useRouter();

  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedDomaines, setSelectedDomaines] = useState<Set<string>>(new Set());
  const [selectedStatut, setSelectedStatut] = useState('En vigueur');

  const toggleType = (t: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const toggleDomaine = (d: string) => {
    setSelectedDomaines(prev => {
      const next = new Set(prev);
      next.has(d) ? next.delete(d) : next.add(d);
      return next;
    });
  };

  const reset = () => {
    setSelectedTypes(new Set());
    setSelectedDomaines(new Set());
    setSelectedStatut('En vigueur');
  };

  const totalActive = selectedTypes.size + selectedDomaines.size + (selectedStatut !== 'Tous' ? 1 : 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Handle ── */}
      <View style={styles.handle} />

      {/* ── Titre ── */}
      <View style={styles.titleRow}>
        <ThemedText style={styles.title}>Filtres</ThemedText>
        <Pressable onPress={reset} hitSlop={8}>
          <ThemedText style={styles.reset}>Réinitialiser</ThemedText>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Type de texte ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>TYPE DE TEXTE</ThemedText>
          <View style={styles.checkGrid}>
            {TYPES.map(t => (
              <View key={t} style={styles.checkGridItem}>
                <Checkbox
                  label={t}
                  checked={selectedTypes.has(t)}
                  onToggle={() => toggleType(t)}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        {/* ── Domaine juridique ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>DOMAINE JURIDIQUE</ThemedText>
          {DOMAINES.map(d => (
            <Checkbox
              key={d}
              label={d}
              checked={selectedDomaines.has(d)}
              onToggle={() => toggleDomaine(d)}
            />
          ))}
        </View>

        <View style={styles.divider} />

        {/* ── Statut ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>STATUT</ThemedText>
          <View style={styles.radioRow3}>
            {STATUTS.map(s => (
              <RadioItem
                key={s}
                label={s}
                selected={selectedStatut === s}
                onSelect={() => setSelectedStatut(s)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <View style={styles.footerDivider} />
        <View style={styles.footerBtns}>
          <Pressable onPress={() => router.back()} style={styles.cancelBtn} hitSlop={6}>
            <ThemedText style={styles.cancelBtnText}>Annuler</ThemedText>
          </Pressable>
          <Pressable
            style={styles.applyBtn}
            onPress={() => router.back()}>
            <ThemedText style={styles.applyBtnText}>
              Appliquer les filtres
              {totalActive > 0 ? ` (${totalActive})` : ''}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  reset: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  section: { paddingVertical: 20, gap: 14 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },

  checkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  checkGridItem: { width: '50%', paddingVertical: 4 },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Palette.accent2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkBoxChecked: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  checkLabel: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },

  radioRow3: { flexDirection: 'row', gap: 24 },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Palette.accent2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: Palette.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.primary,
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },

  footer: {
    backgroundColor: '#fff',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  footerBtns: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '50',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Palette.primary,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },
});
