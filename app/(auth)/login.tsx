import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
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

type Step = 'method' | 'email' | 'phone' | 'otp';

// ─── Composants internes ───────────────────────────────────────────────────────

function StepDots({ filled, total }: { filled: number; total: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i < filled && styles.dotFilled]} />
      ))}
    </View>
  );
}

function NavBar({
  onBack,
  onClose,
  dots,
}: {
  onBack?: () => void;
  onClose: () => void;
  dots?: React.ReactNode;
}) {
  return (
    <View style={styles.nav}>
      <Pressable onPress={onBack ?? undefined} hitSlop={12} style={styles.navBtn}>
        {onBack && <IconSymbol name="chevron.left" size={22} color={Palette.foreground} />}
      </Pressable>
      {dots ?? <View style={styles.dots} />}
      <Pressable onPress={onClose} hitSlop={12} style={styles.navBtn}>
        <IconSymbol name="xmark" size={18} color={Palette.foreground} />
      </Pressable>
    </View>
  );
}

// ─── Écran principal ──────────────────────────────────────────────────────────

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const bgColor = useThemeColor({}, 'mainBackground');

  const [step, setStep] = useState<Step>('method');

  // Email flow
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Phone / OTP flow
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRef0 = useRef<TextInput>(null);
  const otpRef1 = useRef<TextInput>(null);
  const otpRef2 = useRef<TextInput>(null);
  const otpRef3 = useRef<TextInput>(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3];

  const handleSkip = () => router.replace('/(country)/select');

  const handleBack = () => {
    if (step === 'email' || step === 'phone') setStep('method');
    else if (step === 'otp') setStep('phone');
    else router.back();
  };

  // ── Email login ──────────────────────────────────────────────────────────────

  const handleEmailLogin = async () => {
    setEmailError(null);
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(country)/select');
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
        setEmailError('Email ou mot de passe incorrect.');
      } else {
        setEmailError('Impossible de se connecter. Vérifiez votre connexion internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP helpers ──────────────────────────────────────────────────────────────

  const handleOtpChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 3) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKey = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  // ── Rendu : sélection de méthode ─────────────────────────────────────────────

  if (step === 'method') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
        <NavBar onClose={handleSkip} />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={styles.titleSection}>
            <ThemedText style={styles.title}>Bon retour{'\n'}parmi nous !</ThemedText>
            <ThemedText style={styles.subtitle}>
              Choisissez votre méthode de connexion pour accéder à votre bibliothèque juridique.
            </ThemedText>
          </View>

          <View style={styles.methodList}>
            <Pressable
              style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}
              onPress={() => {}}>
              <View style={styles.socialBadge}>
                <ThemedText style={styles.socialBadgeText}>G</ThemedText>
              </View>
              <ThemedText style={styles.socialBtnText}>Continuer avec Google</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}
              onPress={() => {}}>
              <View style={[styles.socialBadge, styles.linkedinBadge]}>
                <ThemedText style={[styles.socialBadgeText, styles.linkedinBadgeText]}>in</ThemedText>
              </View>
              <ThemedText style={styles.socialBtnText}>Continuer avec LinkedIn</ThemedText>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>ou</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}
              onPress={() => setStep('email')}>
              <View style={styles.socialBadge}>
                <IconSymbol name="envelope.fill" size={14} color={Palette.foreground} />
              </View>
              <ThemedText style={styles.socialBtnText}>Email & mot de passe</ThemedText>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}
              onPress={() => setStep('phone')}>
              <View style={styles.socialBadge}>
                <IconSymbol name="phone.fill" size={14} color={Palette.foreground} />
              </View>
              <ThemedText style={styles.socialBtnText}>Numéro de téléphone</ThemedText>
            </Pressable>
          </View>

          <View style={styles.spacer} />

          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Pas de compte ?{' '}
              <ThemedText
                onPress={() => router.push('/(auth)/register')}
                style={styles.footerLink}>
                S&apos;inscrire
              </ThemedText>
            </ThemedText>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Rendu : email + mot de passe ─────────────────────────────────────────────

  if (step === 'email') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <NavBar
            onBack={handleBack}
            onClose={handleSkip}
            dots={<StepDots filled={1} total={2} />}
          />
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            <View style={styles.titleSection}>
              <ThemedText style={styles.title}>Votre adresse{'\n'}email</ThemedText>
              <ThemedText style={styles.subtitle}>
                Entrez vos identifiants pour vous connecter.
              </ThemedText>
            </View>

            <View style={styles.form}>
              <TextInputField
                label="Email"
                value={email}
                onChangeText={(v) => { setEmail(v); setEmailError(null); }}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInputField
                label="Mot de passe"
                value={password}
                onChangeText={(v) => { setPassword(v); setEmailError(null); }}
                placeholder="Votre mot de passe"
                secureTextEntry
              />
              {emailError !== null && (
                <ThemedText style={styles.errorText}>{emailError}</ThemedText>
              )}
              <Pressable
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotWrap}
                hitSlop={8}>
                <ThemedText style={styles.forgotText}>Mot de passe oublié ?</ThemedText>
              </Pressable>
            </View>

            <View style={styles.spacer} />

            <View style={styles.bottomAction}>
              <PrimaryButton
                title={isLoading ? 'Connexion…' : 'Se connecter'}
                onPress={handleEmailLogin}
                disabled={isLoading || email.trim().length === 0 || password.length === 0}
                style={styles.cta}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Rendu : numéro de téléphone ──────────────────────────────────────────────

  if (step === 'phone') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <NavBar
            onBack={handleBack}
            onClose={handleSkip}
            dots={<StepDots filled={1} total={2} />}
          />
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            <View style={styles.titleSection}>
              <ThemedText style={styles.title}>Votre numéro{'\n'}de téléphone</ThemedText>
              <ThemedText style={styles.subtitle}>
                Nous vous enverrons un code de vérification par SMS pour vous connecter.
              </ThemedText>
            </View>

            <View style={styles.form}>
              <ThemedText style={styles.inputLabel}>Numéro de téléphone</ThemedText>
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <ThemedText style={styles.countryCodeText}>🇨🇮  +225</ThemedText>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="07 XX XX XX XX"
                  placeholderTextColor={Palette.accent2}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.spacer} />

            <View style={styles.bottomAction}>
              <ThemedText style={styles.alreadyAccount}>
                Déjà un compte email ?{' '}
                <ThemedText
                  onPress={() => setStep('email')}
                  style={styles.footerLink}>
                  Se connecter
                </ThemedText>
              </ThemedText>
              <PrimaryButton
                title="Étape suivante"
                onPress={() => setStep('otp')}
                disabled={phone.trim().length < 8}
                style={styles.cta}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── Rendu : code OTP ─────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <NavBar
          onBack={handleBack}
          onClose={handleSkip}
          dots={<StepDots filled={2} total={2} />}
        />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={styles.titleSection}>
            <ThemedText style={styles.title}>Code de{'\n'}vérification</ThemedText>
            <ThemedText style={styles.subtitle}>
              Nous avons envoyé un code à 4 chiffres au +225 {phone}.
            </ThemedText>
          </View>

          <View style={styles.otpRow}>
            {otp.map((val, i) => (
              <TextInput
                key={i}
                ref={otpRefs[i]}
                style={styles.otpBox}
                value={val}
                onChangeText={(v) => handleOtpChange(v, i)}
                onKeyPress={({ nativeEvent }) => handleOtpKey(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <Pressable
            onPress={() => setStep('phone')}
            hitSlop={8}
            style={styles.resendWrap}>
            <ThemedText style={styles.footerLink}>Renvoyer le code</ThemedText>
          </Pressable>

          <View style={styles.spacer} />

          <View style={styles.bottomAction}>
            <PrimaryButton
              title="Se connecter"
              onPress={handleSkip}
              disabled={otp.some((v) => !v)}
              style={styles.cta}
            />
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

  // Nav bar
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
  spacer: { flex: 1, minHeight: 20 },

  // Title
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

  // Method list
  methodList: { gap: 12 },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '55',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    gap: 14,
  },
  socialBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialBadgeText: {
    fontSize: 14,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    lineHeight: 18,
  },
  linkedinBadge: {
    backgroundColor: '#0077B5',
  },
  linkedinBadgeText: {
    color: '#FFFFFF',
  },
  socialBtnText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.accent2,
    opacity: 0.35,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },

  // Form
  form: { gap: 16 },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
    marginBottom: -8,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  countryCode: {
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '80',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 15,
    fontFamily: Fonts.body.semiBold,
    color: Palette.foreground,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '80',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  forgotWrap: { alignSelf: 'flex-end' },
  forgotText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },

  // OTP
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginTop: 8,
  },
  otpBox: {
    width: 68,
    height: 72,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Palette.accent2 + '70',
    backgroundColor: '#FFFFFF',
    fontSize: 28,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  resendWrap: { alignItems: 'center', marginTop: -8 },

  // Bottom
  bottomAction: { gap: 16 },
  cta: { height: 56, borderRadius: 14 },
  alreadyAccount: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },
  footer: { alignItems: 'center', paddingBottom: 8 },
  footerText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
    textAlign: 'center',
  },
  footerLink: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  errorText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: '#C62828',
    lineHeight: 18,
  },
  pressed: { opacity: 0.75 },
});
