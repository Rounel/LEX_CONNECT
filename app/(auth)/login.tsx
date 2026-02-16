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

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/primary-button';
import { TextInputField } from '@/components/text-input-field';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const bgColor = useThemeColor({}, 'mainBackground');

  const handleLogin = () => {
    // No-op pour l'instant
    router.replace('/(country)/select');
  };

  const handleGoogle = () => {
    // No-op pour l'instant
    router.replace('/(country)/select');
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
            <ThemedText type="title" style={styles.appName}>
              LexConnect
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Connectez-vous pour continuer
            </ThemedText>
          </View>

          <View style={styles.form}>
            <TextInputField
              label="Email"
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
              placeholder="Votre mot de passe"
              secureTextEntry
            />
            <PrimaryButton title="Se connecter" onPress={handleLogin} />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>ou</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.alternatives}>
            <PrimaryButton
              title="Continuer avec Google"
              onPress={handleGoogle}
              variant="outlined"
            />
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
    alignItems: 'center',
    gap: 8,
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
});
