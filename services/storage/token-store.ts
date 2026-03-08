/**
 * Stockage sécurisé des tokens JWT.
 *
 * - iOS / Android → expo-secure-store (Keychain / EncryptedSharedPreferences)
 * - Web           → localStorage (expo-secure-store non disponible sur web)
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEYS = {
  ACCESS_TOKEN: 'wilex_access_token',
  REFRESH_TOKEN: 'wilex_refresh_token',
} as const;

async function get(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function set(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

async function remove(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
    return;
  }
  return SecureStore.deleteItemAsync(key);
}

export const TokenStore = {
  getAccessToken: () => get(KEYS.ACCESS_TOKEN),
  getRefreshToken: () => get(KEYS.REFRESH_TOKEN),

  setTokens: (accessToken: string, refreshToken: string) =>
    Promise.all([
      set(KEYS.ACCESS_TOKEN, accessToken),
      set(KEYS.REFRESH_TOKEN, refreshToken),
    ]).then(() => undefined),

  clearTokens: () =>
    Promise.all([
      remove(KEYS.ACCESS_TOKEN),
      remove(KEYS.REFRESH_TOKEN),
    ]).then(() => undefined),
};
