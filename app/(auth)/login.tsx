import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { TextInputField } from '@/components/text-input-field';
import { ThemedText } from '@/components/themed-text';
import { Fonts, Palette } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/services/api/client';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useThemeColor({}, 'mainBackground');

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(country)/select');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 400) {
          setError('Email ou mot de passe incorrect.');
        } else {
          setError('Une erreur est survenue. Veuillez réessayer.');
        }
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Login] Erreur inattendue:', err);
        setDebugError(msg);
        setError('Impossible de se connecter. Vérifiez votre connexion internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(country)/select');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
            
          <View style={styles.header}>
            {/* <Image
              source={require('@/assets/icons/icon-128x128.png')}
              style={styles.logo}
              resizeMode="contain"
            /> */}
            <ThemedText type="title" style={styles.appName}>
              Hey, Bon retour parmi nous !
            </ThemedText>
          </View>

          <View style={styles.form}>
            <TextInputField
              label="Email"
              value={email}
              onChangeText={(v) => { setEmail(v); setError(null); }}
              placeholder="votre@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInputField
              label="Mot de passe"
              value={password}
              onChangeText={(v) => { setPassword(v); setError(null); }}
              placeholder="Votre mot de passe"
              secureTextEntry
            />
            {error !== null && (
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            )}
            {debugError !== null && (
              <ThemedText style={styles.debugErrorText}>DEBUG: {debugError}</ThemedText>
            )}
            <Pressable
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPassword}
              hitSlop={8}>
              <ThemedText style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </ThemedText>
            </Pressable>
            <PrimaryButton
              title={isLoading ? 'Connexion…' : 'Se connecter'}
              onPress={handleLogin}
              disabled={isLoading || email.trim().length === 0 || password.length === 0}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>ou</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.alternatives}>
            <PrimaryButton
              title="Continuer sans se connecter"
              onPress={handleSkip}
              variant="text"
            />
          </View>

          <View style={styles.registerContainer}>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <ThemedText>
                Pas de compte ?{' '}
                <ThemedText type="link">S&apos;inscrire</ThemedText>
              </ThemedText>
            </Pressable>
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
    justifyContent: 'center',
    gap: 28,
  },
  header: {
    gap: 8,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 8,
    borderRadius: 10,
  },
  appName: {
    color: Palette.primary,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.accent2,
    opacity: 0.4,
  },
  dividerText: {
    fontSize: 14,
  },
  alternatives: {
    gap: 12,
  },
  registerContainer: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  errorText: {
    fontSize: 13,
    fontFamily: Fonts.body.regular,
    color: '#C62828',
    lineHeight: 18,
  },
  debugErrorText: {
    fontSize: 11,
    fontFamily: Fonts.body.regular,
    color: '#888',
    lineHeight: 16,
  },
});
