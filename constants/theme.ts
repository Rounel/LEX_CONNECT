import { Platform } from 'react-native';

/**
 * Palette unique de l'application — source de vérité pour toutes les couleurs.
 */
export const Palette = {
  background: '#E4DFD8',
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

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
