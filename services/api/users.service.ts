import { api } from './client';
import type { Bookmark, UserProfile } from './types';

export const usersService = {
  /**
   * Profil de l'utilisateur connecté.
   * Premium — token JWT requis.
   */
  getMe: () =>
    api.get<UserProfile>('/users/me', { authenticated: true }),

  /**
   * Liste des favoris (bookmarks) de l'utilisateur.
   * Premium — token JWT requis.
   */
  getBookmarks: () =>
    api.get<{ bookmarks: Bookmark[] }>('/users/me/bookmarks', { authenticated: true }),
};
