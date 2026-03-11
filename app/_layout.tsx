import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import {
  FiraSans_400Regular,
  FiraSans_600SemiBold,
  FiraSans_700Bold,
} from '@expo-google-fonts/fira-sans';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppStateProvider } from '@/contexts/app-state-context';
import { AuthProvider } from '@/contexts/auth-context';
import { useAppState } from '@/hooks/use-app-state';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isReady } = useAppState();

  const [fontsLoaded] = useFonts({
    FiraSans_400Regular,
    FiraSans_600SemiBold,
    FiraSans_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (isReady && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isReady, fontsLoaded]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(country)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="document/[id]" />
        <Stack.Screen name="reader/[id]" />
        <Stack.Screen name="versions/[id]" />
        <Stack.Screen name="liste" />
        <Stack.Screen name="suivis" />
        <Stack.Screen name="actualite/[id]" />
        <Stack.Screen name="filtres" options={{ presentation: 'modal' }} />
        <Stack.Screen name="alexia/historique" />
        <Stack.Screen name="concours/[id]" />
        <Stack.Screen name="concours/quiz" />
        <Stack.Screen name="concours/resultat" />
        <Stack.Screen name="concours/annales" />
        <Stack.Screen name="profil" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="settings/notifications" />
        <Stack.Screen name="settings/affichage" />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal', headerShown: true }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppStateProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AppStateProvider>
  );
}
