import { Platform } from 'react-native';

/**
 * Palette unique de l'application — source de vérité pour toutes les couleurs.
 */
export const Palette = {
  background: '#FAFAFA',
  foreground: '#24221B',
  foreground2: '#4A4A4A',
  primary: '#162660',
  secondary: '#F2D04E',
  accent1: '#D0E6FD',
  accent2: '#787F56',
  accent3: '#F8F5F2',
  accent4: '#D4C7AF',
  accent5: '#D3C9BD',
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
 * - heading: Fira Sans (titres, labels)
 * - body: Montserrat (paragraphes, phrases, inputs)
 */
export const Fonts = {
  heading: {
    regular: 'FiraSans_400Regular',
    semiBold: 'FiraSans_600SemiBold',
    bold: 'FiraSans_700Bold',
  },
  body: {
    regular: 'Montserrat_400Regular',
    semiBold: 'Montserrat_600SemiBold',
    bold: 'Montserrat_700Bold',
  },
} as const;
