import { Redirect } from 'expo-router';

import { useAppState } from '@/hooks/use-app-state';

export default function RootIndex() {
  const { isReady, hasCompletedOnboarding, selectedCountry } = useAppState();

  if (!isReady) return null;

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)" />;
  }

  if (!selectedCountry) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
