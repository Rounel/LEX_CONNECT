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

// ─── Mock data ────────────────────────────────────────────────────────────────

type Question = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explication: string;
  source: string;
};

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: "En droit ivoirien, quelle est la durée légale de la période d'essai maximale pour un cadre en CDI ?",
    options: ['3 mois', '6 mois', '12 mois', '18 mois'],
    correct: 1,
    explication: "Selon l'article 16.3 du Code du Travail ivoirien, la période d'essai pour un cadre en CDI est de 6 mois maximum, renouvelable une fois.",
    source: "Code du Travail ivoirien — Art. 16.3",
  },
  {
    id: 'q2',
    question: "Quel est le délai de préavis pour un salarié ayant plus de 2 ans d'ancienneté selon le Code du Travail ivoirien ?",
    options: ['1 mois', '2 mois', '3 mois', '6 mois'],
    correct: 1,
    explication: "Pour un salarié justifiant de plus de 2 ans d'ancienneté, le délai de préavis légal est de 2 mois.",
    source: "Code du Travail ivoirien — Art. 30",
  },
  {
    id: 'q3',
    question: "En droit ivoirien, à partir de quel âge une personne peut-elle conclure un contrat sans autorisation parentale ?",
    options: ['16 ans', '18 ans', '20 ans', '21 ans'],
    correct: 1,
    explication: "La majorité civile est fixée à 18 ans par le Code Civil ivoirien. À cet âge, la personne peut conclure tout acte juridique de façon autonome.",
    source: "Code Civil ivoirien — Art. 8",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function CitationCard({ source }: { source: string }) {
  return (
    <View style={styles.citation}>
      <View style={styles.citationLeft} />
      <View style={styles.citationBody}>
        <IconSymbol name="doc.text.fill" size={13} color={Palette.primary} />
        <ThemedText style={styles.citationText}>{source}</ThemedText>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function QuizScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [validated, setValidated] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);

  const q = QUESTIONS[currentIdx];
  const total = QUESTIONS.length;
  const progress = ((currentIdx + 1) / total) * 100;

  const validate = () => {
    if (selected === null) return;
    setValidated(true);
    setScores(prev => [...prev, selected === q.correct]);
  };

  const next = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setValidated(false);
    } else {
      const correct = scores.filter(Boolean).length + (selected === q.correct ? 1 : 0);
      router.replace({ pathname: '/concours/resultat', params: { score: correct, total } } as any);
    }
  };

  const optionStyle = (i: number) => {
    if (!validated) {
      return [styles.option, selected === i && styles.optionSelected];
    }
    if (i === q.correct) return [styles.option, styles.optionCorrect];
    if (i === selected && selected !== q.correct) return [styles.option, styles.optionWrong];
    return [styles.option, styles.optionDimmed];
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <IconSymbol name="chevron.left" size={22} color={Palette.foreground} />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Droit civil</ThemedText>
        <ThemedText style={styles.counter}>Q {currentIdx + 1}/{total}</ThemedText>
      </View>

      {/* ── Progress ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* ── Question card ── */}
        <View style={styles.card}>
          <ThemedText style={styles.question}>{q.question}</ThemedText>

          {/* ── Options ── */}
          <View style={styles.options}>
            {q.options.map((opt, i) => (
              <Pressable
                key={i}
                style={optionStyle(i)}
                onPress={() => { if (!validated) setSelected(i); }}
                disabled={validated}>
                <View style={[styles.optionRadio, selected === i && !validated && styles.optionRadioSelected, validated && i === q.correct && styles.optionRadioCorrect, validated && i === selected && i !== q.correct && styles.optionRadioWrong]}>
                  {validated && i === q.correct && (
                    <IconSymbol name="checkmark" size={11} color="#fff" />
                  )}
                  {validated && i === selected && i !== q.correct && (
                    <IconSymbol name="xmark" size={11} color="#fff" />
                  )}
                </View>
                <ThemedText style={styles.optionLetter}>
                  {String.fromCharCode(65 + i)}
                </ThemedText>
                <ThemedText style={styles.optionText}>{opt}</ThemedText>
              </Pressable>
            ))}
          </View>

          {/* ── Explication ── */}
          {validated && (
            <View style={[styles.explication, selected === q.correct ? styles.explicationCorrect : styles.explicationWrong]}>
              <ThemedText style={[styles.explicationTitle, { color: selected === q.correct ? '#1E7A47' : '#C0392B' }]}>
                {selected === q.correct ? '✓ Correct !' : '✗ Incorrect'}
              </ThemedText>
              <ThemedText style={styles.explicationText}>{q.explication}</ThemedText>
              <CitationCard source={q.source} />
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        {!validated ? (
          <Pressable
            style={[styles.actionBtn, selected === null && styles.actionBtnDisabled]}
            onPress={validate}
            disabled={selected === null}>
            <ThemedText style={styles.actionBtnText}>Valider</ThemedText>
          </Pressable>
        ) : (
          <Pressable style={styles.actionBtn} onPress={next}>
            <ThemedText style={styles.actionBtnText}>
              {currentIdx < total - 1 ? 'Question suivante →' : 'Voir les résultats'}
            </ThemedText>
          </Pressable>
        )}
      </View>
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
    paddingVertical: 12,
    backgroundColor: Palette.background,
  },
  iconBtn: { padding: 4 },
  headerTitle: {
    fontSize: 16,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  counter: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  progressTrack: { height: 4, backgroundColor: '#e0e0e0' },
  progressFill: { height: 4, backgroundColor: Palette.primary, borderRadius: 2 },

  content: {
    padding: 16,
    paddingBottom: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 26,
  },

  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '40',
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.accent1,
  },
  optionCorrect: {
    borderColor: '#1E7A47',
    backgroundColor: '#E6F6EE',
  },
  optionWrong: {
    borderColor: '#C0392B',
    backgroundColor: '#FDEDEB',
  },
  optionDimmed: { opacity: 0.5 },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Palette.accent2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionRadioSelected: { borderColor: Palette.primary, backgroundColor: Palette.primary + '20' },
  optionRadioCorrect: { borderColor: '#1E7A47', backgroundColor: '#1E7A47' },
  optionRadioWrong: { borderColor: '#C0392B', backgroundColor: '#C0392B' },
  optionLetter: {
    width: 18,
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },

  explication: {
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  explicationCorrect: { backgroundColor: '#E6F6EE' },
  explicationWrong: { backgroundColor: '#FDEDEB' },
  explicationTitle: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
  },
  explicationText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 19,
  },

  citation: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: 4,
  },
  citationLeft: { width: 3, backgroundColor: Palette.primary },
  citationBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  citationText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Palette.background,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionBtn: {
    backgroundColor: Palette.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnDisabled: { backgroundColor: '#ccc' },
  actionBtnText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: '#fff',
  },
});
