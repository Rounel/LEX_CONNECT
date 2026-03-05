import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SettingsAffichageScreen() {
  const router = useRouter();

  const [theme, setTheme] = useState<'clair' | 'sombre' | 'auto'>('clair');
  const [textSize, setTextSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.75);
  const [font, setFont] = useState<'lora' | 'inter'>('lora');

  const THEMES = [
    { id: 'clair' as const, label: 'Clair', icon: 'sun.max.fill' as const },
    { id: 'sombre' as const, label: 'Sombre', icon: 'moon.fill' as const },
    { id: 'auto' as const, label: 'Auto', icon: 'circle.lefthalf.filled' as const },
  ];

  const FONTS = [
    { id: 'lora' as const, label: 'Lora (Sérif)', desc: 'Recommandée pour la lecture' },
    { id: 'inter' as const, label: 'Inter (Sans-sérif)', desc: 'Plus moderne et épurée' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={10}>
          <IconSymbol name="chevron.left" size={22} color={Palette.primary} />
          <ThemedText style={styles.backText}>Retour</ThemedText>
        </Pressable>
        <ThemedText style={styles.headerTitle}>Affichage</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Thème ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>THÈME</ThemedText>
          <View style={styles.themeRow}>
            {THEMES.map(t => (
              <Pressable
                key={t.id}
                style={[styles.themeCard, theme === t.id && styles.themeCardActive]}
                onPress={() => setTheme(t.id)}>
                <IconSymbol
                  name={t.icon}
                  size={20}
                  color={theme === t.id ? Palette.primary : Palette.accent2}
                />
                <ThemedText style={[styles.themeLabel, theme === t.id && styles.themeLabelActive]}>
                  {t.label}
                </ThemedText>
                <View style={[styles.radioOuter, theme === t.id && styles.radioOuterActive]}>
                  {theme === t.id && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* ── Lecteur ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>LECTEUR</ThemedText>
          <View style={styles.card}>
            {/* Taille du texte */}
            <View style={styles.sliderBlock}>
              <View style={styles.sliderLabelRow}>
                <ThemedText style={styles.sliderLabel}>Taille du texte</ThemedText>
                <ThemedText style={styles.sliderValue}>{textSize}px</ThemedText>
              </View>
              <View style={styles.stepRow}>
                <Pressable
                  style={[styles.stepBtn, textSize <= 14 && styles.stepBtnDisabled]}
                  onPress={() => setTextSize(v => Math.max(14, v - 1))}
                  disabled={textSize <= 14}>
                  <ThemedText style={styles.stepBtnText}>A−</ThemedText>
                </Pressable>
                <View style={styles.stepTrack}>
                  <View style={[styles.stepFill, { width: `${((textSize - 14) / 6) * 100}%` as any }]} />
                </View>
                <Pressable
                  style={[styles.stepBtn, textSize >= 20 && styles.stepBtnDisabled]}
                  onPress={() => setTextSize(v => Math.min(20, v + 1))}
                  disabled={textSize >= 20}>
                  <ThemedText style={styles.stepBtnTextLg}>A+</ThemedText>
                </Pressable>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Interligne */}
            <View style={styles.sliderBlock}>
              <View style={styles.sliderLabelRow}>
                <ThemedText style={styles.sliderLabel}>Interligne</ThemedText>
                <ThemedText style={styles.sliderValue}>{lineHeight.toFixed(1)}</ThemedText>
              </View>
              <View style={styles.stepRow}>
                <Pressable
                  style={[styles.stepBtn, lineHeight <= 1.4 && styles.stepBtnDisabled]}
                  onPress={() => setLineHeight(v => parseFloat(Math.max(1.4, v - 0.2).toFixed(1)))}
                  disabled={lineHeight <= 1.4}>
                  <ThemedText style={styles.stepBtnText}>—</ThemedText>
                </Pressable>
                <View style={styles.stepTrack}>
                  <View style={[styles.stepFill, { width: `${((lineHeight - 1.4) / 0.8) * 100}%` as any }]} />
                </View>
                <Pressable
                  style={[styles.stepBtn, lineHeight >= 2.2 && styles.stepBtnDisabled]}
                  onPress={() => setLineHeight(v => parseFloat(Math.min(2.2, v + 0.2).toFixed(1)))}
                  disabled={lineHeight >= 2.2}>
                  <ThemedText style={styles.stepBtnText}>≡</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* ── Police de lecture ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>POLICE DE LECTURE</ThemedText>
          <View style={styles.card}>
            {FONTS.map((f, i) => (
              <View key={f.id}>
                <Pressable
                  style={styles.fontRow}
                  onPress={() => setFont(f.id)}>
                  <View style={[styles.radioOuter, font === f.id && styles.radioOuterActive]}>
                    {font === f.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.fontTexts}>
                    <ThemedText style={[styles.fontLabel, f.id === 'lora' && { fontFamily: Fonts.heading.regular }]}>
                      {f.label}
                    </ThemedText>
                    <ThemedText style={styles.fontDesc}>{f.desc}</ThemedText>
                  </View>
                </Pressable>
                {i < FONTS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── Aperçu ── */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>APERÇU</ThemedText>
          <View style={[styles.card, styles.preview]}>
            <ThemedText style={[styles.previewText, {
              fontSize: textSize,
              lineHeight: textSize * lineHeight,
              fontFamily: font === 'lora' ? Fonts.heading.regular : Fonts.body.regular,
            }]}>
              "Art. 1 — Le Code Civil de Côte d'Ivoire régit les relations entre les personnes physiques et morales, les actes et les faits juridiques."
            </ThemedText>
          </View>
        </View>
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

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    padding: 16,
  },

  themeRow: { flexDirection: 'row', gap: 10 },
  themeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '30',
    backgroundColor: '#fff',
    gap: 7,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  themeCardActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.accent1,
  },
  themeLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
  },
  themeLabelActive: { color: Palette.primary },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: Palette.accent2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: Palette.primary },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Palette.primary,
  },

  sliderBlock: { gap: 8 },
  sliderLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 15,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  sliderValue: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBtn: {
    width: 40,
    height: 36,
    borderRadius: 8,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnDisabled: { backgroundColor: '#eee' },
  stepBtnText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  stepBtnTextLg: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  stepTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#ddd',
    borderRadius: 3,
  },
  stepFill: {
    height: 6,
    backgroundColor: Palette.primary,
    borderRadius: 3,
  },

  divider: {
    height: 1,
    backgroundColor: Palette.background,
    marginVertical: 12,
  },

  fontRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  fontTexts: { flex: 1, gap: 3 },
  fontLabel: {
    fontSize: 15,
    color: Palette.foreground,
  },
  fontDesc: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  preview: { padding: 20 },
  previewText: {
    color: Palette.foreground,
    lineHeight: 28,
  },
});
