import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Palette } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AlexiaScreen() {
  return (
    <View style={styles.container}>
      <IconSymbol name="sparkles" size={48} color={Palette.primary} />
      <ThemedText type="title" style={styles.title}>Alexia</ThemedText>
      <ThemedText style={styles.subtitle}>
        Posez vos questions juridiques à Alexia
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  title: {
    color: Palette.primary,
  },
  subtitle: {
    textAlign: 'center',
    color: Palette.accent2,
  },
});
