import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type PropsWithChildren,
} from 'react';

import { ApiError } from '@/services/api/client';
import { authService } from '@/services/api/auth.service';
import { usersService } from '@/services/api/users.service';
import { TokenStore } from '@/services/storage/token-store';
import type { UserProfile } from '@/services/api/types';

// ─── State ────────────────────────────────────────────────────────────────────

type AuthState = {
  /** true pendant le chargement initial (lecture SecureStore) */
  isLoading: boolean;
  /** true si des tokens valides existent, même sans profil chargé */
  hasTokens: boolean;
  user: UserProfile | null;
};

type AuthAction =
  | { type: 'INIT_DONE'; user: UserProfile | null; hasTokens: boolean }
  | { type: 'SIGNED_IN'; user: UserProfile | null }
  | { type: 'PROFILE_LOADED'; user: UserProfile }
  | { type: 'SIGNED_OUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INIT_DONE':
      return { isLoading: false, hasTokens: action.hasTokens, user: action.user };
    case 'SIGNED_IN':
      return { isLoading: false, hasTokens: true, user: action.user };
    case 'PROFILE_LOADED':
      return { ...state, user: action.user };
    case 'SIGNED_OUT':
      return { isLoading: false, hasTokens: false, user: null };
  }
}

// ─── Context value ────────────────────────────────────────────────────────────

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(authReducer, { isLoading: true, hasTokens: false, user: null });

  // Chargement initial : si un access token existe, on récupère le profil
  useEffect(() => {
    (async () => {
      try {
        const token = await TokenStore.getAccessToken();
        if (!token) {
          dispatch({ type: 'INIT_DONE', user: null, hasTokens: false });
          return;
        }

        try {
          const user = await usersService.getMe();
          dispatch({ type: 'INIT_DONE', user, hasTokens: true });
        } catch {
          // Token présent mais getMe() a échoué — on est quand même connecté
          dispatch({ type: 'INIT_DONE', user: null, hasTokens: true });
        }
      } catch (err) {
        // Token expiré ou invalide — nettoyer et continuer en mode non-connecté
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          await TokenStore.clearTokens();
        }
        dispatch({ type: 'INIT_DONE', user: null, hasTokens: false });
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authService.login({ email, password });
    await TokenStore.setTokens(tokens.access_token, tokens.refresh_token);

    // getMe() est optionnel — échec non bloquant pour la connexion
    try {
      const user = await usersService.getMe();
      dispatch({ type: 'SIGNED_IN', user });
    } catch {
      dispatch({ type: 'SIGNED_IN', user: null });
    }
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const tokens = await authService.register({
      email,
      password,
      full_name: fullName,
    });
    await TokenStore.setTokens(tokens.access_token, tokens.refresh_token);

    try {
      const user = await usersService.getMe();
      dispatch({ type: 'SIGNED_IN', user });
    } catch {
      dispatch({ type: 'SIGNED_IN', user: null });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const user = await usersService.getMe();
      dispatch({ type: 'PROFILE_LOADED', user });
    } catch {
      // Silencieux — le profil sera null jusqu'au prochain appel réussi
    }
  }, []);

  const logout = useCallback(async () => {
    await TokenStore.clearTokens();
    dispatch({ type: 'SIGNED_OUT' });
  }, []);

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: state.hasTokens,
    isPremium: state.user?.is_premium ?? false,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
