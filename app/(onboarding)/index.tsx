import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  type ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAppState } from '@/hooks/use-app-state';
import { OnboardingPage } from '@/components/onboarding-page';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PAGES = [
  {
    id: '1',
    iconName: 'building.columns.fill' as const,
    title: 'Tout le droit ivoirien en poche',
    description:
      'Codes, lois, décrets, jurisprudences — accédez à l\'intégralité des textes juridiques de Côte d\'Ivoire, organisés et toujours à jour.',
  },
  {
    id: '2',
    iconName: 'sparkles' as const,
    title: '4 outils, 1 seule application',
    description:
      'Bibliothèque juridique, actualités législatives, assistant IA Alexia et préparation aux concours — tout ce dont vous avez besoin.',
  },
  {
    id: '3',
    iconName: 'checkmark.seal.fill' as const,
    title: 'Alexia, votre guide juridique',
    description:
      'Posez vos questions en langage naturel. Alexia analyse le droit ivoirien et cite toujours ses sources pour vous guider avec précision.',
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

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(auth)/login');
  };

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
        renderItem={({ item, index }) => (
          <View style={styles.page}>
            <OnboardingPage
              iconName={item.iconName}
              title={item.title}
              description={item.description}
              onNext={handleNext}
              onSkip={handleSkip}
              isLastPage={index === PAGES.length - 1}
              currentIndex={currentIndex}
              totalPages={PAGES.length}
            />
          </View>
        )}
      />
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
});
