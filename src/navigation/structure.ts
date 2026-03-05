/**
 * WILEX — Architecture de Navigation
 * React Navigation v6+ · Expo Router compatible
 *
 * STRUCTURE COMPLÈTE :
 *
 * RootStack
 *   ├── AuthStack  (si non authentifié)
 *   │     ├── Onboarding        (3 écrans swipeable)
 *   │     ├── Login
 *   │     ├── Register
 *   │     └── ForgotPassword
 *   │
 *   └── MainTabs  (si authentifié)
 *         ├── BibliothequeStack  (onglet 1)
 *         │     ├── BibliothequeHome
 *         │     ├── SearchResults
 *         │     ├── RecueilDetail        (Fiche Recueil)
 *         │     ├── TextReader           (Lecteur de texte)
 *         │     ├── VersionHistory       (Historique versions)
 *         │     └── FollowedTexts        (Mes textes suivis)
 *         │
 *         ├── ActualitesStack    (onglet 2)
 *         │     ├── ActualitesFeed
 *         │     └── ActualiteDetail
 *         │
 *         ├── AlexiaStack        (onglet 3)
 *         │     ├── AlexiaHome
 *         │     ├── Conversation
 *         │     └── ConversationHistory
 *         │
 *         └── ConcoursStack      (onglet 4)
 *               ├── ConcoursDashboard
 *               ├── ConcoursDetail       (Fiche Concours)
 *               ├── QuizModule
 *               ├── QuizResults
 *               ├── Annales
 *               ├── FichesRevision
 *               └── ProgressionStats
 *
 * Modales globales (sur RootStack) :
 *   ├── ProfileModal             (profil utilisateur)
 *   ├── NotificationsModal       (centre de notifs)
 *   └── SettingsModal            (paramètres)
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES DE PARAMÈTRES DE NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Paramètres du stack Auth
 */
export type AuthStackParamList = {
  /** Onboarding 3 écrans (géré en interne avec état local) */
  Onboarding: undefined;
  /** Connexion email/mot de passe */
  Login: {
    /** Pré-remplir l'email si fourni (ex: depuis register) */
    email?: string;
  };
  /** Inscription */
  Register: undefined;
  /** Réinitialisation de mot de passe */
  ForgotPassword: {
    email?: string;
  };
};

/**
 * Paramètres du stack Bibliothèque
 */
export type BibliothequeStackParamList = {
  /** Accueil Bibliothèque avec SearchBar héro */
  BibliothequeHome: undefined;
  /** Résultats de recherche */
  SearchResults: {
    /** Requête de recherche initiale */
    query: string;
    /** Filtres pré-appliqués (optionnels) */
    filters?: DocumentFilters;
  };
  /** Fiche d'un recueil / texte de loi */
  RecueilDetail: {
    /** Identifiant unique du texte */
    textId: string;
    /** Titre pour affichage rapide pendant le chargement */
    title?: string;
  };
  /** Lecteur de texte juridique */
  TextReader: {
    textId: string;
    /** Version à lire (null = version en vigueur) */
    versionId?: string;
    /** Article à ouvrir directement */
    articleNumber?: number;
    /** Surlignage initial (depuis CitationCard Alexia) */
    highlightArticle?: number;
  };
  /** Historique des versions d'un texte */
  VersionHistory: {
    textId: string;
    title: string;
  };
  /** Mes textes suivis */
  FollowedTexts: {
    /** Filtre de domaine pré-sélectionné */
    domain?: LegalDomain;
  };
};

/**
 * Paramètres du stack Actualités
 */
export type ActualitesStackParamList = {
  /** Feed principal des actualités */
  ActualitesFeed: {
    /** Filtrer par catégorie (depuis notification deep link) */
    category?: ActualiteCategory;
    /** Filtrer par texte lié (depuis fiche recueil) */
    linkedTextId?: string;
  };
  /** Détail d'une actualité */
  ActualiteDetail: {
    actualiteId: string;
    /** Titre pour affichage rapide */
    title?: string;
  };
};

/**
 * Paramètres du stack Alexia
 */
export type AlexiaStackParamList = {
  /** Accueil Alexia avec suggestions */
  AlexiaHome: undefined;
  /** Interface de conversation */
  Conversation: {
    /** ID de la conversation (null = nouvelle conversation) */
    conversationId?: string;
    /** Question initiale pré-remplie (depuis SuggestedQuestion) */
    initialQuestion?: string;
    /** Contexte : si on arrive depuis une fiche recueil */
    contextTextId?: string;
    contextTextTitle?: string;
  };
  /** Historique de toutes les conversations */
  ConversationHistory: undefined;
};

/**
 * Paramètres du stack Concours
 */
export type ConcoursStackParamList = {
  /** Dashboard concours */
  ConcoursDashboard: undefined;
  /** Fiche détail d'un concours */
  ConcoursDetail: {
    concoursId: string;
    title?: string;
  };
  /** Module de quiz */
  QuizModule: {
    concoursId: string;
    subject: string;
    /** "quiz" | "annales" */
    mode?: 'quiz' | 'annales';
  };
  /** Résultats d'un quiz */
  QuizResults: {
    concoursId: string;
    subject: string;
    score: number;
    total: number;
    incorrectQuestionIds: string[];
  };
  /** Liste des annales */
  Annales: {
    concoursId: string;
    concoursTitle: string;
  };
  /** Liste des fiches de révision */
  FichesRevision: {
    concoursId: string;
    /** Matière pré-sélectionnée */
    subject?: string;
  };
  /** Statistiques de progression */
  ProgressionStats: {
    concoursId: string;
  };
};

/**
 * Paramètres des onglets principaux
 */
export type MainTabsParamList = {
  BibliothequeTab: undefined;
  ActualitesTab: undefined;
  AlexiaTab: undefined;
  ConcoursTab: undefined;
};

/**
 * Paramètres du stack racine (modales globales)
 */
export type RootStackParamList = {
  /** Auth stack (non authentifié) */
  Auth: undefined;
  /** App principale (authentifié) */
  Main: undefined;
  /** Profil utilisateur (modale) */
  ProfileModal: undefined;
  /** Centre de notifications (modale) */
  NotificationsModal: undefined;
  /** Paramètres (modale ou stack) */
  SettingsModal: undefined;
  /** Sous-paramètres Notifications */
  NotificationSettings: undefined;
  /** Sous-paramètres Affichage */
  DisplaySettings: undefined;
  /** À propos */
  AboutModal: undefined;
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPES MÉTIER
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentType =
  | 'CODE'
  | 'LOI'
  | 'DECRET'
  | 'JURISPRUDENCE'
  | 'ORDONNANCE'
  | 'REGLEMENT';

export type DocumentStatus = 'EN_VIGUEUR' | 'ABROGE' | 'MODIFIE';

export type LegalDomain =
  | 'civil'
  | 'penal'
  | 'commercial'
  | 'administratif'
  | 'social'
  | 'constitutionnel'
  | 'international';

export type ActualiteCategory =
  | 'legislation'
  | 'jurisprudence'
  | 'doctrine'
  | 'institutions'
  | 'concours';

export type ConcoursStatus = 'OUVERT' | 'FERME' | 'A_VENIR';

export type UserProfile = 'etudiant' | 'professionnel';

export interface DocumentFilters {
  types?: DocumentType[];
  domains?: LegalDomain[];
  status?: DocumentStatus;
  dateFrom?: string;
  dateTo?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION DE NAVIGATION — DÉFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuration des onglets de la MainTabBar
 */
export const TABS_CONFIG = [
  {
    name: 'BibliothequeTab' as const,
    label: 'Bibliothèque',
    iconName: 'book-open',          // icône outline
    iconNameActive: 'book-open',    // même icône, couleur différente
    badgeKey: null,                 // pas de badge
    stackName: 'BibliothequeStack',
  },
  {
    name: 'ActualitesTab' as const,
    label: 'Actualités',
    iconName: 'newspaper',
    iconNameActive: 'newspaper',
    badgeKey: 'unreadActualites' as const, // badge numérique
    stackName: 'ActualitesStack',
  },
  {
    name: 'AlexiaTab' as const,
    label: 'Alexia',
    iconName: 'wig',                // icône custom SVG perruque
    iconNameActive: 'wig',
    badgeKey: null,
    stackName: 'AlexiaStack',
    isCustomIcon: true,             // utilise le composant SVG custom
  },
  {
    name: 'ConcoursTab' as const,
    label: 'Concours',
    iconName: 'trophy',
    iconNameActive: 'trophy',
    badgeKey: 'openConcours' as const,
    stackName: 'ConcoursStack',
  },
] as const;

/**
 * Options de header par défaut pour chaque stack
 * (à passer dans screenOptions de Navigator)
 */
export const STACK_SCREEN_OPTIONS = {
  /** Options communes à tous les stacks */
  common: {
    headerShown: false,         // on utilise nos propres headers
    animation: 'slide_from_right' as const,
    animationDuration: 250,
    gestureEnabled: true,
  },

  /** Options pour le stack Auth */
  auth: {
    headerShown: false,
    animation: 'fade' as const,
  },

  /** Options pour les modales */
  modal: {
    presentation: 'modal' as const,
    animation: 'slide_from_bottom' as const,
    gestureEnabled: true,
    gestureDirection: 'vertical' as const,
  },

  /** Options pour BottomSheet simulé via navigation */
  bottomSheet: {
    presentation: 'transparentModal' as const,
    animation: 'fade' as const,
    headerShown: false,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// DEEP LINK CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Configuration du deep linking pour Expo / React Navigation
 * À passer dans le prop `linking` du NavigationContainer
 *
 * Usage dans app/_layout.tsx :
 *   import { LINKING_CONFIG } from '@/src/navigation/structure';
 *   <NavigationContainer linking={LINKING_CONFIG}>
 */
export const LINKING_CONFIG = {
  prefixes: ['wilex://', 'https://wilex.ci'],
  config: {
    screens: {
      Auth: {
        screens: {
          Onboarding: 'onboarding',
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          BibliothequeTab: {
            screens: {
              BibliothequeHome: 'bibliotheque',
              SearchResults: {
                path: 'bibliotheque/recherche',
                parse: {
                  query: String,
                },
              },
              RecueilDetail: {
                path: 'bibliotheque/texte/:textId',
                parse: {
                  textId: String,
                },
              },
              TextReader: {
                path: 'bibliotheque/lecteur/:textId',
                parse: {
                  textId: String,
                  versionId: String,
                  articleNumber: Number,
                },
              },
              VersionHistory: {
                path: 'bibliotheque/texte/:textId/versions',
                parse: {
                  textId: String,
                },
              },
              FollowedTexts: 'bibliotheque/mes-textes',
            },
          },
          ActualitesTab: {
            screens: {
              ActualitesFeed: 'actualites',
              ActualiteDetail: {
                path: 'actualites/:actualiteId',
                parse: {
                  actualiteId: String,
                },
              },
            },
          },
          AlexiaTab: {
            screens: {
              AlexiaHome: 'alexia',
              Conversation: {
                path: 'alexia/conversation/:conversationId',
                parse: {
                  conversationId: String,
                },
              },
              ConversationHistory: 'alexia/historique',
            },
          },
          ConcoursTab: {
            screens: {
              ConcoursDashboard: 'concours',
              ConcoursDetail: {
                path: 'concours/:concoursId',
                parse: {
                  concoursId: String,
                },
              },
              QuizModule: {
                path: 'concours/:concoursId/quiz/:subject',
                parse: {
                  concoursId: String,
                  subject: String,
                },
              },
              Annales: {
                path: 'concours/:concoursId/annales',
                parse: {
                  concoursId: String,
                },
              },
              FichesRevision: {
                path: 'concours/:concoursId/fiches',
                parse: {
                  concoursId: String,
                },
              },
            },
          },
        },
      },
      // Modales globales
      ProfileModal: 'profil',
      NotificationsModal: 'notifications',
      SettingsModal: 'parametres',
    },
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE NAVIGATION TYPÉE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helpers pour naviguer vers des écrans spécifiques avec type safety.
 *
 * Usage dans un composant :
 *   import { useNavigation } from '@react-navigation/native';
 *   import { navigateTo } from '@/src/navigation/structure';
 *
 *   const navigation = useNavigation();
 *   navigateTo.textReader(navigation, { textId: '123', articleNumber: 5 });
 */
export const navigateTo = {
  /** Ouvrir une fiche recueil */
  recueilDetail: (
    navigation: any,
    params: BibliothequeStackParamList['RecueilDetail'],
  ) => navigation.navigate('BibliothequeTab', {
    screen: 'RecueilDetail',
    params,
  }),

  /** Ouvrir le lecteur (depuis CitationCard ou fiche recueil) */
  textReader: (
    navigation: any,
    params: BibliothequeStackParamList['TextReader'],
  ) => navigation.navigate('BibliothequeTab', {
    screen: 'TextReader',
    params,
  }),

  /** Ouvrir les résultats de recherche */
  searchResults: (
    navigation: any,
    params: BibliothequeStackParamList['SearchResults'],
  ) => navigation.navigate('BibliothequeTab', {
    screen: 'SearchResults',
    params,
  }),

  /** Ouvrir une actualité */
  actualiteDetail: (
    navigation: any,
    params: ActualitesStackParamList['ActualiteDetail'],
  ) => navigation.navigate('ActualitesTab', {
    screen: 'ActualiteDetail',
    params,
  }),

  /** Ouvrir ou créer une conversation Alexia */
  conversation: (
    navigation: any,
    params: AlexiaStackParamList['Conversation'],
  ) => navigation.navigate('AlexiaTab', {
    screen: 'Conversation',
    params,
  }),

  /** Nouvelle conversation Alexia depuis une fiche recueil */
  askAlexiaAboutText: (
    navigation: any,
    textId: string,
    textTitle: string,
    question?: string,
  ) => navigation.navigate('AlexiaTab', {
    screen: 'Conversation',
    params: {
      contextTextId: textId,
      contextTextTitle: textTitle,
      initialQuestion: question,
    },
  }),

  /** Ouvrir une fiche concours */
  concoursDetail: (
    navigation: any,
    params: ConcoursStackParamList['ConcoursDetail'],
  ) => navigation.navigate('ConcoursTab', {
    screen: 'ConcoursDetail',
    params,
  }),

  /** Lancer un quiz */
  quizModule: (
    navigation: any,
    params: ConcoursStackParamList['QuizModule'],
  ) => navigation.navigate('ConcoursTab', {
    screen: 'QuizModule',
    params,
  }),

  /** Ouvrir les notifications */
  notifications: (navigation: any) =>
    navigation.navigate('NotificationsModal'),

  /** Ouvrir le profil */
  profile: (navigation: any) =>
    navigation.navigate('ProfileModal'),

  /** Ouvrir les paramètres */
  settings: (navigation: any) =>
    navigation.navigate('SettingsModal'),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURE COMPLÈTE EN COMMENTAIRE (référence visuelle)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * ARBORESCENCE COMPLÈTE DE NAVIGATION WILEX
 * ==========================================
 *
 * RootStack (createNativeStackNavigator)
 * ├── Auth (createNativeStackNavigator) — if !isAuthenticated
 * │   ├── Onboarding           → app/(onboarding)/index.tsx
 * │   │     (géré avec état local + FlatList/PagerView, 3 pages)
 * │   ├── Login                → app/(auth)/login.tsx
 * │   ├── Register             → app/(auth)/register.tsx
 * │   └── ForgotPassword       → app/(auth)/forgot-password.tsx
 * │
 * ├── Main (createBottomTabNavigator) — if isAuthenticated
 * │   ├── BibliothequeTab (createNativeStackNavigator)
 * │   │   ├── BibliothequeHome     → app/(tabs)/bibliotheque/index.tsx
 * │   │   ├── SearchResults        → app/(tabs)/bibliotheque/search.tsx
 * │   │   ├── RecueilDetail        → app/(tabs)/bibliotheque/[textId].tsx
 * │   │   ├── TextReader           → app/(tabs)/bibliotheque/[textId]/read.tsx
 * │   │   ├── VersionHistory       → app/(tabs)/bibliotheque/[textId]/versions.tsx
 * │   │   └── FollowedTexts        → app/(tabs)/bibliotheque/suivis.tsx
 * │   │
 * │   ├── ActualitesTab (createNativeStackNavigator)
 * │   │   ├── ActualitesFeed       → app/(tabs)/actualites/index.tsx
 * │   │   └── ActualiteDetail      → app/(tabs)/actualites/[actualiteId].tsx
 * │   │
 * │   ├── AlexiaTab (createNativeStackNavigator)
 * │   │   ├── AlexiaHome           → app/(tabs)/alexia/index.tsx
 * │   │   ├── Conversation         → app/(tabs)/alexia/[conversationId].tsx
 * │   │   └── ConversationHistory  → app/(tabs)/alexia/historique.tsx
 * │   │
 * │   └── ConcoursTab (createNativeStackNavigator)
 * │       ├── ConcoursDashboard    → app/(tabs)/concours/index.tsx
 * │       ├── ConcoursDetail       → app/(tabs)/concours/[concoursId].tsx
 * │       ├── QuizModule           → app/(tabs)/concours/quiz.tsx
 * │       ├── QuizResults          → app/(tabs)/concours/quiz-results.tsx
 * │       ├── Annales              → app/(tabs)/concours/annales.tsx
 * │       ├── FichesRevision       → app/(tabs)/concours/fiches.tsx
 * │       └── ProgressionStats     → app/(tabs)/concours/progression.tsx
 * │
 * ├── ProfileModal             (presentation: 'modal')
 * │     → app/modal/profile.tsx
 * ├── NotificationsModal       (presentation: 'modal')
 * │     → app/modal/notifications.tsx
 * ├── SettingsModal            (presentation: 'modal')
 * │     → app/modal/settings.tsx
 * ├── NotificationSettings     (dans SettingsModal stack)
 * │     → app/modal/settings/notifications.tsx
 * ├── DisplaySettings          (dans SettingsModal stack)
 * │     → app/modal/settings/display.tsx
 * └── AboutModal               (dans SettingsModal stack)
 *       → app/modal/settings/about.tsx
 *
 *
 * TRANSITIONS PERSONNALISÉES :
 * ─────────────────────────────
 * Auth → Main              : fade (durationSlow 400ms)
 * Stack screens            : slide_from_right (durationBase 250ms)
 * Modales                  : slide_from_bottom (durationBase 250ms)
 * Tab switch               : fade (durationFast 150ms)
 * TextReader ← CitationCard: nested navigation + highlight animation
 *
 *
 * GESTION DE L'ÉTAT :
 * ───────────────────
 * isAuthenticated          : Zustand store (AuthStore)
 * isOnboardingDone         : AsyncStorage → AppStateContext
 * unreadNotificationsCount : React Query / SWR
 * activeFilters            : local state dans SearchResults
 * conversationMessages     : local state + persistence AsyncStorage
 *
 *
 * EXPO ROUTER INTEGRATION :
 * ──────────────────────────
 * Ce projet utilise Expo Router v6 (file-based routing).
 * La structure de navigation ci-dessus est traduite en structure
 * de fichiers dans le répertoire app/.
 *
 * Expo Router génère automatiquement la navigation à partir
 * de la structure de fichiers. Les noms de groupes entre
 * parenthèses (onboarding), (auth), (tabs) créent des
 * segments de route logiques sans affecter l'URL.
 *
 * Les paramètres dynamiques utilisent la convention [param].tsx
 * Les layouts de groupe utilisent _layout.tsx
 */

