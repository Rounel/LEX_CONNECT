/**
 * WILEX — Bibliothèque de Composants
 * Styles StyleSheet de base référençant les design tokens
 *
 * Chaque section correspond à un composant ou groupe de composants.
 * Les styles sont définis en mode clair (light) par défaut.
 * Pour le mode sombre, utilisez useTheme() pour basculer les couleurs.
 *
 * USAGE :
 *   import { ComponentStyles } from '@/src/theme/components';
 *   import { useWilexTheme } from '@/src/theme/useTheme'; // hook à créer
 *
 * PATTERN RECOMMANDÉ :
 *   const styles = useMemo(() => createStyles(theme), [theme]);
 */

import { StyleSheet, Platform } from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  ComponentSizes,
  type ThemeColors,
} from './tokens';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES PARTAGÉS
// ─────────────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'follow';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonState = 'default' | 'pressed' | 'loading' | 'disabled';

export type CardDocumentType = 'CODE' | 'LOI' | 'DECRET' | 'JURISPRUDENCE' | 'ORDONNANCE' | 'REGLEMENT';
export type DocumentStatus = 'EN_VIGUEUR' | 'ABROGE' | 'MODIFIE';
export type ConcoursStatus = 'OUVERT' | 'FERME' | 'A_VENIR';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';
export type EmptyStateVariant =
  | 'bibliotheque-vide'
  | 'recherche-aucun-resultat'
  | 'actualites-vide'
  | 'alexia-nouvelle-conversation'
  | 'concours-vide'
  | 'notifications-vide';

// ─────────────────────────────────────────────────────────────────────────────
// FACTORY — crée les styles selon le thème actif
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crée l'ensemble des styles de composants pour un thème donné.
 * Appeler dans useMemo ou au niveau du composant.
 */
export function createComponentStyles(colors: ThemeColors) {
  return {

    // ─────────────────────────────────────────────────────────────────────────
    // LAYOUT GLOBAL
    // ─────────────────────────────────────────────────────────────────────────

    screen: StyleSheet.create({
      /** Conteneur de base pour chaque écran */
      base: {
        flex: 1,
        backgroundColor: colors.surfaceDefault,
      },
      /** Conteneur avec marge horizontale standard */
      padded: {
        flex: 1,
        backgroundColor: colors.surfaceDefault,
        paddingHorizontal: Spacing.screenHorizontal,
      },
      /** Fond ivoire pour les modules spéciaux (Alexia) */
      ivory: {
        flex: 1,
        backgroundColor: colors.surfaceIvory,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // NAVIGATION — BOTTOM TAB BAR
    // ─────────────────────────────────────────────────────────────────────────

    tabBar: StyleSheet.create({
      /** Conteneur de la barre */
      container: {
        flexDirection: 'row',
        backgroundColor: colors.tabBackground,
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        ...Shadows.shadow2,
        paddingHorizontal: Spacing.space2,
      },
      /** Item d'onglet */
      item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.space2,
        minHeight: ComponentSizes.tabBarHeight,
      },
      /** Icône dans l'onglet */
      icon: {
        width: ComponentSizes.iconLg,
        height: ComponentSizes.iconLg,
      },
      /** Label de l'onglet */
      label: {
        ...Typography.caption,
        marginTop: 2,
        letterSpacing: 0.2,
      },
      /** Label actif */
      labelActive: {
        color: colors.tabActive,
        fontWeight: '600',
      },
      /** Label inactif */
      labelInactive: {
        color: colors.tabInactive,
      },
      /** Indicateur actif (barre supérieure) */
      activeIndicator: {
        position: 'absolute',
        top: 0,
        width: 24,
        height: 3,
        borderRadius: BorderRadius.full,
        backgroundColor: colors.tabActive,
      },
      /** Badge numérique */
      badge: {
        position: 'absolute',
        top: 6,
        right: 14,
        minWidth: ComponentSizes.badgeMinWidth,
        height: ComponentSizes.badgeHeight,
        borderRadius: BorderRadius.full,
        backgroundColor: colors.error,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
      },
      badgeText: {
        ...Typography.caption,
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // NAVIGATION — TOP HEADER
    // ─────────────────────────────────────────────────────────────────────────

    header: StyleSheet.create({
      /** Conteneur du header */
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: ComponentSizes.headerHeight,
        paddingHorizontal: Spacing.space4,
        backgroundColor: colors.surfaceDefault,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      /** Variante transparente (sur image hero) */
      transparent: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      },
      /** Variante Alexia */
      alexia: {
        backgroundColor: colors.alexiaBackground,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      /** Titre centré */
      title: {
        ...Typography.h4,
        color: colors.textPrimary,
        flex: 1,
        textAlign: 'center',
      },
      /** Titre aligné à gauche (après back button) */
      titleLeft: {
        ...Typography.h4,
        color: colors.textPrimary,
        flex: 1,
      },
      /** Zone actions (droite) */
      actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space2,
      },
      /** Bouton d'action dans le header */
      actionButton: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
      },
      /** Bouton retour */
      backButton: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.space2,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // BOUTONS
    // ─────────────────────────────────────────────────────────────────────────

    button: StyleSheet.create({
      // ── Base ──
      base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.md,
        gap: Spacing.space2,
      },

      // ── Tailles ──
      sizeSm: {
        height: ComponentSizes.buttonHeightSm,
        paddingHorizontal: ComponentSizes.buttonPaddingHorizontalSm,
      },
      sizeMd: {
        height: ComponentSizes.buttonHeightMd,
        paddingHorizontal: ComponentSizes.buttonPaddingHorizontalMd,
      },
      sizeLg: {
        height: ComponentSizes.buttonHeightLg,
        paddingHorizontal: ComponentSizes.buttonPaddingHorizontalLg,
        borderRadius: BorderRadius.lg,
      },

      // ── Primary ──
      primary: {
        backgroundColor: colors.accentPrimary,
        ...Shadows.shadow2,
      },
      primaryText: {
        ...Typography.buttonMd,
        color: '#FFFFFF',
      },
      primaryPressed: {
        backgroundColor: colors.accentPrimary90,
        opacity: 0.9,
        transform: [{ scale: 0.97 }],
      },

      // ── Secondary ──
      secondary: {
        backgroundColor: colors.surfaceDefault,
        borderWidth: 1.5,
        borderColor: colors.accentPrimary,
      },
      secondaryText: {
        ...Typography.buttonMd,
        color: colors.accentPrimary,
      },
      secondaryPressed: {
        backgroundColor: colors.accentPrimary8,
        transform: [{ scale: 0.97 }],
      },

      // ── Ghost ──
      ghost: {
        backgroundColor: 'transparent',
      },
      ghostText: {
        ...Typography.buttonMd,
        color: colors.textPrimary,
      },
      ghostPressed: {
        backgroundColor: colors.borderSubtle,
        transform: [{ scale: 0.97 }],
      },

      // ── Destructive ──
      destructive: {
        backgroundColor: colors.error,
        ...Shadows.shadow2,
      },
      destructiveText: {
        ...Typography.buttonMd,
        color: '#FFFFFF',
      },
      destructivePressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
      },

      // ── Follow (toggle) ──
      followActive: {
        backgroundColor: colors.surfaceDefault,
        borderWidth: 1.5,
        borderColor: colors.accentPrimary,
      },
      followInactive: {
        backgroundColor: colors.accentPrimary,
        ...Shadows.shadow2,
      },
      followActiveText: {
        ...Typography.buttonMd,
        color: colors.accentPrimary,
      },
      followInactiveText: {
        ...Typography.buttonMd,
        color: '#FFFFFF',
      },

      // ── Disabled ──
      disabled: {
        opacity: 0.4,
      },

      // ── Full Width ──
      fullWidth: {
        width: '100%',
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // CHAMPS DE SAISIE
    // ─────────────────────────────────────────────────────────────────────────

    searchBar: StyleSheet.create({
      /** Conteneur SearchBar */
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: ComponentSizes.searchBarHeight,
        backgroundColor: colors.surfaceRaised,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.space3,
        gap: Spacing.space2,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
      },
      /** État focalisé */
      containerFocused: {
        borderColor: colors.accentPrimary,
        backgroundColor: colors.surfaceDefault,
        ...Shadows.shadow1,
      },
      /** SearchBar héro (proéminente, pleine largeur) */
      hero: {
        height: 56,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.space5,
        backgroundColor: colors.surfaceDefault,
        ...Shadows.shadow2,
      },
      /** Champ de texte interne */
      input: {
        flex: 1,
        ...Typography.body,
        color: colors.textPrimary,
        paddingVertical: 0, // iOS fix
      },
      placeholder: {
        color: colors.textTertiary,
      },
      icon: {
        color: colors.textTertiary,
      },
      iconFocused: {
        color: colors.accentPrimary,
      },
      clearButton: {
        padding: 2,
      },
    }),

    inputField: StyleSheet.create({
      /** Conteneur externe */
      wrapper: {
        gap: Spacing.space1,
      },
      /** Zone input + label flottant */
      container: {
        position: 'relative',
        borderWidth: 1.5,
        borderColor: colors.borderDefault,
        borderRadius: BorderRadius.md,
        backgroundColor: colors.surfaceDefault,
        height: ComponentSizes.inputHeight,
        paddingHorizontal: Spacing.space4,
        justifyContent: 'center',
      },
      containerFocused: {
        borderColor: colors.accentPrimary,
        ...Shadows.shadow1,
      },
      containerError: {
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
      },
      containerSuccess: {
        borderColor: colors.success,
        backgroundColor: colors.successBg,
      },
      containerDisabled: {
        opacity: 0.5,
        backgroundColor: colors.surfaceRaised,
      },
      /** Label flottant (en position haute quand focalisé / rempli) */
      labelFloating: {
        position: 'absolute',
        left: Spacing.space4,
        ...Typography.caption,
        color: colors.textTertiary,
      },
      labelFocused: {
        color: colors.accentPrimary,
      },
      labelError: {
        color: colors.error,
      },
      input: {
        ...Typography.body,
        color: colors.textPrimary,
        paddingTop: 14, // espace pour le label flottant
        paddingBottom: 4,
      },
      /** Helper text / message d'erreur */
      helperText: {
        ...Typography.caption,
        color: colors.textTertiary,
        marginLeft: Spacing.space1,
      },
      helperTextError: {
        color: colors.error,
      },
      helperTextSuccess: {
        color: colors.success,
      },
      /** Icône état (droite) */
      trailingIcon: {
        position: 'absolute',
        right: Spacing.space4,
      },
    }),

    filterChip: StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: ComponentSizes.filterChipHeight,
        paddingHorizontal: Spacing.space3,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        backgroundColor: colors.surfaceDefault,
        gap: Spacing.space1,
      },
      containerActive: {
        backgroundColor: colors.accentPrimary,
        borderColor: colors.accentPrimary,
      },
      text: {
        ...Typography.label,
        color: colors.textSecondary,
      },
      textActive: {
        color: '#FFFFFF',
      },
      badge: {
        backgroundColor: colors.accentPrimary50,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 5,
        paddingVertical: 1,
      },
      badgeText: {
        ...Typography.caption,
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '700',
      },
    }),

    filterRow: StyleSheet.create({
      container: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceDefault,
        paddingVertical: Spacing.space3,
        gap: Spacing.space2,
      },
      scrollContent: {
        paddingHorizontal: Spacing.screenHorizontal,
        gap: Spacing.space2,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // CARDS
    // ─────────────────────────────────────────────────────────────────────────

    cardDocument: StyleSheet.create({
      container: {
        backgroundColor: colors.surfaceDefault,
        borderRadius: BorderRadius.lg,
        padding: Spacing.cardPadding,
        ...Shadows.shadow2,
        gap: Spacing.space2,
      },
      /** Ligne d'en-tête : badge type + badge statut + icône follow */
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.space2,
      },
      headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space2,
        flex: 1,
      },
      title: {
        ...Typography.h3,
        color: colors.textPrimary,
        flex: 1,
      },
      domain: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
      },
      footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      date: {
        ...Typography.caption,
        color: colors.textTertiary,
      },
      followButton: {
        padding: Spacing.space1,
      },
      /** Version compacte (dans scrollview horizontal) */
      compact: {
        width: 200,
        padding: Spacing.space3,
        gap: Spacing.space2,
      },
    }),

    cardActualite: StyleSheet.create({
      container: {
        backgroundColor: colors.surfaceDefault,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadows.shadow2,
      },
      image: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: colors.surfaceRaised,
      },
      content: {
        padding: Spacing.cardPadding,
        gap: Spacing.space2,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      title: {
        ...Typography.h3,
        color: colors.textPrimary,
        lineHeight: 26,
      },
      meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space2,
      },
      metaText: {
        ...Typography.caption,
        color: colors.textTertiary,
      },
      /** Point indicateur "Lié à un texte suivi" */
      followedIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.accentPrimary,
      },
    }),

    cardConcours: StyleSheet.create({
      container: {
        backgroundColor: colors.surfaceDefault,
        borderRadius: BorderRadius.lg,
        padding: Spacing.cardPadding,
        ...Shadows.shadow2,
        gap: Spacing.space3,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: Spacing.space2,
      },
      title: {
        ...Typography.h3,
        color: colors.textPrimary,
        flex: 1,
      },
      institution: {
        ...Typography.body,
        color: colors.textSecondary,
      },
      dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space2,
      },
      dateText: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
      },
    }),

    cardConversationAlexia: StyleSheet.create({
      container: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceDefault,
        borderRadius: BorderRadius.lg,
        padding: Spacing.cardPadding,
        gap: Spacing.space3,
        ...Shadows.shadow1,
      },
      iconContainer: {
        width: ComponentSizes.avatarMd,
        height: ComponentSizes.avatarMd,
        borderRadius: BorderRadius.full,
        backgroundColor: colors.surfaceIvory,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        flexShrink: 0,
      },
      content: {
        flex: 1,
        gap: Spacing.space1,
      },
      question: {
        ...Typography.body,
        color: colors.textPrimary,
        lineHeight: 21,
      },
      meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space3,
      },
      metaText: {
        ...Typography.caption,
        color: colors.textTertiary,
      },
      unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accentPrimary,
        position: 'absolute',
        top: Spacing.cardPadding,
        right: Spacing.cardPadding,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // BADGES & STATUS
    // ─────────────────────────────────────────────────────────────────────────

    badge: StyleSheet.create({
      /** Badge standard */
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.space2,
        paddingVertical: 3,
        borderRadius: BorderRadius.sm,
        gap: 4,
      },
      text: {
        ...Typography.caption,
        fontWeight: '600',
        letterSpacing: 0.4,
        textTransform: 'uppercase',
      },
      /** Point coloré dans badge statut */
      dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // COMPOSANTS DE LECTURE — LECTEUR DE TEXTE JURIDIQUE
    // ─────────────────────────────────────────────────────────────────────────

    reader: StyleSheet.create({
      /** Conteneur article */
      container: {
        flex: 1,
        backgroundColor: colors.surfaceDefault,
      },
      /** Barre de progression lecture (fin en haut) */
      progressBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: colors.borderSubtle,
        zIndex: 100,
      },
      progressFill: {
        height: 3,
        backgroundColor: colors.accentPrimary,
        opacity: 0.6,
      },
      /** Contenu scrollable */
      scrollContent: {
        paddingHorizontal: Spacing.space4,
        paddingTop: Spacing.space6,
        paddingBottom: 120, // espace pour ArticleNavigator
      },
      /** Titre de l'article */
      articleTitle: {
        ...Typography.articleTitle,
        color: colors.textPrimary,
        marginBottom: Spacing.space6,
      },
      /** Conteneur d'un article juridique (numéro + texte) */
      articleRow: {
        flexDirection: 'row',
        gap: Spacing.space4,
        marginBottom: Spacing.space6,
      },
      articleNumber: {
        ...Typography.articleNumber,
        color: colors.textTertiary,
        width: 40,
        flexShrink: 0,
        paddingTop: 4, // alignement avec le texte
      },
      articleBody: {
        ...Typography.articleBody,
        color: colors.textPrimary,
        flex: 1,
      },
      /** Paragraphe standard */
      paragraph: {
        ...Typography.articleBody,
        color: colors.textPrimary,
        marginBottom: Spacing.space4,
      },
      /** Titre de partie/section dans l'article */
      sectionTitle: {
        ...Typography.h4,
        color: colors.textPrimary,
        marginTop: Spacing.space6,
        marginBottom: Spacing.space3,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      /** Texte surligné */
      highlighted: {
        backgroundColor: 'rgba(196, 136, 44, 0.20)', // gold 20%
        borderRadius: 2,
      },
    }),

    articleNavigator: StyleSheet.create({
      container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.space4,
        paddingVertical: Spacing.space3,
        backgroundColor: colors.surfaceDefault,
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        ...Shadows.shadow3,
      },
      navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space2,
        paddingVertical: Spacing.space2,
        paddingHorizontal: Spacing.space3,
        borderRadius: BorderRadius.md,
        backgroundColor: colors.surfaceRaised,
      },
      navButtonText: {
        ...Typography.label,
        color: colors.textSecondary,
      },
      currentArticle: {
        ...Typography.label,
        color: colors.textPrimary,
        paddingHorizontal: Spacing.space2,
      },
    }),

    highlightMenu: StyleSheet.create({
      container: {
        flexDirection: 'row',
        backgroundColor: colors.surfaceInk,
        borderRadius: BorderRadius.md,
        padding: Spacing.space2,
        gap: Spacing.space1,
        ...Shadows.shadow5,
      },
      menuItem: {
        alignItems: 'center',
        paddingHorizontal: Spacing.space3,
        paddingVertical: Spacing.space2,
        borderRadius: BorderRadius.sm,
        gap: 4,
      },
      menuItemText: {
        ...Typography.caption,
        color: '#FFFFFF',
        fontSize: 10,
      },
      colorDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
      },
    }),

    versionTimeline: StyleSheet.create({
      container: {
        paddingHorizontal: Spacing.screenHorizontal,
      },
      item: {
        flexDirection: 'row',
        gap: Spacing.space4,
        paddingBottom: Spacing.space6,
      },
      /** Colonne de gauche : indicateur + ligne */
      leftColumn: {
        alignItems: 'center',
        width: 16,
      },
      dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.borderDefault,
        borderWidth: 2,
        borderColor: colors.surfaceDefault,
        zIndex: 1,
      },
      dotActive: {
        backgroundColor: colors.accentPrimary,
        width: 16,
        height: 16,
        borderRadius: 8,
      },
      line: {
        width: 1.5,
        flex: 1,
        backgroundColor: colors.borderDefault,
        marginTop: 2,
      },
      /** Contenu de droite */
      content: {
        flex: 1,
        gap: Spacing.space2,
        paddingTop: 0,
      },
      date: {
        ...Typography.caption,
        color: colors.textTertiary,
      },
      version: {
        ...Typography.label,
        color: colors.textPrimary,
      },
      summary: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        lineHeight: 20,
      },
      jorci: {
        ...Typography.caption,
        color: colors.textTertiary,
        fontStyle: 'italic',
      },
    }),

    tableOfContents: StyleSheet.create({
      container: {
        flex: 1,
      },
      item: {
        paddingVertical: Spacing.space3,
        paddingHorizontal: Spacing.screenHorizontal,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      itemActive: {
        backgroundColor: colors.accentPrimary8,
        borderLeftWidth: 3,
        borderLeftColor: colors.accentPrimary,
        paddingLeft: Spacing.space4 - 3,
      },
      itemText: {
        ...Typography.body,
        color: colors.textPrimary,
      },
      itemTextActive: {
        color: colors.accentPrimary,
        fontWeight: '600',
      },
      /** Indentation pour les niveaux hiérarchiques */
      indent1: { paddingLeft: Spacing.screenHorizontal },
      indent2: { paddingLeft: Spacing.screenHorizontal + Spacing.space4 },
      indent3: { paddingLeft: Spacing.screenHorizontal + Spacing.space8 },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // ALEXIA — COMPOSANTS DE CONVERSATION
    // ─────────────────────────────────────────────────────────────────────────

    conversation: StyleSheet.create({
      /** Conteneur global */
      container: {
        flex: 1,
        backgroundColor: colors.alexiaBackground,
      },
      /** Zone scrollable messages */
      messageList: {
        flex: 1,
        paddingHorizontal: Spacing.space4,
        paddingTop: Spacing.space4,
        paddingBottom: Spacing.space2,
      },
      /** Espaceur entre messages */
      messageSpacer: {
        height: Spacing.space2,
      },
      /** Spaceur entre groupes (utilisateur ↔ Alexia) */
      groupSpacer: {
        height: Spacing.space4,
      },
      /** Barre de saisie en bas */
      inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: Spacing.space4,
        paddingTop: Spacing.space3,
        paddingBottom: Spacing.space4,
        gap: Spacing.space3,
        backgroundColor: colors.surfaceDefault,
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        ...Shadows.shadow3,
      },
      /** Input multiline */
      textInput: {
        flex: 1,
        ...Typography.body,
        color: colors.textPrimary,
        backgroundColor: colors.surfaceRaised,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        paddingHorizontal: Spacing.space4,
        paddingTop: Spacing.space3,
        paddingBottom: Spacing.space3,
        maxHeight: 120,
        minHeight: 44,
      },
      /** Bouton envoi */
      sendButton: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.full,
        backgroundColor: colors.accentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.shadowAccent,
      },
      sendButtonDisabled: {
        backgroundColor: colors.borderDefault,
        ...Shadows.shadow0,
      },
    }),

    messageBubble: StyleSheet.create({
      /** Bulle utilisateur (droite) */
      userContainer: {
        alignSelf: 'flex-end',
        maxWidth: '80%',
      },
      userBubble: {
        backgroundColor: colors.userBubble,
        paddingHorizontal: Spacing.space4,
        paddingVertical: Spacing.space3,
        borderRadius: BorderRadius.xl,
        borderBottomRightRadius: BorderRadius.md, // coin bas-droite moins arrondi
        ...Shadows.shadowAccent,
      },
      userText: {
        ...Typography.body,
        color: colors.userBubbleText,
        lineHeight: 22,
      },

      /** Bulle Alexia (gauche) */
      alexiaContainer: {
        alignSelf: 'flex-start',
        maxWidth: '85%',
        flexDirection: 'row',
        gap: Spacing.space2,
        alignItems: 'flex-end',
      },
      alexiaIconWrapper: {
        width: 28,
        height: 28,
        borderRadius: BorderRadius.full,
        backgroundColor: colors.surfaceIvory,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginBottom: 2,
      },
      alexiaBubble: {
        backgroundColor: colors.alexiaBubble,
        paddingHorizontal: Spacing.space4,
        paddingVertical: Spacing.space3,
        borderRadius: BorderRadius.xl,
        borderBottomLeftRadius: BorderRadius.md, // coin bas-gauche moins arrondi
        borderWidth: 1,
        borderColor: colors.alexiaBubbleBorder,
        gap: Spacing.space3,
      },
      alexiaText: {
        ...Typography.body,
        color: colors.textPrimary,
        lineHeight: 22,
      },

      /** Timestamp */
      timestamp: {
        ...Typography.caption,
        color: colors.textTertiary,
        alignSelf: 'flex-end',
        marginTop: 2,
        marginHorizontal: Spacing.space2,
      },
    }),

    typingIndicator: StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: Spacing.space4,
        paddingVertical: Spacing.space3,
        backgroundColor: colors.alexiaBubble,
        borderRadius: BorderRadius.xl,
        borderBottomLeftRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: colors.alexiaBubbleBorder,
        alignSelf: 'flex-start',
        marginLeft: 36, // alignement avec les bulles Alexia
      },
      dot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: colors.textTertiary,
      },
    }),

    citationCard: StyleSheet.create({
      container: {
        backgroundColor: colors.citationBackground,
        borderRadius: BorderRadius.md,
        borderLeftWidth: 3,
        borderLeftColor: colors.citationBorder,
        padding: Spacing.space3,
        gap: Spacing.space2,
        ...Shadows.shadow1,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space2,
      },
      title: {
        ...Typography.label,
        color: colors.textPrimary,
        flex: 1,
      },
      article: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
      },
      link: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space1,
        alignSelf: 'flex-start',
      },
      linkText: {
        ...Typography.label,
        color: colors.accentPrimary,
        fontSize: 12,
      },
    }),

    suggestedQuestion: StyleSheet.create({
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceRaised,
        borderRadius: BorderRadius.lg,
        padding: Spacing.space3,
        gap: Spacing.space3,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        ...Shadows.shadow1,
      },
      text: {
        ...Typography.body,
        color: colors.textPrimary,
        flex: 1,
        lineHeight: 20,
      },
      icon: {
        color: colors.textTertiary,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // CONCOURS — COMPOSANTS
    // ─────────────────────────────────────────────────────────────────────────

    quizCard: StyleSheet.create({
      container: {
        backgroundColor: colors.surfaceDefault,
        borderRadius: BorderRadius.xl,
        padding: Spacing.space6,
        gap: Spacing.space6,
        ...Shadows.shadow2,
        marginHorizontal: Spacing.screenHorizontal,
      },
      question: {
        ...Typography.bodyLarge,
        color: colors.textPrimary,
        lineHeight: 28,
      },
      optionsContainer: {
        gap: Spacing.space3,
      },
      /** Option de réponse */
      option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.space4,
        borderRadius: BorderRadius.md,
        borderWidth: 1.5,
        borderColor: colors.borderDefault,
        backgroundColor: colors.surfaceDefault,
        gap: Spacing.space3,
      },
      optionSelected: {
        borderColor: colors.accentPrimary,
        backgroundColor: colors.accentPrimary8,
      },
      optionCorrect: {
        borderColor: colors.success,
        backgroundColor: colors.successBg,
      },
      optionIncorrect: {
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
      },
      optionText: {
        ...Typography.body,
        color: colors.textPrimary,
        flex: 1,
      },
      optionLetter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.borderDefault,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      },
      optionLetterText: {
        ...Typography.label,
        color: colors.textSecondary,
        fontSize: 12,
      },
      /** Zone d'explication (après validation) */
      explanation: {
        backgroundColor: colors.surfaceRaised,
        borderRadius: BorderRadius.md,
        padding: Spacing.space4,
        gap: Spacing.space3,
      },
      explanationTitle: {
        ...Typography.label,
        color: colors.textPrimary,
      },
      explanationText: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        lineHeight: 20,
      },
    }),

    progressBar: StyleSheet.create({
      container: {
        gap: Spacing.space1,
      },
      label: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      labelText: {
        ...Typography.caption,
        color: colors.textSecondary,
      },
      labelPercent: {
        ...Typography.caption,
        color: colors.accentPrimary,
        fontWeight: '600',
      },
      track: {
        height: ComponentSizes.progressBarHeight,
        borderRadius: ComponentSizes.progressBarBorderRadius,
        backgroundColor: colors.borderSubtle,
        overflow: 'hidden',
      },
      fill: {
        height: '100%',
        borderRadius: ComponentSizes.progressBarBorderRadius,
        backgroundColor: colors.accentPrimary,
      },
    }),

    statCard: StyleSheet.create({
      container: {
        backgroundColor: colors.surfaceRaised,
        borderRadius: BorderRadius.lg,
        padding: Spacing.space4,
        alignItems: 'center',
        gap: Spacing.space2,
        flex: 1,
        ...Shadows.shadow1,
      },
      value: {
        ...Typography.display,
        color: colors.textPrimary,
        fontSize: 32,
        lineHeight: 40,
      },
      label: {
        ...Typography.caption,
        color: colors.textSecondary,
        textAlign: 'center',
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // FEEDBACK & ÉTATS
    // ─────────────────────────────────────────────────────────────────────────

    skeletonLoader: StyleSheet.create({
      /** Base de toutes les barres skeleton */
      bar: {
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
      },
      /** Card skeleton */
      cardContainer: {
        backgroundColor: colors.surfaceDefault,
        borderRadius: BorderRadius.lg,
        padding: Spacing.cardPadding,
        gap: Spacing.space3,
        ...Shadows.shadow1,
      },
      /** Line skeleton (différentes largeurs) */
      lineFull: {
        height: 16,
        borderRadius: BorderRadius.sm,
      },
      lineThreeQuarter: {
        height: 16,
        width: '75%',
        borderRadius: BorderRadius.sm,
      },
      lineHalf: {
        height: 14,
        width: '50%',
        borderRadius: BorderRadius.sm,
      },
      lineQuarter: {
        height: 12,
        width: '30%',
        borderRadius: BorderRadius.sm,
      },
      /** Image skeleton */
      image: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: BorderRadius.lg,
      },
      /** Avatar skeleton */
      avatar: {
        width: ComponentSizes.avatarMd,
        height: ComponentSizes.avatarMd,
        borderRadius: ComponentSizes.avatarMd / 2,
      },
    }),

    emptyState: StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.space8,
        gap: Spacing.space4,
      },
      illustration: {
        width: 120,
        height: 120,
        marginBottom: Spacing.space2,
      },
      title: {
        ...Typography.h3,
        color: colors.textPrimary,
        textAlign: 'center',
      },
      subtitle: {
        ...Typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
      },
    }),

    toast: StyleSheet.create({
      container: {
        position: 'absolute',
        top: 0,
        left: Spacing.space4,
        right: Spacing.space4,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
        padding: Spacing.space4,
        gap: Spacing.space3,
        ...Shadows.shadow4,
        zIndex: 9999,
      },
      success: {
        backgroundColor: colors.success,
      },
      error: {
        backgroundColor: colors.error,
      },
      info: {
        backgroundColor: colors.info,
      },
      warning: {
        backgroundColor: colors.warning,
      },
      message: {
        ...Typography.body,
        color: '#FFFFFF',
        flex: 1,
        lineHeight: 20,
      },
      icon: {
        flexShrink: 0,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // MODALES & SHEETS
    // ─────────────────────────────────────────────────────────────────────────

    bottomSheet: StyleSheet.create({
      backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 14, 12, 0.60)',
      },
      container: {
        backgroundColor: colors.surfaceDefault,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        ...Shadows.shadow5,
        overflow: 'hidden',
      },
      /** Drag handle */
      handle: {
        alignItems: 'center',
        paddingTop: Spacing.space3,
        paddingBottom: Spacing.space2,
      },
      handleBar: {
        width: ComponentSizes.dragHandleWidth,
        height: ComponentSizes.dragHandleHeight,
        borderRadius: ComponentSizes.dragHandleHeight / 2,
        backgroundColor: colors.borderDefault,
      },
      /** Header du sheet */
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.space4,
        paddingBottom: Spacing.space4,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      headerTitle: {
        ...Typography.h4,
        color: colors.textPrimary,
      },
      /** Contenu du sheet */
      content: {
        paddingHorizontal: Spacing.space4,
        paddingTop: Spacing.space4,
      },
      /** Bouton sticky en bas */
      stickyFooter: {
        paddingHorizontal: Spacing.space4,
        paddingTop: Spacing.space4,
        paddingBottom: Spacing.space4,
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle,
        backgroundColor: colors.surfaceDefault,
      },
    }),

    modal: StyleSheet.create({
      backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 14, 12, 0.70)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.space6,
      },
      container: {
        backgroundColor: colors.surfaceDefault,
        borderRadius: BorderRadius.xl,
        padding: Spacing.space6,
        width: '100%',
        gap: Spacing.space4,
        ...Shadows.shadow5,
      },
      title: {
        ...Typography.h3,
        color: colors.textPrimary,
        textAlign: 'center',
      },
      message: {
        ...Typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
      },
      actions: {
        flexDirection: 'row',
        gap: Spacing.space3,
        marginTop: Spacing.space2,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // LISTES — LIST ITEMS
    // ─────────────────────────────────────────────────────────────────────────

    listItem: StyleSheet.create({
      /** Document (liste compacte) */
      document: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.space3,
        paddingHorizontal: Spacing.screenHorizontal,
        gap: Spacing.space3,
        backgroundColor: colors.surfaceDefault,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      documentContent: {
        flex: 1,
        gap: 3,
      },
      documentTitle: {
        ...Typography.body,
        color: colors.textPrimary,
        fontFamily: undefined, // Inter par défaut
      },
      documentMeta: {
        ...Typography.caption,
        color: colors.textTertiary,
      },
      documentIcon: {
        width: 36,
        height: 36,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      },

      /** Notification */
      notification: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: Spacing.space4,
        paddingHorizontal: Spacing.screenHorizontal,
        gap: Spacing.space3,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      notificationUnread: {
        backgroundColor: colors.accentPrimary8,
      },
      notificationIconWrap: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      },
      notificationContent: {
        flex: 1,
        gap: 4,
      },
      notificationTitle: {
        ...Typography.body,
        color: colors.textPrimary,
        fontWeight: '600',
      },
      notificationDescription: {
        ...Typography.bodySmall,
        color: colors.textSecondary,
        lineHeight: 19,
      },
      notificationDate: {
        ...Typography.caption,
        color: colors.textTertiary,
      },
      notificationUnreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accentPrimary,
        marginTop: 6,
        flexShrink: 0,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // PROFIL UTILISATEUR
    // ─────────────────────────────────────────────────────────────────────────

    profile: StyleSheet.create({
      header: {
        alignItems: 'center',
        paddingVertical: Spacing.space8,
        paddingHorizontal: Spacing.screenHorizontal,
        gap: Spacing.space3,
        backgroundColor: colors.surfaceDefault,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      },
      avatar: {
        width: ComponentSizes.avatarXl,
        height: ComponentSizes.avatarXl,
        borderRadius: ComponentSizes.avatarXl / 2,
        backgroundColor: colors.accentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
      },
      avatarText: {
        ...Typography.h2,
        color: '#FFFFFF',
      },
      name: {
        ...Typography.h3,
        color: colors.textPrimary,
        textAlign: 'center',
      },
      profileBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space2,
        backgroundColor: colors.accentPrimary15,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.space3,
        paddingVertical: Spacing.space1,
      },
      profileBadgeText: {
        ...Typography.label,
        color: colors.accentPrimary,
        fontSize: 12,
      },
      statsRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.screenHorizontal,
        paddingVertical: Spacing.space4,
        gap: Spacing.space3,
      },
      section: {
        marginTop: Spacing.space4,
      },
      sectionTitle: {
        ...Typography.label,
        color: colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        paddingHorizontal: Spacing.screenHorizontal,
        paddingVertical: Spacing.space3,
      },
      menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.space4,
        paddingHorizontal: Spacing.screenHorizontal,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
        gap: Spacing.space3,
      },
      menuItemText: {
        ...Typography.body,
        color: colors.textPrimary,
        flex: 1,
      },
      menuItemDestructive: {
        color: colors.error,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // ONBOARDING
    // ─────────────────────────────────────────────────────────────────────────

    onboarding: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.surfaceDefault,
      },
      page: {
        flex: 1,
        paddingHorizontal: Spacing.space6,
        paddingTop: Spacing.space16,
        paddingBottom: Spacing.space6,
        alignItems: 'center',
        gap: Spacing.space6,
      },
      illustration: {
        width: '100%',
        height: 260,
        alignItems: 'center',
        justifyContent: 'center',
      },
      content: {
        flex: 1,
        alignItems: 'center',
        gap: Spacing.space3,
      },
      title: {
        ...Typography.h1,
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: 44,
      },
      subtitle: {
        ...Typography.bodyLarge,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 26,
      },
      /** Indicateurs de progression */
      pagination: {
        flexDirection: 'row',
        gap: Spacing.space2,
      },
      paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.borderDefault,
      },
      paginationDotActive: {
        width: 24,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.accentPrimary,
      },
      footer: {
        width: '100%',
        gap: Spacing.space3,
      },
      skipButton: {
        alignSelf: 'center',
        padding: Spacing.space2,
      },
      skipText: {
        ...Typography.label,
        color: colors.textTertiary,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // AUTH
    // ─────────────────────────────────────────────────────────────────────────

    auth: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.surfaceDefault,
        paddingHorizontal: Spacing.screenHorizontal,
      },
      logo: {
        alignItems: 'center',
        paddingTop: Spacing.space16,
        paddingBottom: Spacing.space8,
        gap: Spacing.space3,
      },
      logoText: {
        ...Typography.display,
        color: colors.textPrimary,
        letterSpacing: -1,
      },
      logoTagline: {
        ...Typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
      },
      form: {
        gap: Spacing.space4,
      },
      forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -Spacing.space2,
      },
      forgotPasswordText: {
        ...Typography.label,
        color: colors.accentPrimary,
        fontSize: 13,
      },
      separator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.space3,
        marginVertical: Spacing.space2,
      },
      separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.borderSubtle,
      },
      separatorText: {
        ...Typography.caption,
        color: colors.textTertiary,
      },
      footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.space2,
        marginTop: Spacing.space6,
        paddingBottom: Spacing.space8,
      },
      footerText: {
        ...Typography.body,
        color: colors.textSecondary,
      },
      footerLink: {
        ...Typography.body,
        color: colors.accentPrimary,
        fontWeight: '600',
      },
      /** Sélecteur de profil (Étudiant / Professionnel) */
      profileSelector: {
        flexDirection: 'row',
        gap: Spacing.space3,
      },
      profileOption: {
        flex: 1,
        alignItems: 'center',
        padding: Spacing.space4,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        borderColor: colors.borderDefault,
        gap: Spacing.space3,
        backgroundColor: colors.surfaceDefault,
      },
      profileOptionSelected: {
        borderColor: colors.accentPrimary,
        backgroundColor: colors.accentPrimary8,
      },
      profileOptionLabel: {
        ...Typography.label,
        color: colors.textSecondary,
        textAlign: 'center',
      },
      profileOptionLabelSelected: {
        color: colors.accentPrimary,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // SECTIONS COMMUNES
    // ─────────────────────────────────────────────────────────────────────────

    section: StyleSheet.create({
      container: {
        marginBottom: Spacing.sectionGap,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.screenHorizontal,
        marginBottom: Spacing.space3,
      },
      title: {
        ...Typography.h4,
        color: colors.textPrimary,
      },
      viewAll: {
        ...Typography.label,
        color: colors.accentPrimary,
        fontSize: 13,
      },
      scrollContent: {
        paddingHorizontal: Spacing.screenHorizontal,
        gap: Spacing.space3,
      },
      listContent: {
        paddingHorizontal: Spacing.screenHorizontal,
        gap: Spacing.space3,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // SPLASH SCREEN
    // ─────────────────────────────────────────────────────────────────────────

    splash: StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.surfaceInk, // Noir
        alignItems: 'center',
        justifyContent: 'center',
      },
      logo: {
        ...Typography.display,
        color: '#FFFFFF',
        letterSpacing: -1.5,
        fontSize: 52,
      },
      tagline: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.5)',
        marginTop: Spacing.space2,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontSize: 11,
      },
    }),

    // ─────────────────────────────────────────────────────────────────────────
    // FAB (Floating Action Button)
    // ─────────────────────────────────────────────────────────────────────────

    fab: StyleSheet.create({
      container: {
        position: 'absolute',
        bottom: Spacing.space6,
        right: Spacing.screenHorizontal,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.accentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.shadow4,
        ...Shadows.shadowAccent,
      },
      extended: {
        width: 'auto',
        paddingHorizontal: Spacing.space4,
        flexDirection: 'row',
        gap: Spacing.space2,
        borderRadius: BorderRadius.full,
      },
      label: {
        ...Typography.label,
        color: '#FFFFFF',
      },
    }),

  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES STATIQUES (indépendants du thème)
// ─────────────────────────────────────────────────────────────────────────────

export const StaticStyles = StyleSheet.create({
  /** Flex utilitaires */
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCenter: { alignItems: 'center', justifyContent: 'center' },

  /** SafeAreaView wrapper */
  safeArea: {
    flex: 1,
  },

  /** Séparateur horizontal */
  separator: {
    height: 1,
  },

  /** Largeur plein écran */
  fullWidth: {
    width: '100%',
  },

  /** Positions absolues utilitaires */
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },

  /** Espacement standard entre items de liste */
  listGap: {
    gap: Spacing.space3,
  },

  /** Platform-specific shadow hack pour Android elevation */
  androidShadowFix: Platform.select({
    android: { elevation: 2 },
    default: {},
  }) as object,
});

// Export de la factory par défaut
export default createComponentStyles;
