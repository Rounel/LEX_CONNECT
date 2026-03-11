import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/primary-button';
import { TextInputField } from '@/components/text-input-field';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, Palette } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api/client';

// ─── Types ────────────────────────────────────────────────────────────────────

type Profil = 'etudiant' | 'professionnel' | null;

const PROFILS: { key: Exclude<Profil, null>; label: string; description: string; icon: 'graduationcap.fill' | 'briefcase.fill' }[] = [
  {
    key: 'etudiant',
    label: 'Étudiant en droit',
    description: 'Licence, Master, Doctorat',
    icon: 'graduationcap.fill',
  },
  {
    key: 'professionnel',
    label: 'Professionnel',
    description: 'Avocat, Magistrat, Juriste…',
    icon: 'briefcase.fill',
  },
];

// Règles password API : min 8, max 128, au moins 1 lettre + 1 chiffre
function isValidPassword(pwd: string): boolean {
  if (pwd.length < 8 || pwd.length > 128) return false;
  return /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);
}

// ─── Écran ────────────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const bgColor = useThemeColor({}, 'mainBackground');

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profil, setProfil] = useState<Profil>(null);
  const [cguAccepted, setCguAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit =
    prenom.trim().length > 0 &&
    nom.trim().length > 0 &&
    email.trim().length > 0 &&
    isValidPassword(password) &&
    profil !== null &&
    cguAccepted;

  const handleRegister = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await register(email.trim(), password, `${prenom.trim()} ${nom.trim()}`);
      router.replace('/(country)/select');
    } catch (err) {
      if (err instanceof ApiError && (err.status === 400 || err.status === 422)) {
        setError('Cet email est peut-être déjà utilisé, ou les informations sont invalides.');
      } else {
        setError('Impossible de créer le compte. Vérifiez votre connexion internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ── Nav bar ── */}
        <View style={styles.nav}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.navBtn}>
            <IconSymbol name="chevron.left" size={22} color={Palette.foreground} />
          </Pressable>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotFilled]} />
          </View>
          <Pressable onPress={() => router.replace('/(country)/select')} hitSlop={12} style={styles.navBtn}>
            <IconSymbol name="xmark" size={18} color={Palette.foreground} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Titre ── */}
          <View style={styles.titleSection}>
            <ThemedText style={styles.title}>Créons votre{'\n'}compte</ThemedText>
            <ThemedText style={styles.subtitle}>
              Rejoignez Wilex, la bibliothèque juridique ivoirienne.
            </ThemedText>
          </View>

          {/* ── Formulaire ── */}
          <View style={styles.form}>

            {/* Prénom + Nom */}
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <TextInputField
                  label="Prénom"
                  value={prenom}
                  onChangeText={setPrenom}
                  placeholder="Jean"
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.nameField}>
                <TextInputField
                  label="Nom"
                  value={nom}
                  onChangeText={setNom}
                  placeholder="Dupont"
                  autoCapitalize="words"
                />
              </View>
            </View>

            <TextInputField
              label="Adresse email"
              value={email}
              onChangeText={setEmail}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInputField
              label="Mot de passe"
              value={password}
              onChangeText={(v) => { setPassword(v); setError(null); }}
              placeholder="8 car. min. avec lettres et chiffres"
              secureTextEntry
            />

            {/* Sélecteur de profil */}
            <View style={styles.profilSection}>
              <ThemedText style={styles.profilLabel}>Je suis…</ThemedText>
              <View style={styles.profilRow}>
                {PROFILS.map((p) => {
                  const selected = profil === p.key;
                  return (
                    <Pressable
                      key={p.key}
                      onPress={() => setProfil(p.key)}
                      style={({ pressed }) => [
                        styles.profilCard,
                        selected && styles.profilCardSelected,
                        pressed && styles.pressed,
                      ]}>
                      <View
                        style={[
                          styles.profilIconWrap,
                          { backgroundColor: selected ? Palette.primary + '18' : Palette.accent1 },
                        ]}>
                        <IconSymbol
                          name={p.icon}
                          size={24}
                          color={selected ? Palette.primary : Palette.accent2}
                        />
                      </View>
                      <ThemedText
                        style={[
                          styles.profilCardLabel,
                          selected && styles.profilCardLabelSelected,
                        ]}>
                        {p.label}
                      </ThemedText>
                      <ThemedText style={styles.profilCardDesc}>{p.description}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* CGU */}
            <Pressable
              style={styles.cguRow}
              onPress={() => setCguAccepted((v) => !v)}
              hitSlop={8}>
              <View style={[styles.checkbox, cguAccepted && styles.checkboxChecked]}>
                {cguAccepted && <IconSymbol name="checkmark" size={11} color="#fff" />}
              </View>
              <ThemedText style={styles.cguText}>
                J&apos;accepte les{' '}
                <ThemedText style={styles.cguLink}>Conditions générales</ThemedText>
                {' '}et la{' '}
                <ThemedText style={styles.cguLink}>Politique de confidentialité</ThemedText>
              </ThemedText>
            </Pressable>

          </View>

          {/* ── Erreur ── */}
          {error !== null && (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          )}

          <View style={styles.spacer} />

          {/* ── Actions ── */}
          <View style={styles.bottomAction}>
            <PrimaryButton
              title={isLoading ? 'Création…' : 'Créer mon compte'}
              onPress={handleRegister}
              disabled={!canSubmit || isLoading}
              style={styles.cta}
            />
            <View style={styles.loginRow}>
              <ThemedText style={styles.loginText}>Déjà un compte ?</ThemedText>
              <Pressable onPress={() => router.back()} hitSlop={8}>
                <ThemedText style={styles.loginLink}>Se connecter</ThemedText>
              </Pressable>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },

  // Nav
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Palette.accent2 + '50',
  },
  dotFilled: {
    backgroundColor: Palette.foreground,
  },

  // Layout
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 28,
  },
  spacer: { flex: 1, minHeight: 16 },

  // Titre
  titleSection: { gap: 10 },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // Formulaire
  form: { gap: 18 },
  nameRow: { flexDirection: 'row', gap: 12 },
  nameField: { flex: 1 },

  // Profil selector
  profilSection: { gap: 10 },
  profilLabel: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  profilRow: { flexDirection: 'row', gap: 12 },
  profilCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '40',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  profilCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primary + '08',
  },
  profilIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilCardLabel: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
    textAlign: 'center',
    lineHeight: 18,
  },
  profilCardLabelSelected: { color: Palette.primary },
  profilCardDesc: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },

  // CGU
  cguRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Palette.accent2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  cguText: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
    lineHeight: 19,
  },
  cguLink: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  // Bottom
  bottomAction: { gap: 14 },
  cta: { height: 56, borderRadius: 14 },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
  },
  loginText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  errorText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: '#C62828',
    lineHeight: 18,
    marginTop: -12,
  },
  pressed: { opacity: 0.75 },
});
