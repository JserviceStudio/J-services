# Platform-First Backend Refactor Plan

**Goal:** Faire converger le backend vers une plateforme studio multi-produit `J+SERVICES`, avec workspaces role-based et domaines produit isolables.

## Phase 1: Freeze the current contract

**Files:**

- Review: [src/server.js](/home/juste-dev/Documents/TiketMomo/src/server.js)
- Review: [database/supabase_master_schema.sql](/home/juste-dev/Documents/TiketMomo/database/supabase_master_schema.sql)
- Review: [docs/plans/2026-03-16-platform-first-backend-design.md](/home/juste-dev/Documents/TiketMomo/docs/plans/2026-03-16-platform-first-backend-design.md)

**Actions:**

- lister les routes publiques a conserver pendant la migration
- geler les aliases `manager` et `partner` comme compat layer
- clarifier la surface canonique cible `admin/client/reseller`

## Phase 2: Introduce platform catalog modules

**Files:**

- Create: `src/modules/catalog-management/`
- Create: `src/modules/subscription-management/`
- Create: `src/modules/account-management/`

**Actions:**

- definir `products`
- definir `product_plans`
- definir `client_product_subscriptions`
- definir `reseller_product_permissions`
- exposer services et repositories canoniques

**Outcome:**

Le backend sait parler catalogue, plans, activations et droits reseller sans passer par la logique TiketMomo.

## Phase 3: Rebuild workspace orchestration

**Files:**

- Create: `src/modules/workspace-orchestration/`
- Modify: `src/modules/admin-control-plane/`
- Modify: `src/modules/client-workspace/`
- Modify: `src/modules/partner-marketing/`

**Actions:**

- faire du workspace admin le point d'entree du control plane
- faire du workspace client une coquille capable d'afficher plusieurs apps
- faire du workspace reseller une coquille capable de vendre plusieurs produits
- isoler `overview`, `apps available`, `settings`, `activity`

**Outcome:**

Les workspaces representent une experience role-based et non un produit particulier.

## Phase 4: Isolate TiketMomo as a product domain

**Files:**

- Create: `src/modules/products/tiketmomo/`
- Move from:
  - `voucher-operations`
  - parties de `payment-billing`
  - parties de `client-workspace`

**Actions:**

- regrouper les operations voucher, checkout, success flow et sync dans le domaine produit
- exposer une API produit `tiketmomo`
- retirer la dependance implicite du workspace client a ce seul produit

**Outcome:**

`TiketMomo` devient un domaine produit explicite, remplaçable et extensible.

## Phase 5: Normalize HTTP routing

**Files:**

- Modify: [src/server.js](/home/juste-dev/Documents/TiketMomo/src/server.js)
- Create: `src/routes/platform/`
- Create: `src/routes/products/`

**Actions:**

- introduire des routes `platform`
- introduire des routes `products/tiketmomo`
- conserver temporairement:
  - `/api/v1/managers`
  - `/partners`
- faire deleguer les anciennes routes vers les nouvelles

**Outcome:**

La surface HTTP devient lisible et coherent avec la plateforme cible.

## Phase 6: Align admin with platform governance

**Files:**

- Modify: [src/routes/admin/adminRoutes.js](/home/juste-dev/Documents/TiketMomo/src/routes/admin/adminRoutes.js)
- Modify: [src/controllers/admin/adminController.js](/home/juste-dev/Documents/TiketMomo/src/controllers/admin/adminController.js)
- Modify: `src/modules/admin-control-plane/services/adminDashboardService.js`

**Actions:**

- ajouter la gestion catalogue produit
- ajouter l'activation produit par client
- ajouter les permissions reseller par produit
- separer plus clairement auth admin, API admin et operations de gouvernance

**Outcome:**

L'admin devient le vrai control plane multi-produit.

## Phase 7: Prepare client and reseller growth

**Files:**

- Modify: `src/modules/client-workspace/services/clientDashboardService.js`
- Modify: `src/modules/partner-marketing/services/partnerPortalService.js`

**Actions:**

- faire remonter les produits actifs dans le workspace client
- faire remonter les produits vendables dans le workspace reseller
- preparer les points d'entree pour les futurs dashboards produit

**Outcome:**

Le backend sait deja accueillir de nouveaux dashboards sans changer sa structure de base.

## Phase 8: Reduce legacy surface carefully

**Files:**

- Modify: compat adapters and legacy routes only after parity is reached

**Actions:**

- mesurer ce qui consomme encore `manager` et `partner`
- supprimer les aliases uniquement apres verification
- garder les colonnes SQL legacy tant qu'une migration de schema complete n'est pas planifiee

## Verification Criteria

- l'admin peut gerer plusieurs produits
- un client peut avoir plusieurs produits actifs
- un reseller peut avoir plusieurs lignes de vente produit
- `TiketMomo` est isole en tant que produit
- les anciennes routes ne sont plus l'architecture principale
- le backend peut absorber un nouveau produit sans refonte majeure
