# WILEX — Maquettes & Wireframes
> Design System · Bibliothèque juridique ivoirienne · Expo Managed Workflow

---

## Conventions des maquettes
- `[  ]` = zone de contenu / composant
- `━━━` = séparateur / bordure
- `▓▓▓` = image / média
- `●` = bouton radio / checkbox active · `○` = inactive
- `[▶]` = bouton · `[×]` = fermer · `[←]` = retour
- `〜` = scroll infini / contenu qui continue
- Dimensions indicatives : écran 390×844px (iPhone 14)
- SafeAreaInsets : top ~47px, bottom ~34px

---

## ÉCRANS TRANSVERSAUX

---

### 1. SPLASH SCREEN

```
┌─────────────────────────────────┐
│         ▒▒▒▒▒▒▒▒▒               │ SafeArea top
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
│         ┌─────────┐             │
│         │         │             │
│         │  WILEX  │             │ Typography.display · 52px · #FFFFFF
│         │         │             │ fontFamily: PlayfairDisplay-Bold
│         └─────────┘             │
│    BIBLIOTHÈQUE JURIDIQUE       │ caption · uppercase · letterSpacing 1
│         IVOIRIENNE              │ couleur: rgba(255,255,255,0.5)
│                                 │
│                                 │
│                                 │
│                                 │ Fond: ink (#0F0E0C)
└─────────────────────────────────┘
```

**Animation :** Logo fade-in (opacity 0→1, durationSlow 400ms, ease-out) · pause 800ms · fade-out (durationBase 250ms) → transition vers Onboarding ou Home.

---

### 2. ONBOARDING — Écran 1/3

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│                          [Passer]│ label · textTertiary · top right
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │   ░░ Illustration SVG ░░   ││ 260px hauteur · minimaliste
│  │   (textes de loi stylisés,  ││ tons ink + ivory + forest
│  │    colonnes de code civil)   ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  Tout le droit                  │ Typography.h1 · PlayfairDisplay
│  ivoirien en poche              │ textPrimary · textAlign center
│                                 │
│  Accédez à tous les codes,      │ Typography.bodyLarge · Lora
│  lois, décrets et jurisprudences│ textSecondary · textAlign center
│  de Côte d'Ivoire en un clic.   │
│                                 │
│         ● ○ ○                   │ Pagination dots · 3 dots
│                                 │ Dot active: 24px wide · accentPrimary
│  ┌─────────────────────────────┐│
│  │         Suivant    →        ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

**Interaction :** Swipe horizontal gauche → Écran 2 · animation slide (durationBase 250ms, spring).

---

### 3. ONBOARDING — Écran 2/3

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│                          [Passer]│
│                                 │
│  4 outils,                      │ Typography.h1 · PlayfairDisplay
│  1 seule application            │ textPrimary · paddingHorizontal 24
│                                 │
│  ┌──────────┐  ┌──────────┐    │
│  │ 📚       │  │ 📰       │    │ Grille 2×2 · gap 16px
│  │Bibliothè-│  │Actualités│    │ Chaque item : icon 40px + label
│  │   que    │  │          │    │ backgroundColor: surfaceRaised
│  └──────────┘  └──────────┘    │ borderRadius: xl · padding 20px
│  ┌──────────┐  ┌──────────┐    │ border: 1px borderSubtle
│  │ ⚖️       │  │ 🏆       │    │
│  │  Alexia  │  │ Concours │    │ Animation: chaque icône apparaît
│  │   (IA)   │  │          │    │ séquentiellement (150ms d'écart)
│  └──────────┘  └──────────┘    │ fade + slide-up
│                                 │
│  Chaque outil conçu pour        │ Typography.body · textSecondary
│  répondre à vos besoins         │ textAlign center
│  juridiques quotidiens.         │
│                                 │
│         ○ ● ○                   │
│                                 │
│  ┌─────────────────────────────┐│
│  │         Suivant    →        ││
│  └─────────────────────────────┘│
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 4. ONBOARDING — Écran 3/3

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │      ┌──────────────┐       ││ Icône perruque magistrat · 80px
│  │      │   ~(Wig)~    │       ││ Fond ivoire · border-radius full
│  │      │  ╭──────╮    │       ││ Animation pulse (scale 1→1.05→1)
│  │      │  │ALEXIA│    │       ││ durationVerySlow · loop x3
│  │      │  ╰──────╯    │       ││
│  │      └──────────────┘       ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  Alexia, votre guide            │ Typography.h1 · PlayfairDisplay
│  juridique IA                   │ textPrimary · textAlign center
│                                 │
│  Posez vos questions en langage │ Typography.bodyLarge · Lora
│  naturel. Alexia analyse le     │ textSecondary · textAlign center
│  droit ivoirien et cite toujours│ lineHeight 28
│  ses sources.                   │
│                                 │
│         ○ ○ ●                   │
│                                 │
│  ┌─────────────────────────────┐│
│  │       Commencer →           ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │       J'ai déjà un compte   ││ ButtonGhost · sizeMd · fullWidth
│  └─────────────────────────────┘│
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 5. AUTH — Connexion

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│                                 │
│                                 │
│             WILEX               │ Typography.display · 52px
│     Bibliothèque juridique      │ Typography.body · textSecondary
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ Séparateur borderSubtle
│                                 │
│  ┌─────────────────────────────┐│
│  │ Adresse email               ││ InputField · label flottant
│  │ jean.dupont@exemple.ci      ││ height 52px
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Mot de passe           👁   ││ InputField + toggle visibilité
│  │ ••••••••••••                ││
│  └─────────────────────────────┘│
│                   Mot de passe ?│ label · accentPrimary · align right
│                                 │
│  ┌─────────────────────────────┐│
│  │        Se connecter         ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│
│                                 │
│    ━━━━━━━━━  ou  ━━━━━━━━━    │ Séparateur avec texte centré
│                                 │
│         Créer un compte →       │ ButtonGhost · sizeMd · accentPrimary
│                                 │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

**États :** Champ email validé → icône ✓ success · Champ invalide → bordure error + message sous le champ · Bouton connexion loading → spinner inline remplace le texte.

---

### 6. AUTH — Inscription

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Créer un compte           │ TopHeader back · h4 · textPrimary
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ┌──────────┐ ┌───────────────┐ │
│  │ Prénom   │ │ Nom           │ │ 2 InputField côte à côte · flex 1
│  └──────────┘ └───────────────┘ │
│  ┌─────────────────────────────┐│
│  │ Adresse email               ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Mot de passe           👁   ││
│  └─────────────────────────────┘│
│                                 │
│  Je suis...                     │ h4 · textPrimary · marginBottom 12
│                                 │
│  ┌──────────────┐ ┌────────────┐│
│  │  🎓          │ │  ⚖️        ││ profileOption card
│  │              │ │            ││ width: flex 1 · height: 90px
│  │  Étudiant    │ │Professionnel│ borderRadius lg · border 1.5px
│  │  en droit    │ │ du droit   ││ sélectionné: borderColor accentPrimary
│  └──────────────┘ └────────────┘│ + bg accentPrimary8
│                                 │
│  ┌─────────────────────────────┐│
│  │      Créer mon compte       ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│
│                                 │
│  En créant un compte, j'accepte │ caption · textTertiary · center
│  les CGU et la Politique        │
│  de confidentialité.            │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 7. AUTH — Mot de passe oublié

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Mot de passe oublié       │ TopHeader back
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  📧                             │ Icône email 48px · textTertiary
│                                 │
│  Réinitialiser                  │ Typography.h2 · textPrimary
│  votre mot de passe             │
│                                 │
│  Saisissez votre adresse email. │ Typography.body · textSecondary
│  Nous vous enverrons un lien de │
│  réinitialisation.              │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Adresse email               ││ InputField
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │     Envoyer le lien         ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│
│                                 │
│  ← Retour à la connexion        │ ButtonGhost · link vers Login
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

**État confirmation :** Après envoi → fond success, icône ✓, message "Email envoyé ! Vérifiez votre boîte mail."

---

## MODULE 1 — BIBLIOTHÈQUE

---

### 8. ACCUEIL BIBLIOTHÈQUE

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ TopHeader : search variant
│  ┌─────────────────────────────┐│
│  │ 🔍 Rechercher un texte...   ││ SearchBar HÉRO · height 56px
│  └─────────────────────────────┘│ shadow2 · borderRadius xl
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ paddingHorizontal 16
│                                 │
│  ←─── FilterRow (scroll) ──────→│ paddingLeft 16 · gap 8 · py 12
│  [Tous] [Codes] [Lois] [Décrets]│ FilterChip : active = accentPrimary
│  [Jurisprudences] [Ordonnances]〜│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  Mes textes suivis      Voir tout│ section.header · h4 + link
│  ←── ScrollView horizontal ───→ │
│  ┌────────────┐ ┌─────────────┐ │ CardDocument compact · width 200
│  │[CODE]  ❤️  │ │[LOI]   ❤️  │ │ gap 12px · paddingLeft 16
│  │ Code Civil  │ │Loi Travail  │ │
│  │ Droit civil │ │ Droit social│ │
│  │ 12 jan 2024 │ │ 05 mar 2024 │ │
│  └────────────┘ └─────────────┘ │
│                                 │
│  Récemment consultés   Voir tout│ section.header
│  ←── ScrollView horizontal ───→ │
│  ┌────────────┐ ┌─────────────┐ │
│  │[DÉCRET]    │ │[JURISP.]    │ │
│  │ Décret 2023│ │ TGI Abidjan │ │
│  │ Commercial  │ │ 2024        │ │
│  └────────────┘ └─────────────┘ │
│                                 │
│  Récemment modifiés             │ section.header
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📄 Code du Travail        ›    │ ListItemDocument · borderBottom
│     Droit social · 03/03/2024   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📄 Loi RHDP 2023          ›    │
│     Droit public · 28/02/2024   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│         〜 (scroll)             │
└─────────────────────────────────┘
```

**Interactions :** Tap SearchBar héro → focus + animation expansion · Tap FilterChip → filtre actif (style active) + refresh de la liste · Tap "Voir tout" → naviguer vers l'écran liste correspondant · Tap CardDocument → Fiche Recueil · Swipe horizontal sur sections → carousel natif.

**États :**
- Chargement : SkeletonLoader variante card × 4
- Mes textes suivis vide : EmptyState "bibliotheque-vide" + CTA "Explorer la bibliothèque"

---

### 9. RÉSULTATS DE RECHERCHE

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←] ┌──────────────────────┐  │ TopHeader search variant
│       │ 🔍 code du travail  ×│  │ SearchBar pré-remplie
│       └──────────────────────┘  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  23 résultats · Pertinence ▼    │ bodySmall textSecondary + sélecteur
│                                 │
│  ←── FilterRow (filtres actifs) │
│  [×Loi] [×Droit social] [+Filtres]│ Chips actifs montrent × pour retirer
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ┌─────────────────────────────┐│
│  │ [LOI]       EN VIGUEUR   ❤️ ││ CardDocument · shadow2
│  │ Code du Travail ivoirien    ││ h3 · PlayfairDisplay
│  │ Droit social                ││ bodySmall · textSecondary
│  │ Modifié le 15 janvier 2024  ││ caption · textTertiary
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ [DÉCRET]    MODIFIÉ      ❤️ ││
│  │ Décret n°2023-472           ││
│  │ Droit du travail · 2023     ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [JURISPRUDENCE] EN VIGUEUR  ││
│  │ Cour Suprême - Arrêt 2024   ││
│  └─────────────────────────────┘│
│                〜                │ Infinite scroll
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

**Tri :** Pertinence | Date | Alphabétique → `ActionSheet` iOS / `Menu` Android · tap sélecteur.
**Filtres :** Tap "[+Filtres]" → `FilterSheet` (bottom sheet tall).

---

### 10. FILTRES AVANCÉS (FilterSheet)

```
┌─────────────────────────────────┐
│                                 │
│         ╌╌╌╌╌╌╌╌                │ Drag handle · 36px · borderRadius full
│  Filtres               [Réinit.]│ h4 + ButtonGhost reset
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  TYPE DE TEXTE                  │ label uppercase · letterSpacing 0.8
│  ┌─────────────────────────────┐│
│  │ ○ Code        ○ Loi        ││ Checkboxes multiples · rows de 2
│  │ ○ Décret      ○ Jurisprud. ││ bodySmall + checkbox custom 20px
│  │ ○ Ordonnance  ○ Règlement  ││
│  └─────────────────────────────┘│
│                                 │
│  DOMAINE JURIDIQUE              │ label uppercase
│  ┌─────────────────────────────┐│
│  │ ○ Droit civil               ││
│  │ ○ Droit pénal               ││
│  │ ○ Droit commercial          ││
│  │ ○ Droit administratif       ││
│  │ ○ Droit social              ││
│  │ ○ Droit constitutionnel     ││
│  │ ○ Droit international       ││
│  └─────────────────────────────┘│
│                                 │
│  PÉRIODE                        │ label uppercase
│  De [01/01/2020] à [05/03/2024] │ DatePicker row · 2 champs · arrow
│                                 │
│  STATUT                         │ label uppercase
│  ● En vigueur  ○ Abrogé  ○ Tous │ RadioGroup · 3 options horizontales
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ sticky footer separator
│  ┌─────────────────────────────┐│ sticky bottom
│  │  Appliquer les filtres (4)  ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│ badge (4) = nombre de filtres actifs
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 11. FICHE RECUEIL

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]              [↗] [🔔]      │ TopHeader transparent sur le dégradé
│                                 │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ Fond dégradé : ink → forest (120px)
│  ▓ [CODE]     ● EN VIGUEUR   ▓ │ Badge type + Badge statut
│  ▓                           ▓ │ couleur badge = DocumentTypeBadge
│  ▓ Code Civil                ▓ │ Typography.h1 · #FFFFFF
│  ▓ de Côte d'Ivoire          ▓ │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ Surface blanche commence
│                                 │
│  Droit civil · Droit des        │ body · textSecondary
│  personnes et de la famille     │
│  Dernière modification : 15/01/2024│ caption · textTertiary
│                                 │
│  Le Code Civil ivoirien régit   │ bodyLarge · Lora · lineHeight 26
│  les relations entre les per-   │ Collapsible si > 3 lignes
│  sonnes physiques et morales…   │ [Voir plus ↓]
│                                 │
│  ┌─────────────────────────────┐│
│  │    ❤️  Ne plus suivre      ││ ButtonSecondary si suivi
│  └─────────────────────────────┘│ ButtonPrimary si non-suivi "Suivre"
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  VERSION EN VIGUEUR             │ label uppercase · textTertiary
│                                 │
│  Version 3.2 · Mise à jour 2023 │ body · textPrimary
│  ┌─────────────────────────────┐│
│  │      📖  Lire le texte      ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  HISTORIQUE DES VERSIONS        │ section.header + "Voir tout"
│                                 │
│  ● v3.2 · 15/01/2024           │ VersionTimeline (3 dernières)
│  │  Modification articles 45-48 │
│  ○ v3.1 · 04/06/2022           │
│  │  Ajout dispositions OHADA    │
│  ○ v3.0 · 12/03/2019           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ACTUALITÉS LIÉES               │ section.header
│  ┌─────────────────────────────┐│ CardActualite compact
│  │▓▓│ Réforme Code Civil 2024  ││
│  │  │ Législation · 2 fév 2024 ││
│  └─────────────────────────────┘│
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 12. LECTEUR DE TEXTE

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←] Code Civil ivoirien  🔍📌↗📋│ TopHeader minimaliste
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ▬▬▬▬▬▬▬▬▬▬░░░░░░░░░░░░░░░░░░  │ Barre progression : 3px · accentPrimary
│                                 │ opacity 0.6 · top: 0 absolue
│  TITRE PREMIER                  │ sectionTitle · uppercase · textTertiary
│  Des personnes physiques        │
│                                 │
│  Chapitre I — De la             │ h4 · PlayfairDisplay
│  personnalité juridique         │
│                                 │
│  Art. 1  Le Code Civil de Côte  │ articleRow : numéro gauche (40px)
│          d'Ivoire régit les     │ + corps Lora 16px · lineHeight 28
│          relations entre les    │
│          personnes physiques et │
│          morales, les actes et  │
│          les faits juridiques…  │
│                                 │
│  Art. 2  Toute personne humaine │ articleNumber: caption textTertiary
│          est dotée de la        │ articleBody: Lora · textPrimary
│          personnalité juridique │
│          dès sa naissance…      │
│                                 │
│           ════════════════      │ [Texte sélectionné →]
│           ║ Surligner ║ Copier ║ Partager ║ Annoter ║
│           ════════════════      │ HighlightMenu · surfaceInk · shadow5
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ArticleNavigator sticky bottom
│  [← Art. précédent]  Art. 2/86  [Art. suivant →]│
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

**Interactions :**
- Tap 📋 (sommaire) → BottomSheet avec TableOfContents · snap 70%
- Long press sur texte → HighlightMenu apparaît au-dessus de la sélection
- Surlignage → 3 couleurs : jaune (gold8), vert (forest15), rose (#FFE4E4)
- Tap 📌 → ajoute un signet sur l'article courant

---

### 13. HISTORIQUE DES VERSIONS

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Historique des versions   │ TopHeader back
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Code Civil de Côte d'Ivoire    │ h3 · PlayfairDisplay · px16
│                                 │
│  ●━━━━  v3.2 — 15 janv. 2024    │ VersionTimeline
│  │      JORCI n°42 du 20/01/24  │ dot active (16px) · accentPrimary
│  │      Modification des art.   │ body · textPrimary
│  │      45 à 48 relatifs aux    │ bodySmall · textSecondary
│  │      successions ab intestat │
│  │      ┌────────────────────┐  │
│  │      │ Consulter cette    │  │ ButtonSecondary · sizeSm
│  │      │ version            │  │
│  │      └────────────────────┘  │
│  │                              │
│  ○─────  v3.1 — 04 juin 2022    │ dot inactif (12px) · borderDefault
│  │       JORCI n°28             │
│  │       Intégration des        │
│  │       dispositions OHADA...  │
│  │       ┌────────────────────┐ │
│  │       │ Consulter          │ │
│  │       └────────────────────┘ │
│  │                              │
│  ○─────  v3.0 — 12 mars 2019   │
│  │       Version initiale       │
│  │       consolidée             │
│  │       ┌────────────────────┐ │
│  │       │ Consulter          │ │
│  │       └────────────────────┘ │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 14. MES TEXTES SUIVIS

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  Mes textes suivis              │ TopHeader · h4
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ←── FilterRow (domaines) ─────→│
│  [Tous] [Civil] [Pénal] [Social]│
│  [Commercial] [Administratif]〜  │
│                                 │
│  ┌─────────────────────────────┐│ Swipe gauche →
│  │ [CODE]   ● EN VIGUEUR    ❤️ ││  [ Ne plus suivre ]  (destructif)
│  │ Code Civil                  ││  backgroundColor: error
│  │ Droit civil · 15/01/2024    ││  label: caption · #FFFFFF
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [LOI]    MODIFIÉ          ❤️││
│  │ Code du Travail             ││
│  │ Droit social · 03/03/2024   ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ [DÉCRET] ● EN VIGUEUR     ❤️││
│  │ Décret n°2023-472           ││
│  │ Droit commercial · 2023     ││
│  └─────────────────────────────┘│
│                〜                │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

**État vide :** EmptyState · icône bibliothèque vide · titre "Aucun texte suivi" · sous-titre "Suivez des textes juridiques pour être notifié de leurs mises à jour." · CTA "Explorer la bibliothèque".

---

## MODULE 2 — ACTUALITÉS

---

### 15. FEED ACTUALITÉS

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  Actualités              [🔽]   │ TopHeader default · titre + icône filtre
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ←── FilterRow ───────────────→ │
│  [Tous] [Législation] [Jurisprud│
│  [Doctrine] [Institutions]〜     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ┌─────────────────────────────┐│
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ││ Image 16:9 · borderRadius lg haut
│  │                             ││
│  │ [LÉGISLATION]   ● Suivi    ││ badge catégorie + dot accentPrimary
│  │ Nouvelle réforme du Code    ││ h3 · PlayfairDisplay · 2 lignes max
│  │ du Travail : ce qui change  ││
│  │ 05 mars 2024 · 4 min de lect│ caption · textTertiary
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ││
│  │ [JURISPRUDENCE]             ││
│  │ Cour Suprême : arrêt majeur ││
│  │ sur la propriété foncière   ││
│  │ 03 mars 2024 · 6 min de lect│
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ││
│  │ [CONCOURS]                  ││
│  │ Ouverture du concours de la ││
│  │ magistrature 2024           ││
│  │ 01 mars 2024 · 3 min de lect│
│  └─────────────────────────────┘│
│                〜                │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 16. DÉTAIL ACTUALITÉ

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]                   [↗] [🔖]│ TopHeader transparent
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ Image hero · fullwidth · 16:9
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ Dégradé noir en bas de l'image
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  [LÉGISLATION]                  │ Badge catégorie coloré
│  05 mars 2024 · 4 min de lecture│ caption · textTertiary · flex row
│                                 │
│  Nouvelle réforme du Code du    │ Typography.h1 · PlayfairDisplay
│  Travail : ce qui change pour   │ lineHeight 40 · textPrimary
│  les employeurs et salariés     │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  La loi n°2024-117 du 28 fév.  │ Typography.articleBody · Lora
│  2024 portant modification du   │ fontSize 16 · lineHeight 28
│  Code du Travail apporte des    │ textPrimary
│  changements significatifs...   │
│                                 │
│  [Paragraphe 2]...              │ Suite du corps de l'article
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  TEXTES DE LOI MENTIONNÉS       │ label uppercase · textTertiary
│                                 │
│  📄 Code du Travail ivoirien  › │ ListItemDocument · lien deep link
│  📄 Loi n°2024-117            › │
│  📄 Décret d'application      › │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  VOIR AUSSI                     │ section.header
│                                 │
│  [CardActualite compact × 3]    │ Layout vertical · gap 12
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

## MODULE 3 — ALEXIA

---

### 17. ACCUEIL ALEXIA

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ TopHeader alexia variant
│  [Perruque]  Alexia    [historiq]│ icône 24px · h3 centré · icône horloge
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ fond: alexiaBackground (ivory)
│                                 │
│  ┌─────────────────────────────┐│ backgroundColor: ivory
│  │                             ││
│  │     ┌───────────────┐       ││
│  │     │   ~(Wig)~     │       ││ Icône perruque 80px · fond ivory
│  │     │  Magistrat    │       ││ border: 1px borderSubtle · shadow2
│  │     └───────────────┘       ││ borderRadius: full
│  │                             ││
│  │ Bonjour, je suis Alexia     ││ h2 · PlayfairDisplay · center
│  │                             ││
│  │ Posez-moi vos questions sur ││ body · Lora · textSecondary · center
│  │ le droit ivoirien — je cite ││ lineHeight 24
│  │ toujours mes sources.       ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  Questions fréquentes           │ h4 · textPrimary
│                                 │
│  ┌─────────────────┐ ┌────────┐ │ Grille 2 colonnes · gap 8
│  │ Qu'est-ce que   │ │Comment │ │ SuggestedQuestion · height auto
│  │ le contrat de   │ │porter  │ │ backgroundColor surfaceRaised
│  │ travail à durée │ │plainte │ │ border: 1px borderSubtle
│  │ indéterminée ?  │ │en CI ? │ │ borderRadius lg · shadow1
│  └─────────────────┘ └────────┘ │
│  ┌─────────────────┐ ┌────────┐ │
│  │ Droits du       │ │Qu'est- │ │
│  │ locataire en CI │ │ce que  │ │
│  │                 │ │l'OHADA?│ │
│  └─────────────────┘ └────────┘ │
│  ┌─────────────────┐ ┌────────┐ │
│  │ Procédure de    │ │Droit de│ │
│  │ divorce en      │ │succéder│ │
│  │ Côte d'Ivoire   │ │en CI   │ │
│  └─────────────────┘ └────────┘ │
│                                 │
│  Conversations récentes         │ h4 + "Voir tout"
│  [CardConversationAlexia × 2]   │
│                                 │
│                    ┌───┐        │ FAB · right 16 · bottom 24+inset
│                    │ + │        │ backgroundColor: accentPrimary
│                    └───┘        │ shadow4 + shadowAccent
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 18. INTERFACE DE CONVERSATION ALEXIA

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←] Contrat de travail   [🗑]  │ TopHeader back · titre auto-généré
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ icône corbeille → Modal confirmation
│                                 │ backgroundColor: alexiaBackground
│                    ┌──────────┐ │ MessageBubbleUser
│                    │ Qu'est-ce│ │ alignSelf: flex-end · maxWidth 80%
│                    │ que le   │ │ backgroundColor: userBubble (forest)
│                    │ CDI en   │ │ color: #FFFFFF · borderRadius xl
│                    │ Côte     │ │ borderBottomRightRadius md
│                    │ d'Ivoire?│ │
│                    │ 14:32    │ │ timestamp: caption textTertiary
│                    └──────────┘ │
│                                 │
│  ○  ┌────────────────────────┐  │ MessageBubbleAlexia
│ wig │ Le contrat à durée     │  │ icône perruque 28px (cercle ivory)
│  │  │ indéterminée (CDI) est │  │ bulle: backgroundColor alexiaBubble
│  │  │ défini par l'article 14│  │ border: 1px alexiaBubbleBorder
│  │  │ du Code du Travail     │  │ borderRadius xl · borderBottomLeft md
│  │  │ ivoirien comme le      │  │
│  │  │ contrat de droit        │  │
│  │  │ commun en matière de   │  │
│  │  │ travail salarié...     │  │
│  │  │                        │  │
│  │  │ ┌──────────────────┐   │  │ CitationCard intégrée dans la bulle
│  │  │ │📄 Code du Travail│   │  │ backgroundColor: citationBackground
│  │  │ │ Art. 14 — Déf.   │   │  │ borderLeft 3px accentPrimary
│  │  │ │ du contrat CDI   │   │  │
│  │  │ │ Consulter →      │   │  │ lien → deep link Lecteur
│  │  │ └──────────────────┘   │  │
│  │  │                    14:33│  │
│  │  └────────────────────────┘  │
│                                 │
│  ○  ⠶⠦⠧                        │ TypingIndicator · 3 dots bounce
│                                 │ dans une bulle Alexia miniature
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ┌────────────────────────┐ [→] │ InputField multiline + bouton envoi
│  │ Posez votre question.. │     │ max 4 lignes · borderRadius xl
│  └────────────────────────┘     │ sendButton: accentPrimary · 44px
│       Voir les sources (1) ↑    │ Si long msg → bouton "Voir sources"
│  ▒▒▒ SafeArea bottom ▒▒▒       │ ouvre BottomSheet sources
└─────────────────────────────────┘
```

**États bouton envoi :** Texte vide → disabled (backgroundColor borderDefault) · Texte présent → actif (backgroundColor accentPrimary) · Envoyé → loading spinner.

---

### 19. HISTORIQUE DES CONVERSATIONS ALEXIA

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Mes conversations         │ TopHeader back
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ┌─────────────────────────────┐│ SearchBar · placeholder "Rechercher..."
│  │ 🔍 Rechercher...            ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ ○wig │ Contrat de travail CI │ CardConversationAlexia
│  │      │ Qu'est-ce que le CDI?│ · icône perruque 40px
│  │      │ 05/03/2024 · 4 msg   │ · date · nombre messages
│  └─────────────────────────────┘│ Swipe gauche → [ 🗑 Supprimer ]
│  ┌─────────────────────────────┐│ action destructive rouge
│  │ ○wig │ Droits du locataire  │
│  │  ●   │ Mon propriétaire peut│ ● = non lu
│  │      │ 02/03/2024 · 8 msg   │
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ ○wig │ Procédure de divorce │
│  │      │ Quelles sont les éta │
│  │      │ 28/02/2024 · 12 msg  │
│  └─────────────────────────────┘│
│                〜                │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

## MODULE 4 — CONCOURS

---

### 20. TABLEAU DE BORD CONCOURS

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  Concours                       │ TopHeader default
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  En préparation        Voir tout│ section.header
│  ←── ScrollView horizontal ───→ │
│  ┌─────────────────────────────┐│ CardConcours · width 280
│  │ Concours de Magistrature    ││ h3 · PlayfairDisplay
│  │ INFJ Abidjan       [OUVERT] ││ badge statut success
│  │ 📅 Clôture : 30 mars 2024   ││
│  │ ▬▬▬▬▬░░░░░░ 45%            ││ ProgressBar · accentPrimary
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ Concours ENAM               ││
│  │ ENAM Abidjan       [OUVERT] ││
│  │ 📅 Clôture : 15 avr. 2024   ││
│  │ ▬▬░░░░░░░░░░ 20%           ││
│  └─────────────────────────────┘│
│                                 │
│  Concours ouverts               │ section.header
│  ┌─────────────────────────────┐│
│  │[OUVERT] Concours Greffiers  ││ CardConcours liste verticale
│  │ TGI Abidjan                 ││
│  │ 📅 Clôture : 20 avr. 2024   ││
│  └─────────────────────────────┘│
│                                 │
│  À venir                        │ section.header
│  ┌─────────────────────────────┐│
│  │[À VENIR] Concours Notariat  ││
│  │ Chambre des Notaires CI      ││
│  │ 📅 Ouverture : 01 juin 2024  ││
│  └─────────────────────────────┘│
│                                 │
│  Passés  ▼ (accordéon collapsé) │ Tap → expand liste
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 21. FICHE CONCOURS

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]                    [↗][🔖]│ TopHeader back + actions
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  Concours de Magistrature       │ Typography.h1 · PlayfairDisplay
│  INFJ — Institut National de    │ body · textSecondary
│  Formation Judiciaire           │
│                  [● OUVERT]     │ badge success · float right
│                                 │
│  ┌───────┐ ┌──────────┐ ┌─────┐│ StatCard × 3 · flex row · gap 8
│  │ 25/03 │ │  30/03   │ │ juin│ │ value: bodySmall → h4
│  │Ouvert.│ │ Clôture  │ │Réslt│ │ label: caption textTertiary
│  └───────┘ └──────────┘ └─────┘│
│                                 │
│  Description                    │ h4 · textPrimary
│  Le concours d'entrée à l'INFJ │ body · Lora · textSecondary
│  recrute des magistrats pour les│ Collapsible si > 4 lignes
│  juridictions ivoiriennes...    │ [Voir plus]
│                                 │
│  Conditions d'admission         │ h4
│  • Être de nationalité ivoirien │ bodySmall · bullet points
│  • Être titulaire d'un diplôme  │
│    en Droit (Licence min.)      │
│  • Avoir moins de 35 ans        │
│                                 │
│  Matières                       │ h4
│  ←── wrap de FilterChip ───────→│ non-cliquables · style tag
│  [Droit civil] [Droit pénal]    │
│  [Procédure civile] [OHADA]     │
│  [Culture juridique générale]   │
│                                 │
│  SE PRÉPARER                    │ label uppercase · textTertiary
│  ┌─────────┐ ┌────────┐ ┌────┐ │ 3 boutons d'accès secondaire
│  │📝 Quiz  │ │📄 Ann.│ │📖  │ │ ButtonSecondary · size sm
│  │         │ │       │ │Fiche│ │ flex row · gap 8
│  └─────────┘ └────────┘ └────┘ │
│                                 │
│  RESSOURCES RECOMMANDÉES        │ section.header
│  📄 Code de procédure civile  › │ ListItemDocument × N
│  📄 Code pénal ivoirien       › │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 22. MODULE QUIZ

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Droit civil        Q 3/20 │ TopHeader · progression "Q N/Total"
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ▬▬▬▬▬▬▬▬▬▬▬░░░░░░░░░░░ 40%   │ ProgressBar · accentPrimary · top
│                                 │
│  ┌─────────────────────────────┐│ QuizCard · shadow2 · marginH 16
│  │                             ││ gap 24 · borderRadius xl · px 24
│  │ En droit ivoirien, quelle   ││ Typography.bodyLarge · Lora
│  │ est la durée légale de la   ││ lineHeight 28 · textPrimary
│  │ période d'essai maximale    ││
│  │ pour un cadre (CDI) ?       ││
│  │                             ││
│  │ ┌─────────────────────────┐ ││ Options · gap 12
│  │ │ A  3 mois               │ ││ option : border 1.5 borderDefault
│  │ │                         │ ││ height auto · padding 16
│  │ └─────────────────────────┘ ││
│  │ ┌─────────────────────────┐ ││
│  │ │ B  6 mois               │ ││ option sélectionné :
│  │ └─────────────────────────┘ ││ borderColor accentPrimary
│  │ ┌─────────────────────────┐ ││ backgroundColor accentPrimary8
│  │ │ C  12 mois          ●   │ ││ ● = radio sélectionné
│  │ └─────────────────────────┘ ││ [après validation]:
│  │ ┌─────────────────────────┐ ││ ✓ correct → border success + bg
│  │ │ D  18 mois              │ ││ ✗ incorrect → border error + bg
│  │ └─────────────────────────┘ ││
│  │                             ││
│  │ ┌─────────────────────────┐ ││ [Appuyez Valider → révèle explication]
│  │ │  ✓ Correct ! L'article  │ ││ explanation zone
│  │ │  16.3 du Code du        │ ││ backgroundColor surfaceRaised
│  │ │  Travail dispose...     │ ││ borderRadius md · padding 16
│  │ │  ┌─────────────────┐    │ ││
│  │ │  │📄 Code Travail  │    │ ││ CitationCard dans l'explication
│  │ │  │ Art. 16.3 — PE  │    │ ││
│  │ │  │ Consulter →     │    │ ││
│  │ │  └─────────────────┘    │ ││
│  │ └─────────────────────────┘ ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │     Question suivante →     ││ ButtonPrimary · sizeLg · fullWidth
│  └─────────────────────────────┘│ (disabled avant validation)
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

**Animation question :** slide-out vers la gauche (translateX -100%, durationBase) → nouvelle question slide-in depuis la droite (translateX +100% → 0).

---

### 23. ÉCRAN RÉSULTATS QUIZ

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Résultats                 │ TopHeader back
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│           15/20                 │ Typography.display · textPrimary
│           75%                   │ h2 · accentPrimary
│                                 │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬░░░░  75%       │ ProgressBar · height 8px · lg
│                                 │
│  ┌───────────┐ ┌───────────────┐│
│  │    15     │ │       5       ││ StatCard × 2
│  │  Correctes│ │   Incorrectes ││ success color vs error color
│  └───────────┘ └───────────────┘│
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  RÉPARTITION PAR THÈME          │ label uppercase
│                                 │
│  Droit civil       ▬▬▬▬▬▬  80%│ mini ProgressBar par matière
│  Procédure civile  ▬▬▬▬░░  70%│ label + pourcentage
│  OHADA             ▬▬▬▬▬▬  90%│ couleur: success si >70, warning sinon
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ┌─────────────────────────────┐│
│  │      Recommencer le quiz    ││ ButtonSecondary
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │         Voir les erreurs    ││ ButtonGhost · accentPrimary
│  └─────────────────────────────┘│
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 24. ANNALES

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Annales · Magistrature    │ TopHeader back
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  2024                           │ h4 · section year header
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📄 Épreuve de Droit civil      │ ListItem : titre épreuve
│     Droit civil · INFJ · 2024   │ meta: matière, concours, année
│                          [Ouvrir]│ ButtonSecondary sm · float right
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📄 Épreuve de Droit pénal      │
│     Droit pénal · INFJ · 2024   │
│                          [Ouvrir]│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  2023                           │ Section suivante
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  📄 Épreuve de Droit civil      │
│     Droit civil · INFJ · 2023   │
│                          [Ouvrir]│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                〜                │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

## ÉCRANS TRANSVERSAUX — Profil & Paramètres

---

### 25. PROFIL UTILISATEUR

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  Profil                  [⚙️]  │ TopHeader · icône paramètres
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ┌─────────────────────────────┐│ profile.header · py 32
│  │                             ││
│  │          ┌──────┐           ││ Avatar généré : initiales JD
│  │          │  JD  │           ││ 80px · borderRadius full
│  │          └──────┘           ││ backgroundColor accentPrimary
│  │                             ││ Typography.h2 · #FFFFFF
│  │    Jean-Paul Dupont         ││ h3 · textPrimary
│  │  ┌──────────────────────┐   ││ profileBadge : chip arrondi
│  │  │ 🎓 Étudiant en droit │   ││ bg accentPrimary15 · accentPrimary
│  │  └──────────────────────┘   ││
│  └─────────────────────────────┘│
│                                 │
│  ┌────────┐ ┌────────┐ ┌──────┐ │ StatCard × 3 · statsRow · gap 12
│  │   12   │ │   47   │ │  230 │ │
│  │ Textes │ │ Convers.│ │ Quiz │ │
│  │ suivis │ │ Alexia  │ │faits │ │
│  └────────┘ └────────┘ └──────┘ │
│                                 │
│  MON COMPTE                     │ sectionTitle
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Informations personnelles    › │ menuItem
│  Changer mon mot de passe     › │ menuItem
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  PRÉFÉRENCES                    │ sectionTitle
│  Notifications                › │
│  Affichage (Clair)            › │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  AIDE                           │ sectionTitle
│  À propos de Wilex            › │
│  CGU et Politique vie privée  › │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Se déconnecter                 │ menuItem · color error
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 26. CENTRE DE NOTIFICATIONS

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  Notifications          [✓ Tout]│ TopHeader · marquer tout lu
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ←── FilterRow ───────────────→ │
│  [Tous] [Bibliothèque] [Actualit│
│  [Concours]                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ┌─────────────────────────────┐│ Non-lu: backgroundColor accentPrimary8
│  │ ┌──┐ Texte modifié        ●││ dot accentPrimary (non lu)
│  │ │📚│ Le Code du Travail a  ││ icône module colorée: 40px circle
│  │ │  │ été modifié. Voir les ││ title: body semiBold
│  │ └──┘ nouvelles dispositions ││ description: bodySmall textSecondary
│  │      Il y a 2 heures        ││ date: caption textTertiary
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│ Lu: backgroundColor surfaceDefault
│  │ ┌──┐ Nouvelle actualité     ││
│  │ │📰│ "Réforme du code       ││
│  │ │  │ de commerce ivoirien"  ││
│  │ └──┘ Hier à 09:15           ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ ┌──┐ Concours ouvert       ││
│  │ │🏆│ Les inscriptions pour  ││
│  │ │  │ le concours ENAM sont  ││
│  │ └──┘ ouvertes. Il y a 2j    ││
│  └─────────────────────────────┘│
│                〜                │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 27. PARAMÈTRES — NOTIFICATIONS

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Notifications             │ TopHeader back
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  BIBLIOTHÈQUE                   │ sectionTitle
│  Modifications de textes suivis │ body textPrimary      [Toggle ON]
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Nouveaux textes ajoutés        │                       [Toggle ON]
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ACTUALITÉS                     │ sectionTitle
│  Nouvelles publications         │                       [Toggle ON]
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Actualités liées à mes textes  │                       [Toggle ON]
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  CONCOURS                       │ sectionTitle
│  Ouverture d'inscriptions       │                       [Toggle ON]
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Rappels dates limites          │                       [Toggle ON]
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Résultats publiés              │                       [Toggle OFF]
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  ALEXIA                         │ sectionTitle
│  Résumé hebdomadaire            │                       [Toggle OFF]
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

### 28. PARAMÈTRES — AFFICHAGE

```
┌─────────────────────────────────┐
│  ▒▒▒ SafeArea top ▒▒▒           │
│  [←]  Affichage                 │ TopHeader back
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  THÈME                          │ sectionTitle
│  ┌─────────────────────────────┐│
│  │ ● Clair    ○ Sombre ○ Auto  ││ RadioGroup 3 options · row
│  └─────────────────────────────┘│ labelText body textPrimary
│                                 │
│  LECTEUR                        │ sectionTitle
│  Taille du texte                │ body textPrimary
│  A-  ▬▬▬▬▬▬●░░░  A+           │ Slider · taille article (14→20px)
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Interligne                     │ body textPrimary
│  ━  ▬▬▬●░░░  ━━               │ Slider compact → confortable
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Police de lecture              │ body textPrimary
│  ● Lora (Sérif)                 │ RadioGroup 2 options
│  ○ Inter (Sans-sérif)           │
│  ▒▒▒ SafeArea bottom ▒▒▒       │
└─────────────────────────────────┘
```

---

## COMPOSANTS — ÉTATS SPÉCIAUX

---

### 29. SKELETON LOADER (exemple Card)

```
┌─────────────────────────────────┐
│  ┌─────────────────────────────┐│
│  │ ████████   ░░░░░░░░░░░░░   ││ Ligne badge + ligne statut
│  │ ████████████████████████   ││ Titre (100% width)
│  │ █████████████████          ││ Titre ligne 2 (75%)
│  │ ███████████   ██████████   ││ Domain + date
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ ████████████████████████   ││ Shimmer animé gauche→droite
│  │ ████████████████████████   ││ gradient: skeletonBase → skeletonHighlight
│  │ ████████                   ││ → skeletonBase · width 200px en mouvement
│  └─────────────────────────────┘│ durée: 1200ms loop · expo-linear-gradient
└─────────────────────────────────┘
```

---

### 30. EMPTY STATE (Bibliothèque vide)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│        ┌──────────────┐         │ Illustration SVG 120×120
│        │  📚          │         │ lignes trait fin · textTertiary
│        │   ...vide    │         │ style minimaliste outline
│        └──────────────┘         │
│                                 │
│     Aucun texte trouvé          │ Typography.h3 · textPrimary · center
│                                 │
│  Essayez une recherche ou       │ Typography.body · textSecondary
│  explorez nos catégories pour   │ textAlign center · lineHeight 22
│  découvrir des textes de loi.   │
│                                 │
│  ┌─────────────────────────────┐│
│  │    Explorer la bibliothèque ││ ButtonPrimary · sizeMd (CTA optionnel)
│  └─────────────────────────────┘│
│                                 │
│                                 │
└─────────────────────────────────┘
```

---

### 31. TOAST (variante success)

```
     ┌───────────────────────────┐     ← top + 16px (sous header)
     │ ✓  Texte ajouté à vos    │     backgroundColor: success (#1E7A47)
     │    textes suivis          │     borderRadius lg · shadow4
     └───────────────────────────┘     auto-dismiss 3s · swipe-up to dismiss
```

---

## NOTES D'IMPLÉMENTATION

### Zones de sécurité
- Tous les écrans : `<SafeAreaView>` ou `useSafeAreaInsets()` systématiquement
- BottomTabBar : `paddingBottom = insets.bottom` (minimum 8px)
- TopHeader : `paddingTop = insets.top` (via `<SafeAreaView edges={['top']}>`)
- Contenu scrollable : `paddingBottom = insets.bottom + 80` (hauteur tab bar)

### Performance
- FlatList avec `initialNumToRender={5}` et `maxToRenderPerBatch={10}`
- Images : `expo-image` pour cache automatique + format AVIF/WebP
- SkeletonLoader : `expo-linear-gradient` pour shimmer
- Animations : `react-native-reanimated` v4 (worklet-based)

### Deep Linking
- `wilex://bibliotheque/texte/:id` → Fiche Recueil
- `wilex://bibliotheque/lecteur/:id/:version` → Lecteur de texte
- `wilex://actualites/:id` → Détail Actualité
- `wilex://alexia/conversation/:id` → Conversation Alexia
- `wilex://concours/:id` → Fiche Concours
- `wilex://notifications` → Centre de notifications

### Accessibilité
- `accessibilityLabel` sur tous les boutons iconiques
- `accessibilityRole="button"` sur les TouchableOpacity interactifs
- Contraste WCAG AA minimum partout (ratio ≥ 4.5:1 pour texte normal)
- Forest (#1A4731) sur blanc : ratio 7.8:1 ✓ AAA
- Gold (#C4882C) sur noir : ratio 6.2:1 ✓ AA

---

*Wilex Design System v1.0 · Ivoire Node · 2024*
