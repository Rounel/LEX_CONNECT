import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Palette } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const bgColor = useThemeColor({}, 'mainBackground');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <IconSymbol name="chevron.right" size={24} color={Palette.primary} style={styles.backIcon} />
        <ThemedText type="link">Retour</ThemedText>
      </Pressable>
      <View style={styles.content}>
        <ThemedText type="title">Inscription</ThemedText>
        <ThemedText style={styles.placeholder}>
          Cette page sera disponible prochainement.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backIcon: {
    transform: [{ scaleX: -1 }],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  placeholder: {
    textAlign: 'center',
  },
});
