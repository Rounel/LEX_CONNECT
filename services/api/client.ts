import { API_BASE_URL } from '@/constants/api';
import { TokenStore } from '@/services/storage/token-store';
import type { TokenResponse } from './types';

// ─── Erreur API typée ─────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Refresh token — protection contre les appels simultanés ─────────────────

let _refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  // Si un refresh est déjà en cours, on attend le même résultat
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async (): Promise<string | null> => {
    try {
      const rt = await TokenStore.getRefreshToken();
      if (!rt) return null;

      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: rt }),
      });

      if (!res.ok) {
        await TokenStore.clearTokens();
        return null;
      }

      const data: TokenResponse = await res.json();
      await TokenStore.setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch {
      await TokenStore.clearTokens();
      return null;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

// ─── Construction de l'URL avec query params ──────────────────────────────────

type QueryParams = Record<string, string | number | boolean | undefined>;

function buildUrl(path: string, params?: QueryParams): string {
  let url = `${API_BASE_URL}${path}`;
  if (!params) return url;

  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);

  if (parts.length > 0) url += `?${parts.join('&')}`;
  return url;
}

// ─── Parsing de la réponse ────────────────────────────────────────────────────

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!response.ok) {
    let message = `Erreur ${response.status}`;
    let detail: unknown;

    if (isJson) {
      try {
        const data = await response.json();
        // FastAPI retourne { detail: string | object }
        message =
          typeof data.detail === 'string'
            ? data.detail
            : (data.message ?? message);
        detail = data;
      } catch {
        // ignorer les erreurs de parsing
      }
    }

    throw new ApiError(response.status, message, detail);
  }

  if (isJson) return response.json() as Promise<T>;
  return undefined as unknown as T;
}

// ─── Options de requête ───────────────────────────────────────────────────────

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Inclure le token Bearer dans les en-têtes */
  authenticated?: boolean;
  params?: QueryParams;
};

// ─── Fonction centrale ────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, authenticated = false, params } = options;

  const url = buildUrl(path, params);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (authenticated) {
    const token = await TokenStore.getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, init);

  // Auto-refresh sur 401
  if (response.status === 401 && authenticated) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      throw new ApiError(401, 'Session expirée. Veuillez vous reconnecter.');
    }

    // Rejouer la requête avec le nouveau token
    const retryResponse = await fetch(url, {
      ...init,
      headers: { ...headers, Authorization: `Bearer ${newToken}` },
    });

    return parseResponse<T>(retryResponse);
  }

  return parseResponse<T>(response);
}

// ─── API client ───────────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'POST', body }),
};
