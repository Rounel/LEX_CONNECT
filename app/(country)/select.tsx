import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { COUNTRIES, type Country } from '@/constants/countries';
import { useAppState } from '@/hooks/use-app-state';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/primary-button';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CountrySelectScreen() {
  const router = useRouter();
  const { setCountry } = useAppState();
  const [selected, setSelected] = useState<string | null>(null);
  const bgColor = useThemeColor({}, 'mainBackground');
  const cardColor = useThemeColor({}, 'background');

  const handleConfirm = async () => {
    if (!selected) return;
    await setCountry(selected);
    router.replace('/(tabs)');
  };

  const renderItem = ({ item }: { item: Country }) => {
    const isSelected = item.code === selected;
    return (
      <Pressable
        onPress={() => setSelected(item.code)}
        style={[
          styles.item,
          { backgroundColor: cardColor },
          isSelected && styles.itemSelected,
        ]}>
        <ThemedText style={styles.flag}>{item.flag}</ThemedText>
        <ThemedText
          type={isSelected ? 'defaultSemiBold' : 'default'}
          style={styles.countryName}>
          {item.name}
        </ThemedText>
        {isSelected && (
          <ThemedText style={styles.check}>✓</ThemedText>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <ThemedText type="title">Choisissez votre pays</ThemedText>
        <ThemedText style={styles.subtitle}>
          Sélectionnez le pays dont vous souhaitez consulter les lois.
        </ThemedText>
      </View>

      <FlatList
        data={COUNTRIES}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <PrimaryButton
          title="Confirmer"
          onPress={handleConfirm}
          disabled={!selected}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    gap: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  list: {
    gap: 8,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  itemSelected: {
    borderColor: Palette.primary,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
  },
  check: {
    fontSize: 18,
    color: Palette.primary,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 16,
  },
  button: {
    width: '100%',
  },
});
