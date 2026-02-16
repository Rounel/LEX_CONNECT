import { Stack } from 'expo-router';

export default function CountryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="select" />
    </Stack>
  );
}
