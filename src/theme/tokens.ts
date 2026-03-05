/**
 * WILEX — Design Tokens
 * Application mobile de bibliothèque juridique — Droit ivoirien
 *
 * DIRECTION ARTISTIQUE
 * Base : Noir profond (Ink) · Blanc pur (Pearl) · Ivoire (Ivory)
 * Accent 1 — Vert Forêt (#1A4731) :
 *   Justification : Ancré dans l'identité ivoirienne (forêts tropicales, vert du drapeau),
 *   le vert profond incarne la sagesse, la croissance et la stabilité juridique.
 *   Il évoque les grandes robes des magistrats et la rigueur du droit.
 * Accent 2 — Or Savane (#C4882C) :
 *   Justification : L'or renvoie à l'"ivoire" (Côte d'Ivoire), aux balances de la Justice,
 *   au prestige des publications juridiques et à la chaleur de la culture ivoirienne.
 *   Il crée un contraste premium avec le vert forêt.
 *
 * TYPOGRAPHIE
 * Playfair Display — titres/display : serif éditorial, autorité des grandes publications
 *   juridiques, élégance classique francophone. Disponible via @expo-google-fonts.
 * Lora — corps des textes juridiques longs : serif chaud, optimisé pour la lecture
 *   longue, excellente lisibilité sur mobile. Disponible via @expo-google-fonts.
 * Inter — éléments UI (labels, boutons, captions) : sans-serif moderne, parfait pour
 *   l'interface fonctionnelle, lisibilité maximale aux petites tailles.
 *
 * ICÔNE ALEXIA — Perruque de magistrat minimaliste
 * SVG viewBox="0 0 48 48", stroke="#0F0E0C", strokeWidth=1.5, fill="none"
 * Corps principal : rect arrondi (rx=4) centré, représentant le corps de la perruque
 *   M8 20 C8 14 12 10 24 10 C36 10 40 14 40 20 L40 32 C40 35 37 37 24 37 C11 37 8 35 8 32 Z
 * Rangées de boucles (3 rangées) :
 *   Rangée 1 (haute) : 4 arcs semi-circulaires en M10 20 Q13 16 16 20 Q19 16 22 20 Q25 16 28 20 Q31 16 34 20 Q37 16 40 20
 *   Rangée 2 (milieu) : 3 arcs légèrement plus grands
 *   Rangée 3 (basse) : 2 arcs en bas du corps
 * Boucles latérales droite et gauche : 2 cercles elliptiques suspendus de chaque côté
 *   Gauche : ellipse cx=6 cy=28 rx=5 ry=7
 *   Droite : ellipse cx=42 cy=28 rx=5 ry=7
 * Dans les bulles de conversation et la bottom tab : version 24x24 avec strokeWidth=1.2
 */

// ─────────────────────────────────────────────────────────────────────────────
// PALETTE BRUTE
// ─────────────────────────────────────────────────────────────────────────────

const Palette = {
  // Ink — Noir profond (base texte & UI)
  ink: '#0F0E0C',
  ink90: '#1E1D1A',
  ink80: '#2D2C28',
  ink70: '#4A4944',
  ink60: '#666460',
  ink50: '#807F7B',
  ink40: '#9B9A96',
  ink30: '#B5B4B1',
  ink20: '#D0CFCC',
  ink15: '#DADADB',
  ink10: '#E5E4E2',
  ink8: '#EDECEA',
  ink5: '#F4F3F1',

  // Pearl — Blanc pur
  pearl: '#FFFFFF',
  pearlWarm: '#FEFCF8',

  // Ivory — Ivoire (surface principale)
  ivory: '#F5F0E8',
  ivoryMid: '#EDE7DC',
  ivoryDeep: '#E2DBD0',
  ivoryDark: '#D5CCBF',

  // Forest Green — Accent principal
  forest: '#1A4731',
  forest90: '#2B5841',
  forest80: '#3D6A52',
  forest70: '#4E7B63',
  forest60: '#608D75',
  forest50: '#719E87',
  forest40: '#8DB0A0',
  forest30: '#AAC3BA',
  forest20: '#C6D8D2',
  forest15: '#D4E3DE',
  forest10: '#E3EEE9',
  forest8: '#EBF3EF',
  forest5: '#F3F8F5',

  // Savane Gold — Accent secondaire
  gold: '#C4882C',
  gold90: '#CA9240',
  gold80: '#D09D55',
  gold70: '#D6A869',
  gold60: '#DDB37E',
  gold50: '#E3BE93',
  gold40: '#E9CAA8',
  gold30: '#EFD5BC',
  gold20: '#F5E1D1',
  gold15: '#F7E8DB',
  gold10: '#FAF0E6',
  gold8: '#FBEDE0',
  gold5: '#FDF5EE',

  // Semantic
  successDark: '#145C35',
  success: '#1E7A47',
  successLight: '#27A25F',
  successBg: '#E6F6EE',
  successBorder: '#A3D9BC',

  errorDark: '#9B2A1F',
  error: '#C0392B',
  errorLight: '#D95A4D',
  errorBg: '#FDEDEB',
  errorBorder: '#F0ADA8',

  warningDark: '#A35F0A',
  warning: '#D4821A',
  warningLight: '#E89A35',
  warningBg: '#FEF4E8',
  warningBorder: '#F5CA88',

  infoDark: '#134B77',
  info: '#1A6399',
  infoLight: '#2280C4',
  infoBg: '#E8F2FA',
  infoBorder: '#9EC8EC',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COULEURS — MODE CLAIR
// ─────────────────────────────────────────────────────────────────────────────

export const LightColors = {
  // Surfaces
  surfaceDefault: Palette.pearl,
  surfaceRaised: Palette.ivory,
  surfaceElevated: Palette.pearlWarm,
  surfaceOverlay: 'rgba(15, 14, 12, 0.60)',
  surfaceIvory: Palette.ivory,
  surfaceIvoryMid: Palette.ivoryMid,
  surfaceInk: Palette.ink,

  // Texte
  textPrimary: Palette.ink,
  textSecondary: Palette.ink70,
  textTertiary: Palette.ink50,
  textDisabled: Palette.ink30,
  textInverse: Palette.pearl,
  textAccent: Palette.forest,
  textGold: Palette.gold,
  textOnAccent: Palette.pearl,

  // Bordures
  borderDefault: Palette.ink15,
  borderSubtle: Palette.ink8,
  borderStrong: Palette.ink40,
  borderAccent: Palette.forest,
  borderGold: Palette.gold,

  // Accent principal — Forest Green
  accentPrimary: Palette.forest,
  accentPrimary90: Palette.forest90,
  accentPrimary70: Palette.forest70,
  accentPrimary50: Palette.forest50,
  accentPrimary15: Palette.forest15,
  accentPrimary8: Palette.forest8,

  // Accent secondaire — Savane Gold
  accentSecondary: Palette.gold,
  accentSecondary90: Palette.gold90,
  accentSecondary70: Palette.gold70,
  accentSecondary50: Palette.gold50,
  accentSecondary15: Palette.gold15,
  accentSecondary8: Palette.gold8,

  // Sémantiques
  success: Palette.success,
  successBg: Palette.successBg,
  successBorder: Palette.successBorder,
  error: Palette.error,
  errorBg: Palette.errorBg,
  errorBorder: Palette.errorBorder,
  warning: Palette.warning,
  warningBg: Palette.warningBg,
  warningBorder: Palette.warningBorder,
  info: Palette.info,
  infoBg: Palette.infoBg,
  infoBorder: Palette.infoBorder,

  // Skeleton shimmer
  skeletonBase: Palette.ink8,
  skeletonHighlight: Palette.pearlWarm,

  // Tab bar
  tabActive: Palette.forest,
  tabInactive: Palette.ink40,
  tabBackground: Palette.pearl,
  tabBorder: Palette.ink8,

  // Catégories de textes juridiques (badges)
  badgeCode: '#1A4731',       // Forest — Codes (autorité maximale)
  badgeLoi: '#134B77',        // Info blue — Lois
  badgeDecret: '#7B3FA0',     // Violet — Décrets
  badgeJurisprudence: '#A35F0A', // Warning amber — Jurisprudence
  badgeOrdonnance: '#1E5C6B', // Teal — Ordonnances
  badgeReglement: '#4A4944',  // Ink70 — Règlements

  // Alexia
  alexiaBackground: Palette.ivory,
  alexiaBubble: Palette.ivory,
  alexiaBubbleBorder: Palette.ivoryDeep,
  userBubble: Palette.forest,
  userBubbleText: Palette.pearl,
  citationBackground: Palette.pearlWarm,
  citationBorder: Palette.forest,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COULEURS — MODE SOMBRE
// ─────────────────────────────────────────────────────────────────────────────

export const DarkColors = {
  // Surfaces
  surfaceDefault: '#0F0E0C',
  surfaceRaised: '#1C1B18',
  surfaceElevated: '#252420',
  surfaceOverlay: 'rgba(0, 0, 0, 0.75)',
  surfaceIvory: '#1C1B18',
  surfaceIvoryMid: '#252420',
  surfaceInk: Palette.ivory,

  // Texte
  textPrimary: Palette.ivory,
  textSecondary: Palette.ink30,
  textTertiary: Palette.ink50,
  textDisabled: Palette.ink60,
  textInverse: Palette.ink,
  textAccent: '#4D9B6B',    // forest éclairci pour mode sombre
  textGold: '#D4A843',
  textOnAccent: Palette.pearl,

  // Bordures
  borderDefault: '#2A2927',
  borderSubtle: '#1E1D1B',
  borderStrong: '#3A3935',
  borderAccent: '#3D6A52',
  borderGold: '#D4A843',

  // Accent principal — Forest Green (éclairci)
  accentPrimary: '#2D7A50',
  accentPrimary90: '#38875C',
  accentPrimary70: '#4D9B6B',
  accentPrimary50: '#71B288',
  accentPrimary15: '#1C3528',
  accentPrimary8: '#162A1F',

  // Accent secondaire — Gold
  accentSecondary: '#D4A843',
  accentSecondary90: '#D9B055',
  accentSecondary70: '#E1C37A',
  accentSecondary50: '#EAD5A0',
  accentSecondary15: '#2D2414',
  accentSecondary8: '#221B0F',

  // Sémantiques
  success: '#27A25F',
  successBg: '#0D2E1C',
  successBorder: '#1A5C38',
  error: '#D95A4D',
  errorBg: '#2C1210',
  errorBorder: '#7A2820',
  warning: '#E89A35',
  warningBg: '#2C1E0A',
  warningBorder: '#7A4F10',
  info: '#2280C4',
  infoBg: '#0A1E2F',
  infoBorder: '#144F7A',

  // Skeleton shimmer
  skeletonBase: '#1C1B18',
  skeletonHighlight: '#2A2927',

  // Tab bar
  tabActive: '#4D9B6B',
  tabInactive: Palette.ink50,
  tabBackground: '#0F0E0C',
  tabBorder: '#1E1D1B',

  // Badges
  badgeCode: '#2D7A50',
  badgeLoi: '#1A5C94',
  badgeDecret: '#6B35A0',
  badgeJurisprudence: '#C4882C',
  badgeOrdonnance: '#1E6B7D',
  badgeReglement: Palette.ink50,

  // Alexia
  alexiaBackground: '#1C1B18',
  alexiaBubble: '#252420',
  alexiaBubbleBorder: '#2A2927',
  userBubble: '#2D7A50',
  userBubbleText: Palette.pearl,
  citationBackground: '#1C1B18',
  citationBorder: '#3D6A52',
} as const;

// Export type
export type ThemeColors = typeof LightColors;

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS PRINCIPAUX
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  light: LightColors,
  dark: DarkColors,
  palette: Palette,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHIE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Familles de polices Google Fonts (via @expo-google-fonts)
 * Installation :
 *   expo install @expo-google-fonts/playfair-display @expo-google-fonts/lora @expo-google-fonts/inter
 *
 * Usage dans _layout.tsx :
 *   const [fontsLoaded] = useFonts({
 *     'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
 *     'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
 *     'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,
 *     'Lora-Regular': Lora_400Regular,
 *     'Lora-Medium': Lora_500Medium,
 *     'Lora-SemiBold': Lora_600SemiBold,
 *     'Inter-Regular': Inter_400Regular,
 *     'Inter-Medium': Inter_500Medium,
 *     'Inter-SemiBold': Inter_600SemiBold,
 *     'Inter-Bold': Inter_700Bold,
 *   });
 */
export const FontFamilies = {
  display: 'PlayfairDisplay-Bold',
  displaySemiBold: 'PlayfairDisplay-SemiBold',
  displayRegular: 'PlayfairDisplay-Regular',
  serif: 'Lora-Regular',
  serifMedium: 'Lora-Medium',
  serifSemiBold: 'Lora-SemiBold',
  sans: 'Inter-Regular',
  sansMedium: 'Inter-Medium',
  sansSemiBold: 'Inter-SemiBold',
  sansBold: 'Inter-Bold',
} as const;

export const Typography = {
  /**
   * Display — titres héros, nombres statistiques
   * Playfair Display Bold — impact éditorial maximal
   */
  display: {
    fontFamily: FontFamilies.display,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  /**
   * H1 — titres de page principaux
   * Playfair Display Bold — autorité de section
   */
  h1: {
    fontFamily: FontFamilies.display,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  /**
   * H2 — titres de section dans une page
   * Playfair Display Bold
   */
  h2: {
    fontFamily: FontFamilies.display,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  /**
   * H3 — titres de cards, sous-sections
   * Playfair Display SemiBold
   */
  h3: {
    fontFamily: FontFamilies.displaySemiBold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  /**
   * H4 — sous-titres, labels de section
   * Inter SemiBold — transition vers l'UI
   */
  h4: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  /**
   * Body Large — texte proéminent, intro d'article
   * Lora Regular — entrée en douceur dans la lecture
   */
  bodyLarge: {
    fontFamily: FontFamilies.serif,
    fontSize: 17,
    lineHeight: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  /**
   * Body — texte standard
   * Inter Regular — lisibilité UI
   */
  body: {
    fontFamily: FontFamilies.sans,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  /**
   * Body Small — informations secondaires
   * Inter Regular
   */
  bodySmall: {
    fontFamily: FontFamilies.sans,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  /**
   * Caption — métadonnées, dates, tags
   * Inter Regular
   */
  caption: {
    fontFamily: FontFamilies.sans,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
  },
  /**
   * Label — boutons, chips, navigation
   * Inter SemiBold — action et hiérarchie
   */
  label: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  /**
   * Article Title — titre d'article juridique dans le lecteur
   * Playfair Display Bold — distinction éditoriale
   */
  articleTitle: {
    fontFamily: FontFamilies.display,
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  /**
   * Article Body — corps des textes juridiques longs
   * Lora Regular — optimisé lecture longue, interligne généreux
   */
  articleBody: {
    fontFamily: FontFamilies.serif,
    fontSize: 16,
    lineHeight: 28,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  /**
   * Article Number — numéros d'articles en marge
   * Inter Regular — discret, fonctionnel
   */
  articleNumber: {
    fontFamily: FontFamilies.sans,
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  /**
   * Button Large
   */
  buttonLg: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  /**
   * Button Medium (défaut)
   */
  buttonMd: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  /**
   * Button Small
   */
  buttonSm: {
    fontFamily: FontFamilies.sansSemiBold,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ESPACEMENTS — base 8px
// ─────────────────────────────────────────────────────────────────────────────

export const Spacing = {
  /** 4px — micro-espacement, séparateurs internes */
  space1: 4,
  /** 8px — espacement de base, padding d'icônes */
  space2: 8,
  /** 12px — gaps internes de composants */
  space3: 12,
  /** 16px — marge horizontale standard des écrans */
  space4: 16,
  /** 20px — padding interne de cards */
  space5: 20,
  /** 24px — marge de section, gap entre cartes */
  space6: 24,
  /** 32px — espacement entre sections */
  space8: 32,
  /** 40px — espacement section héro */
  space10: 40,
  /** 48px — grands espacements */
  space12: 48,
  /** 64px — espacements page (top of content) */
  space16: 64,
  /** 80px — zone bottom tab */
  space20: 80,
  /** 96px — grands hero / illustrations */
  space24: 96,
  /** 128px — ilustrations plein écran */
  space32: 128,

  // Constantes nommées (sémantiques)
  /** Marge horizontale standard des écrans : 16px */
  screenHorizontal: 16,
  /** Marge de section : 24px */
  sectionGap: 24,
  /** Padding interne des cards : 16px */
  cardPadding: 16,
  /** Hauteur de la BottomTabBar (sans inset) */
  tabBarHeight: 56,
  /** Hauteur du TopHeader */
  headerHeight: 56,
  /** Padding bottom pour scrollview avec tab bar */
  scrollPaddingBottom: 80,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────────────────────────────────────

export const BorderRadius = {
  /** 0 — Aucun arrondi (tableaux, séparateurs) */
  none: 0,
  /** 4px — Très légère rondeur (badges, tags) */
  sm: 4,
  /** 8px — Arrondi standard (boutons sm, inputs) */
  md: 8,
  /** 12px — Cards, bottom sheet handle */
  lg: 12,
  /** 16px — Cards larges, modales */
  xl: 16,
  /** 24px — Bottom sheets, hero cards */
  xxl: 24,
  /** 9999px — Chips, pills, avatars */
  full: 9999,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OMBRES / ÉLÉVATIONS — React Native natif
// ─────────────────────────────────────────────────────────────────────────────

/**
 * iOS : shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android : elevation
 * Usage : spread({ ...Shadows.shadow2 }) dans StyleSheet
 */
export const Shadows = {
  /** Niveau 0 — Aucune ombre */
  shadow0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  /** Niveau 1 — Ombre subtile (cards plates, separators) */
  shadow1: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  /** Niveau 2 — Ombre légère (cards standard CardDocument, CardActualite) */
  shadow2: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  /** Niveau 3 — Ombre moyenne (FAB, boutons flottants) */
  shadow3: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  /** Niveau 4 — Ombre prononcée (BottomSheet, Dropdown) */
  shadow4: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 16,
  },
  /** Niveau 5 — Ombre maximale (Modales, toasts, menus contextuels) */
  shadow5: {
    shadowColor: '#0F0E0C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 24,
  },
  /** Ombre accent (forest green) pour éléments actifs */
  shadowAccent: {
    shadowColor: '#1A4731',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION
// ─────────────────────────────────────────────────────────────────────────────

export const Animation = {
  /** 150ms — micro-interactions (pressed state, toggle) */
  durationFast: 150,
  /** 250ms — transitions standard (navigation, modales) */
  durationBase: 250,
  /** 400ms — transitions lentes (bottom sheet, onboarding) */
  durationSlow: 400,
  /** 600ms — animations longues (splash, illustrations) */
  durationVerySlow: 600,

  /** Easing pour les transitions d'entrée */
  easingEnter: 'ease-out' as const,
  /** Easing pour les transitions de sortie */
  easingExit: 'ease-in' as const,
  /** Easing standard */
  easingStandard: 'ease-in-out' as const,

  /**
   * Configs Reanimated (withSpring, withTiming)
   * withTiming(value, Animation.timingBase)
   */
  timingFast: { duration: 150 },
  timingBase: { duration: 250 },
  timingSlow: { duration: 400 },

  /**
   * Spring configs pour les interactions physiques
   * withSpring(value, Animation.springSnappy)
   */
  springSnappy: {
    damping: 18,
    stiffness: 200,
    mass: 0.8,
  },
  springBouncy: {
    damping: 12,
    stiffness: 180,
    mass: 1,
  },
  springGentle: {
    damping: 25,
    stiffness: 120,
    mass: 1,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// OPACITÉS
// ─────────────────────────────────────────────────────────────────────────────

export const Opacity = {
  /** Fond de lecteur de texte sur image */
  overlay: 0.60,
  /** État désactivé */
  disabled: 0.40,
  /** État pressed */
  pressed: 0.75,
  /** Barre de progression de lecture */
  readingProgress: 0.30,
  /** Fond skeleton */
  skeleton: 0.08,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TAILLES DE COMPOSANTS
// ─────────────────────────────────────────────────────────────────────────────

export const ComponentSizes = {
  // Boutons
  buttonHeightSm: 36,
  buttonHeightMd: 44,
  buttonHeightLg: 52,
  buttonPaddingHorizontalSm: 14,
  buttonPaddingHorizontalMd: 20,
  buttonPaddingHorizontalLg: 24,

  // Inputs
  inputHeight: 52,
  searchBarHeight: 48,
  filterChipHeight: 32,

  // Navigation
  tabBarHeight: 56,
  headerHeight: 56,

  // Cards
  cardDocumentMinHeight: 100,
  cardActualiteImageRatio: 9 / 16, // 16:9 inversé pour calcul
  cardConcoursMinHeight: 120,

  // Avatar
  avatarSm: 32,
  avatarMd: 40,
  avatarLg: 56,
  avatarXl: 80,

  // Icônes
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
  alexiaIconAccueil: 80,

  // Bottom sheet snap points (%)
  bottomSheetSnap40: '40%',
  bottomSheetSnap70: '70%',
  bottomSheetSnap95: '95%',

  // ProgressBar
  progressBarHeight: 6,
  progressBarBorderRadius: 3,

  // Badge
  badgeMinWidth: 18,
  badgeHeight: 18,

  // Drag handle
  dragHandleWidth: 36,
  dragHandleHeight: 4,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// THÈMES COMPLETS
// ─────────────────────────────────────────────────────────────────────────────

export const LightTheme = {
  colors: LightColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animation: Animation,
  opacity: Opacity,
  sizes: ComponentSizes,
  fontFamilies: FontFamilies,
  dark: false,
} as const;

export const DarkTheme = {
  colors: DarkColors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  animation: Animation,
  opacity: Opacity,
  sizes: ComponentSizes,
  fontFamilies: FontFamilies,
  dark: true,
} as const;

export type WilexTheme = typeof LightTheme;

// ─────────────────────────────────────────────────────────────────────────────
// UTILITAIRES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne la couleur en fonction du thème actif
 * Usage : getColor('accentPrimary', isDark)
 */
export function getColor(
  key: keyof ThemeColors,
  isDark: boolean = false,
): string {
  return isDark ? DarkColors[key] : LightColors[key];
}

/**
 * Couleur de badge par type de document juridique
 */
export const DocumentTypeBadge = {
  CODE: { bg: Palette.forest15, text: Palette.forest, label: 'Code' },
  LOI: { bg: Palette.infoBg, text: Palette.info, label: 'Loi' },
  DECRET: { bg: '#EFE8F6', text: '#7B3FA0', label: 'Décret' },
  JURISPRUDENCE: { bg: Palette.warningBg, text: Palette.warning, label: 'Jurisprudence' },
  ORDONNANCE: { bg: '#E7F2F5', text: '#1E5C6B', label: 'Ordonnance' },
  REGLEMENT: { bg: Palette.ink8, text: Palette.ink70, label: 'Règlement' },
} as const;

/**
 * Badge statut de texte
 */
export const DocumentStatusBadge = {
  EN_VIGUEUR: { bg: Palette.successBg, text: Palette.success, label: 'En vigueur', dot: Palette.success },
  ABROGE: { bg: Palette.errorBg, text: Palette.error, label: 'Abrogé', dot: Palette.error },
  MODIFIE: { bg: Palette.warningBg, text: Palette.warning, label: 'Modifié', dot: Palette.warning },
} as const;

/**
 * Badge statut de concours
 */
export const ConcoursStatusBadge = {
  OUVERT: { bg: Palette.successBg, text: Palette.success, label: 'Ouvert' },
  FERME: { bg: Palette.errorBg, text: Palette.error, label: 'Fermé' },
  A_VENIR: { bg: Palette.infoBg, text: Palette.info, label: 'À venir' },
} as const;

// Export default du thème clair
export default LightTheme;
