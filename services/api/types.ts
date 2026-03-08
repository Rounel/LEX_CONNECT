// ─── Auth ─────────────────────────────────────────────────────────────────────

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
};

export type RegisterPayload = {
  email: string;
  password: string;
  full_name: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  preferred_lang: string;
  is_active: boolean;
  is_premium: boolean;
  created_at: string;
};

export type Bookmark = {
  id: string;
  document_id: string;
  has_unread_update: boolean;
  added_at: string;
};

// ─── Categories ───────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  children: Category[];
};

// ─── Documents ────────────────────────────────────────────────────────────────

export type DocumentType = 'code' | 'texte_de_loi' | 'jurisprudence' | 'reglement' | 'autre';

export type DocumentStatus = 'en_vigueur' | 'abroge' | 'modifie' | 'suspendu';

export type DocumentSummary = {
  id: string;
  type: DocumentType;
  title: string;
  slug: string;
  status: DocumentStatus;
  summary: string | null;
  source_url: string | null;
  reference: string | null;
  publication_date: string | null;
  effective_date: string | null;
  country: string;
  category_id: string | null;
  tags: string[];
  current_version: number;
  updated_at: string;
  // Champs spécifiques aux codes
  texts_count?: number | null;
  articles_count?: number | null;
  edition?: string | null;
};

export type Article = {
  id: string;
  number: string;
  title: string | null;
  content: string;
  order_index: number;
  section_id: string | null;
  chapitre_id: string | null;
};

export type DocumentDetail = DocumentSummary & {
  full_text: string | null;
  expiry_date: string | null;
  created_at: string;
  articles: Article[];
  jurisprudence_detail: unknown | null;
};

// ─── Hierarchical structure ───────────────────────────────────────────────────

export type HierarchicalSection = {
  id: string;
  title: string;
  number: string;
  order_index: number;
  chapitre_id: string;
  articles: Article[];
};

export type HierarchicalChapitre = {
  id: string;
  title: string;
  number: string;
  order_index: number;
  titre_id: string;
  sections: HierarchicalSection[];
  articles: Article[];
};

export type HierarchicalTitre = {
  id: string;
  title: string;
  number: string;
  order_index: number;
  initiative_id: string;
  chapitres: HierarchicalChapitre[];
};

export type HierarchicalInitiative = {
  id: string;
  title: string;
  number: string;
  law_number: string | null;
  law_date: string | null;
  order_index: number;
  partie_id: string;
  titres: HierarchicalTitre[];
};

export type HierarchicalPartie = {
  id: string;
  title: string;
  number: string;
  order_index: number;
  initiatives: HierarchicalInitiative[];
};

export type DocumentHierarchical = Omit<DocumentSummary, 'updated_at'> & {
  created_at: string;
  updated_at: string;
  parties: HierarchicalPartie[];
  jurisprudence_detail: unknown | null;
};

// ─── Offline download ─────────────────────────────────────────────────────────

export type DocumentDownload = {
  document: DocumentDetail;
  downloaded_at: string;
  format_version: string;
};

// ─── Pagination ───────────────────────────────────────────────────────────────

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
};

// ─── Query params ─────────────────────────────────────────────────────────────

export type DocumentsParams = {
  type?: DocumentType;
  status?: DocumentStatus;
  category_id?: string;
  q?: string;
  page?: number;
  size?: number;
};

export type JurisprudencesParams = {
  category?: string;
  matter?: string;
  q?: string;
  page?: number;
  size?: number;
};
