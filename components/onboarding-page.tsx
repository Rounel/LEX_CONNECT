import { Pressable, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PrimaryButton } from '@/components/primary-button';

type OnboardingPageProps = {
  iconName: React.ComponentProps<typeof IconSymbol>['name'];
  title: string;
  description: string;
  onNext: () => void;
  onSkip: () => void;
  isLastPage: boolean;
  currentIndex: number;
  totalPages: number;
};

export function OnboardingPage({
  iconName,
  title,
  description,
  onNext,
  onSkip,
  isLastPage,
  currentIndex,
  totalPages,
}: OnboardingPageProps) {
  return (
    <View style={styles.container}>
      {!isLastPage && (
        <Pressable style={styles.skipButton} onPress={onSkip} hitSlop={12}>
          <ThemedText style={styles.skipText}>Passer</ThemedText>
        </Pressable>
      )}

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol name={iconName} size={80} color={Palette.primary} />
        </View>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <PrimaryButton
          title={isLastPage ? 'Commencer' : 'Suivant'}
          onPress={onNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  skipButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    color: Palette.accent2,
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
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
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 24,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: Palette.primary,
  },
  dotInactive: {
    backgroundColor: Palette.accent2,
    opacity: 0.4,
  },
  button: {
    width: '100%',
  },
});
