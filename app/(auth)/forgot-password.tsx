import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

type Step = 'form' | 'sent';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const bgColor = useThemeColor({}, 'mainBackground');

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!email.trim()) return;
    setLoading(true);
    // Simule un délai réseau
    setTimeout(() => {
      setLoading(false);
      setStep('sent');
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ── Navigation retour ── */}
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backRow} hitSlop={12}>
            <IconSymbol name="chevron.left" size={20} color={Palette.primary} />
            <ThemedText style={styles.backText}>Retour</ThemedText>
          </Pressable>
        </View>

        {step === 'form' ? (
          /* ── Formulaire ── */
          <View style={styles.content}>
            {/* Icône */}
            <View style={styles.iconWrap}>
              <IconSymbol name="envelope.fill" size={36} color={Palette.primary} />
            </View>

            {/* Texte */}
            <View style={styles.textBlock}>
              <ThemedText type="title" style={styles.title}>
                Mot de passe oublié ?
              </ThemedText>
              <ThemedText style={styles.description}>
                Saisissez l'adresse email associée à votre compte. Nous vous enverrons
                un lien pour réinitialiser votre mot de passe.
              </ThemedText>
            </View>

            {/* Champ email */}
            <View style={styles.fieldWrap}>
              <TextInputField
                label="Adresse email"
                value={email}
                onChangeText={setEmail}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Bouton envoi */}
            <PrimaryButton
              title={loading ? 'Envoi en cours…' : 'Envoyer le lien'}
              onPress={handleSend}
              disabled={loading || email.trim().length === 0}
              style={styles.button}
            />

            {/* Retour connexion */}
            <Pressable onPress={() => router.back()} style={styles.loginLink} hitSlop={8}>
              <ThemedText style={styles.loginLinkText}>
                ← Retour à la connexion
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          /* ── Confirmation d'envoi ── */
          <View style={styles.content}>
            <View style={[styles.iconWrap, styles.iconWrapSuccess]}>
              <IconSymbol name="checkmark.circle.fill" size={40} color="#1E7A47" />
            </View>

            <View style={styles.textBlock}>
              <ThemedText type="title" style={styles.title}>
                Email envoyé !
              </ThemedText>
              <ThemedText style={styles.description}>
                Un lien de réinitialisation a été envoyé à{' '}
                <ThemedText style={styles.emailHighlight}>{email}</ThemedText>
                .{'\n\n'}Pensez à vérifier votre dossier spam si vous ne le trouvez pas
                dans votre boîte principale.
              </ThemedText>
            </View>

            <PrimaryButton
              title="Retour à la connexion"
              onPress={() => router.replace('/(auth)/login')}
              style={styles.button}
            />

            <Pressable
              onPress={() => { setStep('form'); setEmail(''); }}
              style={styles.loginLink}
              hitSlop={8}>
              <ThemedText style={styles.loginLinkText}>
                Renvoyer avec une autre adresse
              </ThemedText>
            </Pressable>
          </View>
        )}

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

  topBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    gap: 24,
  },

  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  iconWrapSuccess: {
    backgroundColor: '#E6F6EE',
  },

  textBlock: {
    gap: 10,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: Palette.foreground,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailHighlight: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },

  fieldWrap: {
    width: '100%',
  },
  button: {
    width: '100%',
  },

  loginLink: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
});
