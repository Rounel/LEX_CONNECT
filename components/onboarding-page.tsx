import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

type OnboardingPageProps = {
  iconName: React.ComponentProps<typeof IconSymbol>['name'];
  title: string;
  description: string;
};

export function OnboardingPage({ iconName, title, description }: OnboardingPageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSymbol name={iconName} size={80} color={Palette.primary} />
      </View>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Palette.accent1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
});
