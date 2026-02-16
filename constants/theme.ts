import { Platform } from 'react-native';

/**
 * Palette unique de l'application — source de vérité pour toutes les couleurs.
 */
export const Palette = {
  background: '#f1f1f1',
  foreground: '#24221B',
  primary: '#162660',
  secondary: '#F2D04E',
  accent1: '#D0E6FD',
  accent2: '#787F56',
} as const;

export const Colors = {
  light: {
    text: Palette.foreground,
    background: Palette.background,
    mainBackground: Palette.background,
    tint: Palette.primary,
    icon: Palette.accent2,
    tabIconDefault: Palette.accent2,
    tabIconSelected: Palette.primary,
  },
  dark: {
    text: Palette.background,
    background: Palette.foreground,
    mainBackground: Palette.foreground,
    tint: Palette.secondary,
    icon: Palette.accent2,
    tabIconDefault: Palette.accent2,
    tabIconSelected: Palette.secondary,
  },
};

/**
 * Polices de l'application
 * - heading: Noto Serif (titres, labels)
 * - body: Open Sans (paragraphes, phrases, inputs)
 */
export const Fonts = {
  heading: {
    regular: 'NotoSerif_400Regular',
    semiBold: 'NotoSerif_600SemiBold',
    bold: 'NotoSerif_700Bold',
  },
  body: {
    regular: 'OpenSans_400Regular',
    semiBold: 'OpenSans_600SemiBold',
    bold: 'OpenSans_700Bold',
  },
} as const;
