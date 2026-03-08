import { api } from './client';
import type {
  Category,
  DocumentDetail,
  DocumentDownload,
  DocumentHierarchical,
  DocumentSummary,
  DocumentsParams,
  JurisprudencesParams,
  PaginatedResponse,
} from './types';

export const contentService = {
  // ── Endpoints publics ──────────────────────────────────────────────────────

  /**
   * Arborescence complète des catégories.
   * Public — pas d'authentification requise.
   */
  getCategories: () =>
    api.get<{ categories: Category[] }>('/content/categories'),

  /**
   * Liste paginée des documents (métadonnées uniquement).
   * Public — pas d'authentification requise.
   */
  getDocuments: (params?: DocumentsParams) =>
    api.get<PaginatedResponse<DocumentSummary>>('/content/documents', { params }),

  /**
   * Liste paginée des jurisprudences.
   * Public — pas d'authentification requise.
   */
  getJurisprudences: (params?: JurisprudencesParams) =>
    api.get<PaginatedResponse<DocumentSummary>>('/content/jurisprudences', { params }),

  // ── Endpoints premium ─────────────────────────────────────────────────────

  /**
   * Contenu complet d'un document avec liste plate d'articles.
   * Premium — token JWT requis.
   */
  getDocument: (id: string) =>
    api.get<DocumentDetail>(`/content/documents/${encodeURIComponent(id)}`, {
      authenticated: true,
    }),

  /**
   * Structure hiérarchique d'un code (Parties → Initiatives → Titres → Chapitres → Sections → Articles).
   * Premium — token JWT requis.
   */
  getDocumentHierarchical: (id: string) =>
    api.get<DocumentHierarchical>(
      `/content/documents/${encodeURIComponent(id)}/hierarchical`,
      { authenticated: true },
    ),

  /**
   * Payload JSON complet pour lecture hors ligne.
   * Premium — token JWT requis.
   */
  downloadDocument: (id: string) =>
    api.get<DocumentDownload>(
      `/content/documents/${encodeURIComponent(id)}/download`,
      { authenticated: true },
    ),
};
