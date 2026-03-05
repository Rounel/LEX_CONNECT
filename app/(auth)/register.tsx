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

type Profil = 'etudiant' | 'professionnel' | null;

const PROFILS = [
  {
    key: 'etudiant' as const,
    label: 'Étudiant en droit',
    description: 'Licence, Master, Doctorat',
    icon: 'graduationcap.fill' as const,
  },
  {
    key: 'professionnel' as const,
    label: 'Professionnel',
    description: 'Avocat, Magistrat, Juriste…',
    icon: 'briefcase.fill' as const,
  },
];

export default function RegisterScreen() {
  const router = useRouter();
  const bgColor = useThemeColor({}, 'mainBackground');

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profil, setProfil] = useState<Profil>(null);
  const [cguAccepted, setCguAccepted] = useState(false);

  const canSubmit =
    prenom.trim().length > 0 &&
    nom.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    profil !== null &&
    cguAccepted;

  const handleRegister = () => {
    // No-op pour l'instant — navigation vers les tabs
    router.replace('/(country)/select');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={12}>
              <IconSymbol name="chevron.left" size={20} color={Palette.primary} />
              <ThemedText style={styles.backText}>Retour</ThemedText>
            </Pressable>
            <ThemedText type="title" style={styles.title}>
              Créer un compte
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Rejoignez Wilex, la bibliothèque juridique ivoirienne.
            </ThemedText>
          </View>

          {/* ── Formulaire ── */}
          <View style={styles.form}>

            {/* Prénom + Nom côte à côte */}
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
              onChangeText={setPassword}
              placeholder="6 caractères minimum"
              secureTextEntry
            />

            {/* ── Sélecteur de profil ── */}
            <View style={styles.profilSection}>
              <ThemedText type="defaultSemiBold" style={styles.profilLabel}>
                Je suis…
              </ThemedText>
              <View style={styles.profilRow}>
                {PROFILS.map((p) => {
                  const isSelected = profil === p.key;
                  return (
                    <Pressable
                      key={p.key}
                      onPress={() => setProfil(p.key)}
                      style={({ pressed }) => [
                        styles.profilCard,
                        isSelected && styles.profilCardSelected,
                        pressed && styles.pressed,
                      ]}>
                      <View
                        style={[
                          styles.profilIconWrap,
                          { backgroundColor: isSelected ? Palette.primary + '18' : Palette.accent1 },
                        ]}>
                        <IconSymbol
                          name={p.icon}
                          size={26}
                          color={isSelected ? Palette.primary : Palette.accent2}
                        />
                      </View>
                      <ThemedText
                        style={[
                          styles.profilCardLabel,
                          isSelected && styles.profilCardLabelSelected,
                        ]}>
                        {p.label}
                      </ThemedText>
                      <ThemedText style={styles.profilCardDesc}>
                        {p.description}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* ── CGU ── */}
            <Pressable
              style={styles.cguRow}
              onPress={() => setCguAccepted((v) => !v)}
              hitSlop={8}>
              <View style={[styles.checkbox, cguAccepted && styles.checkboxChecked]}>
                {cguAccepted && (
                  <IconSymbol name="checkmark" size={12} color="#fff" />
                )}
              </View>
              <ThemedText style={styles.cguText}>
                J'accepte les{' '}
                <ThemedText style={styles.cguLink}>Conditions générales</ThemedText>
                {' '}et la{' '}
                <ThemedText style={styles.cguLink}>Politique de confidentialité</ThemedText>
              </ThemedText>
            </Pressable>

          </View>

          {/* ── Actions ── */}
          <View style={styles.actions}>
            <PrimaryButton
              title="Créer mon compte"
              onPress={handleRegister}
              disabled={!canSubmit}
              style={styles.submitButton}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 28,
  },

  // Header
  header: {
    paddingTop: 16,
    gap: 8,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  title: {
    color: Palette.foreground,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    lineHeight: 20,
  },

  // Formulaire
  form: {
    gap: 18,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },

  // Sélecteur profil
  profilSection: {
    gap: 10,
  },
  profilLabel: {
    fontSize: 14,
    color: Palette.foreground,
  },
  profilRow: {
    flexDirection: 'row',
    gap: 12,
  },
  profilCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '40',
    backgroundColor: '#fff',
    gap: 8,
  },
  profilCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.primary + '08',
  },
  profilIconWrap: {
    width: 52,
    height: 52,
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
  profilCardLabelSelected: {
    color: Palette.primary,
  },
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
    color: Palette.accent2,
    lineHeight: 19,
  },
  cguLink: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  // Actions
  actions: {
    gap: 16,
  },
  submitButton: {
    width: '100%',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
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

  pressed: {
    opacity: 0.75,
  },
});
