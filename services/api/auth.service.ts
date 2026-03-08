import { api } from './client';
import type { LoginPayload, RegisterPayload, TokenResponse } from './types';

export const authService = {
  /**
   * Créer un compte.
   * Retourne les tokens directement (pas de vérification email requise).
   */
  register: (payload: RegisterPayload) =>
    api.post<TokenResponse>('/auth/register', payload),

  /**
   * Se connecter avec email + mot de passe.
   */
  login: (payload: LoginPayload) =>
    api.post<TokenResponse>('/auth/login', payload),
};
