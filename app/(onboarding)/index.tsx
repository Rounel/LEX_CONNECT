import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  type ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Palette } from '@/constants/theme';
import { useAppState } from '@/hooks/use-app-state';
import { OnboardingPage } from '@/components/onboarding-page';
import { PrimaryButton } from '@/components/primary-button';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  {
    id: '1',
    iconName: 'menu-book' as const,
    title: 'Consultez les lois',
    description:
      'Accédez aux textes juridiques de plusieurs pays africains, organisés et faciles à parcourir.',
  },
  {
    id: '2',
    iconName: 'competition.fill' as const,
    title: 'Préparez vos concours',
    description:
      'Des ressources pour réussir vos concours administratifs et juridiques, à portée de main.',
  },
  {
    id: '3',
    iconName: 'checkmark.circle.fill' as const,
    title: 'Prêt à commencer !',
    description:
      'Créez votre compte ou explorez librement l\'application dès maintenant.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const bgColor = useThemeColor({}, 'mainBackground');

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const handleNext = async () => {
    if (currentIndex < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await completeOnboarding();
      router.replace('/(auth)/login');
    }
  };

  const isLastPage = currentIndex === PAGES.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <FlatList
        ref={flatListRef}
        data={PAGES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <OnboardingPage
              iconName={item.iconName}
              title={item.title}
              description={item.description}
            />
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {PAGES.map((_, index) => (
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
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
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
