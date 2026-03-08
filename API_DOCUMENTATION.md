# API Documentation — Feed Wilex

Documentation complète de l'API REST pour accéder aux contenus juridiques.

## Démarrage rapide

```bash
# Lancer l'API en local
python run_api.py

# Interface interactive Swagger
http://localhost:8000/docs

# Documentation alternative ReDoc
http://localhost:8000/redoc
```

## Architecture

L'API est construite avec **FastAPI** et expose trois catégories d'endpoints :

1. **`/auth`** — authentification (JWT + OAuth)
2. **`/users`** — gestion du profil utilisateur et abonnements
3. **`/content`** — accès aux documents juridiques

## Authentification

### Endpoints publics (pas d'authentification requise)

- `GET /content/categories` — arborescence des catégories
- `GET /content/documents` — liste paginée des documents (métadonnées uniquement)
- `GET /content/jurisprudences` — liste paginée des jurisprudences

### Endpoints premium (authentification requise)

Nécessitent un abonnement actif et un token JWT valide.

- `GET /content/documents/{id}` — contenu complet d'un document
- `GET /content/documents/{id}/hierarchical` — structure hiérarchique d'un code
- `GET /content/documents/{id}/download` — payload JSON pour lecture offline

### Obtenir un token

#### 1. Créer un compte

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "full_name": "Jean Dupont"
}
```

**Réponse** :
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

> **Règles du mot de passe** : minimum 8 caractères, maximum 128, doit contenir au moins une lettre et un chiffre.

#### 2. Se connecter

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

#### 3. Rafraîchir le token

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
```

### Utiliser le token

Inclure le token dans l'en-tête `Authorization` :

```bash
GET /content/documents/{document_id}
Authorization: Bearer eyJhbGc...
```

## Structure hiérarchique des codes

Les codes juridiques sont organisés selon une hiérarchie à **5 niveaux** :

```
Document (Code)
├── Partie (niveau 1)
│   ├── Initiative/Loi (niveau 2)
│   │   ├── Titre (niveau 3)
│   │   │   ├── Chapitre (niveau 4)
│   │   │   │   ├── Section (niveau 5)
│   │   │   │   │   └── Articles
│   │   │   │   └── Articles (directs, sans section)
```

### Modèles de données

#### Partie
```json
{
  "id": "uuid",
  "title": "I-ORGANISATION JUDICIAIRE",
  "number": "I",
  "order_index": 1
}
```

#### Initiative/Loi
```json
{
  "id": "uuid",
  "title": "LOI n°2025-219 DU 28 MARS 2025",
  "number": "1",
  "law_number": "n°2025-219",
  "law_date": "2025-03-28",
  "order_index": 1,
  "partie_id": "uuid"
}
```

#### Titre
```json
{
  "id": "uuid",
  "title": "TITRE PREMIER - DISPOSITIONS GÉNÉRALES",
  "number": "PREMIER",
  "order_index": 1,
  "initiative_id": "uuid"
}
```

#### Chapitre
```json
{
  "id": "uuid",
  "title": "CHAPITRE II - Compétences",
  "number": "II",
  "order_index": 2,
  "titre_id": "uuid"
}
```

#### Section
```json
{
  "id": "uuid",
  "title": "SECTION III - Dispositions spéciales",
  "number": "III",
  "order_index": 3,
  "chapitre_id": "uuid"
}
```

#### Article
```json
{
  "id": "uuid",
  "number": "Article 1",
  "title": null,
  "content": "Le texte de l'article...",
  "order_index": 1,
  "section_id": "uuid",      // ou null
  "chapitre_id": "uuid"      // ou null si lié à section
}
```

## Endpoints Content

### `GET /content/categories`

Retourne l'arborescence complète des catégories.

**Réponse** :
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "Droit civil",
      "slug": "droit-civil",
      "parent_id": null,
      "children": [
        {
          "id": "uuid",
          "name": "Code civil",
          "slug": "code-civil",
          "parent_id": "uuid",
          "children": []
        }
      ]
    }
  ]
}
```

### `GET /content/documents`

Liste paginée des documents avec métadonnées uniquement (pas de contenu complet).

**Paramètres** :
- `type` (optionnel) — filtrer par type. Valeurs possibles : `code` · `texte_de_loi` · `jurisprudence` · `reglement` · `autre`
- `status` (optionnel) — filtrer par statut. Valeurs possibles : `en_vigueur` · `abroge` · `modifie` · `suspendu`
- `category_id` (optionnel) — filtrer par catégorie
- `q` (optionnel) — recherche plein texte sur le titre
- `page` (défaut: 1)
- `size` (défaut: 20, max: 100)

**Exemple** :
```bash
GET /content/documents?type=code&status=en_vigueur&page=1&size=20
```

**Réponse** :
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "code",            // "code" | "texte_de_loi" | "jurisprudence" | "reglement" | "autre"
      "title": "Code de l'organisation judiciaire",
      "slug": "code-organisation-judiciaire",
      "status": "en_vigueur",   // "en_vigueur" | "abroge" | "modifie" | "suspendu"
      "summary": "Résumé du code...",
      "source_url": "https://biblio.cndj.ci/...",
      "reference": "2025",
      "publication_date": "2025-03-28",
      "effective_date": "2025-04-01",
      "country": "CI",           // code ISO 3166-1 alpha-2 (ex: "CI", "SN", "FR")
      "category_id": "uuid",
      "tags": ["justice", "tribunaux"],
      "current_version": 1,
      "updated_at": "2025-03-28T10:00:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "size": 20,
  "pages": 8
}
```

### `GET /content/documents/{id}` ⭐ PREMIUM

Détail complet d'un document avec liste plate d'articles.

**En-têtes requis** :
```
Authorization: Bearer {access_token}
```

**Réponse** :
```json
{
  "id": "uuid",
  "type": "code",
  "title": "Code de l'organisation judiciaire",
  "slug": "code-organisation-judiciaire",
  "status": "en_vigueur",
  "summary": "Résumé...",
  "full_text": "Texte complet...",
  "reference": "2025",
  "publication_date": "2025-03-28",
  "effective_date": "2025-04-01",
  "expiry_date": null,
  "country": "CI",
  "category_id": "uuid",
  "tags": ["justice"],
  "current_version": 1,
  "source_url": "https://biblio.cndj.ci/...",
  "created_at": "2025-03-28T10:00:00Z",
  "updated_at": "2025-03-28T10:00:00Z",
  "articles": [
    {
      "id": "uuid",
      "number": "Article 1",
      "title": null,
      "content": "Le texte de l'article...",
      "order_index": 0,
      "section_id": "uuid",
      "chapitre_id": null
    }
  ],
  "jurisprudence_detail": null
}
```

### `GET /content/documents/{id}/hierarchical` ⭐ PREMIUM

Détail complet d'un document avec structure hiérarchique.

**En-têtes requis** :
```
Authorization: Bearer {access_token}
```

**Réponse** :
```json
{
  "id": "uuid",
  "type": "code",
  "title": "Code de l'organisation judiciaire",
  "slug": "code-organisation-judiciaire",
  "status": "en_vigueur",
  "summary": "Résumé...",
  "reference": "2025",
  "publication_date": "2025-03-28",
  "effective_date": "2025-04-01",
  "country": "CI",
  "category_id": "uuid",
  "tags": ["justice"],
  "current_version": 1,
  "source_url": "https://biblio.cndj.ci/...",
  "created_at": "2025-03-28T10:00:00Z",
  "updated_at": "2025-03-28T10:00:00Z",
  "parties": [
    {
      "id": "uuid",
      "title": "I-ORGANISATION JUDICIAIRE",
      "number": "I",
      "order_index": 1,
      "initiatives": [
        {
          "id": "uuid",
          "title": "LOI n°2025-219 DU 28 MARS 2025",
          "number": "1",
          "law_number": "n°2025-219",
          "law_date": "2025-03-28",
          "order_index": 1,
          "titres": [
            {
              "id": "uuid",
              "title": "TITRE PREMIER - DISPOSITIONS GÉNÉRALES",
              "number": "PREMIER",
              "order_index": 1,
              "chapitres": [
                {
                  "id": "uuid",
                  "title": "CHAPITRE I - Principes généraux",
                  "number": "I",
                  "order_index": 1,
                  "sections": [
                    {
                      "id": "uuid",
                      "title": "SECTION I - Définitions",
                      "number": "I",
                      "order_index": 1,
                      "articles": [
                        {
                          "id": "uuid",
                          "number": "Article 1",
                          "title": null,
                          "content": "Le texte de l'article...",
                          "order_index": 0,
                          "section_id": "uuid",
                          "chapitre_id": null
                        }
                      ]
                    }
                  ],
                  "articles": []
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "jurisprudence_detail": null
}
```

### `GET /content/documents/{id}/download` ⭐ PREMIUM

Payload JSON autonome pour mise en cache locale (lecture offline).

**En-têtes requis** :
```
Authorization: Bearer {access_token}
```

**Réponse** :
```json
{
  "document": { /* DocumentDetailResponse */ },
  "downloaded_at": "2025-03-28T10:00:00Z",
  "format_version": "1.0"
}
```

### `GET /content/jurisprudences`

Liste paginée des jurisprudences.

**Paramètres** :
- `category` (optionnel) — filtrer par catégorie
- `matter` (optionnel) — filtrer par matière
- `q` (optionnel) — recherche sur le titre
- `page` (défaut: 1)
- `size` (défaut: 20, max: 100)

**Exemple** :
```bash
GET /content/jurisprudences?matter=pénal&page=1&size=20
```

## Endpoints Users

### `GET /users/me` ⭐ PREMIUM

Récupère le profil de l'utilisateur connecté.

**En-têtes requis** :
```
Authorization: Bearer {access_token}
```

**Réponse** :
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "phone_number": null,
  "full_name": "Jean Dupont",
  "created_at": "2025-03-28T10:00:00Z",
  "subscription": {
    "tier": "free",           // "free" | "premium"
    "is_active_premium": false,
    "started_at": "2025-03-28T10:00:00Z",
    "expires_at": null        // null si free (pas d'expiration)
  }
}
```

### `GET /users/me/bookmarks` ⭐ PREMIUM

Liste des favoris de l'utilisateur.

**Réponse** :
```json
{
  "bookmarks": [
    {
      "id": "uuid",
      "document_id": "uuid",
      "has_unread_update": false,
      "added_at": "2025-03-28T10:00:00Z"
    }
  ]
}
```

## Tester l'API

### Avec Swagger UI (recommandé)

1. Lancer l'API : `python run_api.py`
2. Ouvrir http://localhost:8000/docs
3. Utiliser le bouton **Authorize** en haut à droite pour saisir votre token
4. Tester les endpoints directement dans l'interface

### Avec cURL

```bash
# 1. S'enregistrer
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!", "full_name": "Test User"}'

# 2. Se connecter
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!"}'

# 3. Récupérer un document (remplacer {TOKEN} et {DOC_ID})
curl -X GET http://localhost:8000/content/documents/{DOC_ID} \
  -H "Authorization: Bearer {TOKEN}"

# 4. Structure hiérarchique
curl -X GET http://localhost:8000/content/documents/{DOC_ID}/hierarchical \
  -H "Authorization: Bearer {TOKEN}"
```

### Avec Python

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. S'enregistrer
response = requests.post(f"{BASE_URL}/auth/register", json={
    "email": "test@example.com",
    "password": "Test123!",
    "full_name": "Test User"
})
tokens = response.json()
access_token = tokens["access_token"]

# 2. Récupérer la liste des documents
response = requests.get(f"{BASE_URL}/content/documents?type=code")
documents = response.json()

# 3. Récupérer un document complet (premium)
doc_id = documents["items"][0]["id"]
response = requests.get(
    f"{BASE_URL}/content/documents/{doc_id}",
    headers={"Authorization": f"Bearer {access_token}"}
)
document = response.json()

# 4. Structure hiérarchique
response = requests.get(
    f"{BASE_URL}/content/documents/{doc_id}/hierarchical",
    headers={"Authorization": f"Bearer {access_token}"}
)
hierarchical = response.json()
```

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé (abonnement premium requis) |
| 404 | Ressource introuvable |
| 422 | Validation échouée |
| 500 | Erreur serveur |

## Variables d'environnement

Fichier `.env` :

```env
# Base de données
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/feed_wilex_db

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=30

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# OAuth (optionnel)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
```

## Scraping et population des données

### Mode standard

```bash
# Phase 1 : Collecter les métadonnées
python -m scrapers.scraper_codes

# Phase 2 : Enrichir avec le contenu (section_path en string)
# Nécessitera une migration ultérieure
```

### Mode hiérarchique (recommandé)

```bash
# Phase 1 : Collecter les métadonnées
python -m scrapers.scraper_codes

# Phase 3 : Scraper et créer directement la structure hiérarchique
python -m scrapers.scraper_codes --hierarchical
```

Le mode hiérarchique crée directement les tables `parties`, `initiatives`, `titres`, `chapitres`, `sections` et lie les articles, évitant la migration séparée.

## Référence des valeurs possibles (Enums)

### `Document.type`
| Valeur | Description |
|--------|-------------|
| `code` | Code juridique (Code civil, Code pénal…) |
| `texte_de_loi` | Loi, ordonnance, décret |
| `jurisprudence` | Décision de justice |
| `reglement` | Règlement, arrêté |
| `autre` | Autre type de document |

### `Document.status`
| Valeur | Description |
|--------|-------------|
| `en_vigueur` | Texte actuellement en vigueur |
| `abroge` | Texte abrogé (remplacé ou supprimé) |
| `modifie` | Texte modifié (version non définitive) |
| `suspendu` | Application temporairement suspendue |

### `Subscription.tier`
| Valeur | Description |
|--------|-------------|
| `free` | Abonnement gratuit — accès public uniquement |
| `premium` | Abonnement payant — accès complet (articles, download, Alexia IA) |

### `OTP.channel` (`POST /auth/send-otp`)
| Valeur | Description |
|--------|-------------|
| `sms` | Code envoyé par SMS |
| `whatsapp` | Code envoyé via WhatsApp |

### `Account.preferred_lang`
Code ISO 639-1 sur 2 caractères. Exemples : `"fr"` (français), `"en"` (anglais).

### `Document.country`
Code ISO 3166-1 alpha-2 sur 2 caractères. Valeur par défaut : `"CI"` (Côte d'Ivoire). Exemples : `"SN"`, `"ML"`, `"BF"`, `"FR"`.

### `TokenResponse.token_type`
Toujours `"bearer"`. À utiliser comme préfixe dans l'en-tête `Authorization: Bearer {access_token}`.

## Support

Pour toute question ou problème :
1. Consulter la documentation interactive : http://localhost:8000/docs
2. Vérifier les logs : `logs/scraper.log`
3. Ouvrir une issue sur le dépôt du projet
