# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**lex_connect** is a React Native mobile app built with Expo SDK 54 and Expo Router v6 (file-based routing). It targets Android, iOS, and web. The app appears to be an educational/competition platform (concours, preparation) for Ivory Coast ("Ivoire Node").

## Commands

- `npx expo start` — Start the dev server (press `a` for Android, `i` for iOS, `w` for web)
- `npm run lint` — Run ESLint (`expo lint`)
- `npm run reset-project` — Move starter code to `app-example/` and create a blank `app/` directory

No test runner is currently configured.

## Architecture

### Routing (Expo Router — file-based)

- `app/_layout.tsx` — Root layout: `AppStateProvider` → `Stack` navigator in `ThemeProvider`. Manages splash screen visibility via `isReady` state.
- `app/index.tsx` — Root redirect: routes to `/(onboarding)`, `/(auth)/login`, or `/(tabs)` based on persisted app state
- `app/(onboarding)/index.tsx` — 3-page swipeable onboarding (shown only on first launch)
- `app/(auth)/login.tsx` — Auth screen (email, password, Google, skip). UI-only for now.
- `app/(auth)/register.tsx` — Stub registration screen
- `app/(country)/select.tsx` — Country selection (first launch only, persisted via AsyncStorage)
- `app/(tabs)/_layout.tsx` — Tab navigator with 4 tabs: Home, Favorites, Concours, Prépa
- `app/modal.tsx` — Modal screen presented via stack

### First-launch flow

`Splash → Onboarding (3 steps) → Auth → Country selection → Tabs`

State persisted in AsyncStorage (`constants/storage-keys.ts`). On subsequent launches, skips directly to tabs. Context: `contexts/app-state-context.tsx` (exposes `useAppState` hook with `completeOnboarding()`, `setCountry()`).

### Theming & Colors

- `constants/theme.ts` — Single source of truth for colors and fonts
  - `Palette` — 6 app-wide color tokens (never use hex literals elsewhere):
    - `background` (#E4DFD8), `foreground` (#24221B), `primary` (#162660), `secondary` (#F2D04E), `accent1` (#D0E6FD), `accent2` (#787F56)
  - `Colors` — Light/dark mode objects derived from `Palette`, consumed by themed components
  - `Fonts` — Platform-specific font families (sans, serif, rounded, mono)
- `hooks/use-color-scheme.ts` / `.web.ts` — Platform-specific color scheme detection
- `hooks/use-theme-color.ts` — Resolves a color from `Colors` based on current scheme
- **Rule: always reference `Palette` or `Colors` from `@/constants/theme` — never hardcode hex values in components**

### Themed Components

- `ThemedText` — Text with theme-aware color and preset type variants (`default`, `title`, `defaultSemiBold`, `subtitle`, `link`)
- `ThemedView` — View using `Colors.background`
- `ThemedMainView` — View using `Colors.mainBackground` with column layout, padding, and gap

### Icons

- `components/ui/icon-symbol.tsx` — Android/web fallback using MaterialIcons with SF Symbol name mapping
- `components/ui/icon-symbol.ios.tsx` — Native SF Symbols on iOS
- New icons require adding entries to the `MAPPING` object in `icon-symbol.tsx`

## Key Conventions

- Path alias: `@/*` maps to project root (configured in `tsconfig.json`)
- TypeScript strict mode is enabled
- New Architecture (`newArchEnabled`) and React Compiler (`reactCompiler`) are enabled
- ESLint uses flat config with `eslint-config-expo`
- Component filenames use kebab-case (e.g., `themed-text.tsx`, `parallax-scroll-view.tsx`)
