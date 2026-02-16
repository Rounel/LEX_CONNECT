import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { Palette, Fonts } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.greeting}>Salut Kouadio,</ThemedText>
          <ThemedText style={styles.greetingBold}>Bon retour!</ThemedText>
        </View>
        <View style={styles.avatar}>
          <IconSymbol name="person.circle.fill" size={40} color={Palette.primary} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un concours..."
          placeholderTextColor={Palette.accent2}
        />
        <View style={styles.searchButton}>
          <IconSymbol name="magnifyingglass" size={20} color={Palette.background} />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Concours du jour</ThemedText>

        <TouchableOpacity style={styles.featuredCard}>
          <View style={styles.featuredImageContainer}>
            <View style={styles.placeholderImage}>
              <IconSymbol name="book.fill" size={60} color={Palette.background} />
            </View>
          </View>

          <View style={styles.featuredContent}>
            <ThemedText style={styles.category}>Éducation</ThemedText>
            <ThemedText style={styles.featuredTitle}>
              Préparation au BEPC 2026 : Tout ce qu'il faut savoir
            </ThemedText>
            <View style={styles.meta}>
              <ThemedText style={styles.metaText}>15 Février 2026</ThemedText>
              <ThemedText style={styles.metaText}>•</ThemedText>
              <ThemedText style={styles.metaText}>5 min</ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Autres concours</ThemedText>
          <TouchableOpacity>
            <ThemedText style={styles.seeAll}>Voir tout</ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.articleCard}>
          <View style={styles.articleImageContainer}>
            <View style={styles.placeholderImageSmall}>
              <IconSymbol name="graduationcap.fill" size={30} color={Palette.background} />
            </View>
          </View>
          <View style={styles.articleContent}>
            <ThemedText style={styles.articleTitle}>
              Concours d'entrée à l'INPHB
            </ThemedText>
            <View style={styles.meta}>
              <ThemedText style={styles.metaTextSmall}>10 Février 2026</ThemedText>
              <ThemedText style={styles.metaTextSmall}>•</ThemedText>
              <ThemedText style={styles.metaTextSmall}>3 min</ThemedText>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={20} color={Palette.accent2} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.articleCard}>
          <View style={styles.articleImageContainer}>
            <View style={styles.placeholderImageSmall}>
              <IconSymbol name="lightbulb.fill" size={30} color={Palette.background} />
            </View>
          </View>
          <View style={styles.articleContent}>
            <ThemedText style={styles.articleTitle}>
              Conseils pour réussir le BAC 2026
            </ThemedText>
            <View style={styles.meta}>
              <ThemedText style={styles.metaTextSmall}>8 Février 2026</ThemedText>
              <ThemedText style={styles.metaTextSmall}>•</ThemedText>
              <ThemedText style={styles.metaTextSmall}>4 min</ThemedText>
            </View>
          </View>
          <IconSymbol name="chevron.right" size={20} color={Palette.accent2} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Palette.foreground,
  },
  greetingBold: {
    fontSize: 24,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: Fonts.body.regular,
    fontSize: 14,
    color: Palette.foreground,
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: Palette.foreground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Palette.primary,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: Palette.accent1,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContent: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Palette.accent2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: Fonts.heading.bold,
    color: Palette.foreground,
    marginBottom: 12,
    lineHeight: 24,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  articleImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  placeholderImageSmall: {
    width: '100%',
    height: '100%',
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 14,
    fontFamily: Fonts.heading.semiBold,
    color: Palette.foreground,
    marginBottom: 6,
    lineHeight: 20,
  },
  metaTextSmall: {
    fontSize: 10,
    fontFamily: Fonts.body.regular,
    color: Palette.accent2,
  },
});
