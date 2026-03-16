# Platform-First Backend Design

**Date:** 2026-03-16

## Goal

Faire evoluer le backend `J+SERVICES` d'une base historique centree sur `TiketMomo` vers une plateforme studio multi-produit capable d'heberger:

- plusieurs applications web
- plusieurs applications mobiles
- plusieurs plans de licence
- plusieurs workspaces de gestion
- plusieurs produits vendables par les resellers

`TiketMomo` doit devenir un domaine produit de l'ecosysteme, pas le centre de gravite du backend.

## Product Reality

`J+SERVICES` est la marque plateforme et le studio.

Le backend doit supporter:

- un control plane `admin`
- un workspace `client`
- un workspace `reseller`
- un catalogue de produits/services
- des activations produit par client
- des droits reseller par produit
- des dashboards produit qui pourront s'ajouter progressivement

Etat actuel:

- la base de donnees commence deja a supporter une logique multi-app
- les modules backend ont commence a se decouper
- mais la couche HTTP et plusieurs controllers restent encore structures comme une extension de l'application historique

## Core Design Decision

Le backend cible doit etre organise en quatre couches:

1. `platform core`
2. `workspace apis`
3. `product domains`
4. `legacy compatibility layer`

Cette separation permet:

- d'ajouter de nouveaux produits sans destabiliser les workspaces
- d'eviter que l'admin, le client ou le reseller portent la logique interne d'un produit
- d'exposer une gouvernance centrale par catalogue, licences et activations

## Target Logical Topology

```text
Web Apps / Mobile Apps / Integrations
        |
        v
   Workspace APIs
   - admin
   - client
   - reseller
        |
        v
   Platform Core
   - identity
   - accounts
   - catalog
   - subscriptions
   - licensing
   - permissions
   - audit
   - notifications
        |
        +--> Product Domains
        |    - tiketmomo
        |    - future-product-a
        |    - future-product-b
        |
        +--> Integrations
             - fedapay
             - firebase
             - mobile sync
             - webhooks
             - future providers
```

## Target Backend Boundaries

### 1. Platform Core

Responsabilite:

- identites
- comptes
- catalogue de produits
- plans
- licences
- activations produit
- permissions reseller
- composition des workspaces
- audit et monitoring transverses

Modules cibles:

- `identity-access`
- `account-management`
- `catalog-management`
- `subscription-management`
- `licensing-billing`
- `workspace-orchestration`
- `audit-monitoring`
- `notification-delivery`

### 2. Workspace APIs

Responsabilite:

- fournir l'experience de navigation et de pilotage propre a un role
- exposer overview, sections, settings, actions et listes
- agreger des donnees venant du core et des product domains

Workspaces cibles:

- `admin workspace`
- `client workspace`
- `reseller workspace`

Principe:

Un workspace ne possede pas le metier produit profond.
Il orchestre et presente les capacites autorisees.

### 3. Product Domains

Responsabilite:

- logique metier propre a un produit
- operations specialisees
- dashboards produit
- adapters et integrations specifiques

Premier domaine cible:

- `products/tiketmomo`

Exemples futurs:

- `products/<nouveau-produit-web>`
- `products/<nouveau-produit-mobile>`

### 4. Legacy Compatibility Layer

Responsabilite:

- maintenir temporairement les routes `manager` et `partner`
- servir d'adapter vers les nouveaux modules canoniques
- proteger la migration applicative sans bloquer la suite

Cette couche ne doit plus recevoir de nouvelles features de fond.

## Target Data Model

Le schema doit etre pense autour de l'orchestration plateforme.

### Existing Useful Foundations

Deja presents et alignes avec la cible:

- `apps`
- `manager_apps`
- `auth_identities`
- `licenses`
- `license_entitlements`
- `operational_events`
- `sync_jobs`
- `analytics_daily_facts`

### New Business Entities To Introduce

Les prochaines briques a formaliser cote backend et, si necessaire, cote SQL:

- `products`
  - identite produit
  - branding
  - categorie
  - statut
  - metadonnees de presentation

- `product_plans`
  - plans vendables par produit
  - duree
  - prix
  - devise
  - activation rules

- `client_product_subscriptions`
  - quels produits sont actifs pour quel client
  - quel plan
  - quel statut
  - quelles dates de validite

- `reseller_product_permissions`
  - quels produits un reseller peut vendre
  - quelles limites ou commissions
  - quels plans sont autorises

- `workspace_entries`
  - mapping entre produits actifs et apps visibles dans un workspace
  - peut etre derive si le modele reste simple

## Roles and Responsibilities

### Admin

Doit pouvoir:

- gerer un vrai catalogue de produits/services
- definir quels produits sont commercialisables
- activer un ou plusieurs produits pour un client
- suivre les licences par produit
- gerer les resellers et leurs droits de vente
- superviser l'ensemble de la plateforme

### Client

Doit disposer d'un workspace capable de:

- lister les produits actifs
- entrer dans un dashboard produit specifique
- gerer ses operations courantes par produit

Dans l'etat initial:

- seul `TiketMomo` est expose cote client
- d'autres dashboards produit viendront ensuite

### Reseller

Doit pouvoir:

- vendre un produit specifique ou plusieurs produits
- voir les produits qu'il est autorise a vendre
- suivre commissions et retraits
- eventuellement basculer entre plusieurs lignes de produit

## API Surface Direction

### Workspace APIs

Routes cibles:

- `/api/admin/...`
- `/api/client/...`
- `/api/reseller/...`

Ces routes pilotent l'experience de chaque espace.

### Platform APIs

Routes cibles:

- `/api/platform/catalog/...`
- `/api/platform/licenses/...`
- `/api/platform/accounts/...`
- `/api/platform/subscriptions/...`
- `/api/platform/audit/...`

Ces routes exposent le coeur plateforme.

### Product APIs

Routes cibles:

- `/api/products/tiketmomo/...`

Plus tard:

- `/api/products/<product-code>/...`

## Current Misalignments

Les problemes principaux observes:

- `clientRoutes` et `resellerRoutes` sont encore des aliases vers `managerRoutes` et `partnerRoutes`
- les controllers `client` et `reseller` restent des facades, pas de vraies frontieres
- `adminRoutes` melange auth HTML legacy, API admin, comptes et operations
- `server.js` branche encore une surface routee a plat tres orientee application historique
- les workspaces ne sont pas encore separes des domaines produit

## Design Principles

- `platform first`
- `workspace aware`
- `product isolated`
- `legacy compatible but not legacy driven`
- `additive migration over big bang rewrite`

## Migration Strategy

### Phase 1

Stabiliser le coeur plateforme:

- catalogue
- plans
- subscriptions
- reseller permissions

### Phase 2

Rendre les workspaces autonomes:

- admin workspace
- client workspace
- reseller workspace

### Phase 3

Isoler `TiketMomo` dans un vrai domaine produit:

- services
- repositories
- routes produit
- dashboards produit

### Phase 4

Maintenir puis reduire la couche legacy:

- aliases HTTP
- aliases de noms
- anciens adapters

## Success Criteria

Le backend cible sera considere aligne quand:

- `admin` peut gerer un catalogue multi-produit
- `client` peut voir plusieurs produits actifs dans son workspace
- `reseller` peut vendre un ou plusieurs produits selon ses droits
- `TiketMomo` n'est plus le centre implicite du backend
- un nouveau produit peut etre ajoute sans casser les workspaces existants
- les routes legacy existent encore si necessaire, mais ne pilotent plus l'architecture
