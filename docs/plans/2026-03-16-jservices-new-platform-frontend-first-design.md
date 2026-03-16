# J+SERVICES New Platform Frontend-First Design

> **Intent:** document complet de cadrage produit, UX, structure métier et architecture frontend-first pour reconstruire J+SERVICES comme une nouvelle plateforme web multi-app centralisée, indépendante du backend actuel.

---

## 1. Executive Summary

Le projet existant est devenu trop dense, trop couplé entre frontend et backend, et trop orienté "dashboard technique" au lieu d’être pensé comme un vrai produit startup multi-services.

La décision retenue est de **ne pas continuer à faire évoluer l’application actuelle comme source de vérité produit**.

À la place, J+SERVICES sera reconstruit comme un **nouveau projet web complet**, avec une logique **frontend-first** :

1. définir clairement le produit
2. définir les rôles, workspaces, pages, entités et flux
3. développer une application web complète avec mocks et contrats frontend
4. seulement ensuite brancher ou redévelopper un backend pour servir cette application

Le frontend devient donc :

- la référence canonique du produit
- la référence de l’expérience utilisateur
- la référence des contrats de données
- la base des futures APIs backend

---

## 2. Product Vision

### 2.1 Positionnement

J+SERVICES est une **plateforme web multi-services de gestion, de distribution, de commercialisation et de supervision**, destinée à servir plusieurs types d’utilisateurs dans un même écosystème :

- administrateurs plateforme
- clients exploitants
- resellers / partenaires
- visiteurs / prospects

### 2.2 Vision cible

Construire une **single web application** organisée comme une **multi-app platform**.

Cette application contient plusieurs surfaces métier dans une seule plateforme :

- une surface publique de vente et présentation
- une app client
- une app reseller
- une app admin

### 2.3 Principe central

L’utilisateur entre par une **landing page / portail principal**, puis l’application :

- affiche le catalogue public
- permet l’achat ou l’activation
- gère l’authentification
- détecte le rôle et les permissions
- route dynamiquement l’utilisateur vers le bon workspace

### 2.4 Objectif stratégique

Créer un produit qui permette :

- de présenter et vendre les produits/services J+SERVICES
- d’activer et gérer les accès
- d’exploiter les produits côté client
- de vendre et suivre les performances côté reseller
- de superviser tout l’écosystème côté admin

---

## 3. Core Product Principles

### 3.1 Frontend-first

Le frontend doit être conçu **sans dépendre des limitations actuelles du backend**.

Le backend futur doit s’aligner sur :

- les écrans
- les workflows
- les états
- les entités métier
- les besoins de données du frontend

### 3.2 Product-first

Le système ne doit pas être pensé comme une collection de tableaux ou de pages techniques.

Chaque surface doit porter une mission claire :

- `Public`: acquisition et conversion
- `Client`: exploitation
- `Reseller`: commercialisation
- `Admin`: supervision et gouvernance

### 3.3 Multi-page, not monolithic

Il faut bannir le modèle :

- écran unique très dense
- dashboard empilé
- sections sans hiérarchie

Chaque workspace doit être structuré en pages et sections spécialisées.

### 3.4 Premium B2B 2026 UX

Le langage visuel attendu :

- glassmorphism maîtrisé
- blur subtil
- cartes riches
- hiérarchie typographique forte
- badges et statuts lisibles
- tuiles visuelles produits
- surfaces premium et intentionnelles

---

## 4. Business Model of the Platform

J+SERVICES est une startup multi-services de gestion et de distribution.

Le produit doit pouvoir couvrir :

- catalogue de produits numériques ou services
- licences et abonnements
- accès par rôle
- opérations client
- activité revendeur
- paiements, commissions et retraits
- support
- monitoring et audit

Le produit peut commencer avec un périmètre plus simple, mais sa structure doit permettre d’évoluer vers un écosystème plus large sans refonte des fondations.

---

## 5. Canonical Business Structure

### 5.1 Core entities

Le centre métier ne doit pas être la branche.

La structure recommandée est :

- `Platform`
- `Organization`
- `User`
- `Membership`
- `Role`
- `Workspace`
- `Product`
- `ProductPlan`
- `Subscription`
- `License`
- `SellableProductPermission`
- `InventoryItem`
- `SyncJob`
- `Transaction`
- `Commission`
- `Payout`
- `ActivityEvent`
- `Notification`

### 5.2 Why organization-first

Le modèle `organization-first` est préférable à un modèle `branch-first`, car il :

- supporte petits et grands comptes
- évite de rigidifier le produit trop tôt
- simplifie auth, permissions et routing
- permet d’ajouter branches/sites/stores plus tard

### 5.3 Branches

Les branches ne doivent pas être une entité fondatrice du produit V1.

Elles doivent exister plus tard comme sous-entité de `Organization`, par exemple :

- branch
- agency
- site
- store
- point of sale
- operational unit

---

## 6. Roles and Access Model

### 6.1 Base roles

Rôles recommandés :

- `platform_admin`
- `org_admin`
- `client_operator`
- `reseller_owner`
- `reseller_agent`
- `support_agent`
- `viewer`

### 6.2 Role logic

Le rôle gouverne :

- le workspace accessible
- la navigation visible
- les actions possibles
- les données visibles
- les redirections post-login

### 6.3 Multi-role users

Le système doit prévoir qu’un utilisateur puisse avoir :

- plusieurs organisations
- plusieurs rôles
- plusieurs workspaces accessibles

Il faut donc prévoir un `workspace switcher` et éventuellement un `organization switcher`.

---

## 7. Workspace Model

### 7.1 Public App

Mission :

- présenter l’offre
- convertir
- vendre
- activer

### 7.2 Client App

Mission :

- exploiter les services achetés
- gérer les produits actifs
- suivre licences, stock, sync, activité

### 7.3 Reseller App

Mission :

- vendre
- suivre ventes et commissions
- gérer retraits et promo performance

### 7.4 Admin App

Mission :

- superviser et piloter l’ensemble de l’écosystème

---

## 8. Access and Routing Logic

### 8.1 Entry point

L’entrée principale du produit est la landing page.

Depuis cette surface, un visiteur peut :

- découvrir les produits
- consulter le catalogue
- voir les offres
- demander une démo
- acheter une licence
- créer ou activer un compte

### 8.2 Auth portal

Le portail auth est une brique produit centrale, pas juste une page de login.

Il doit gérer :

- login
- session recovery
- détection du rôle
- détection de l’organisation active
- redirection automatique
- fallback onboarding

### 8.3 Dynamic post-login routing

Après connexion, le système doit déterminer :

- qui est l’utilisateur
- quelle organisation est active
- quels workspaces sont accessibles
- quel est le workspace par défaut
- si l’utilisateur doit compléter son onboarding

Puis router vers :

- `/client`
- `/reseller`
- `/admin`

### 8.4 Workspace switching

Si plusieurs workspaces sont accessibles, l’application doit permettre :

- de choisir le workspace
- de changer de contexte
- de conserver l’organisation active

---

## 9. Global Route Tree

### 9.1 Root and public

- `/`
- `/catalog`
- `/products`
- `/products/[slug]`
- `/pricing`
- `/contact`
- `/auth`
- `/onboarding`
- `/switch-workspace`
- `/legal/terms`
- `/legal/privacy`

### 9.2 Client workspace

- `/client`
- `/client/products`
- `/client/products/[productSlug]`
- `/client/operations`
- `/client/licenses`
- `/client/usage`
- `/client/sync`
- `/client/support`
- `/client/activity`
- `/client/settings`

### 9.3 Reseller workspace

- `/reseller`
- `/reseller/catalog`
- `/reseller/products/[productSlug]`
- `/reseller/sales`
- `/reseller/commissions`
- `/reseller/payouts`
- `/reseller/promo`
- `/reseller/clients`
- `/reseller/activity`
- `/reseller/settings`

### 9.4 Admin workspace

- `/admin`
- `/admin/organizations`
- `/admin/users`
- `/admin/products`
- `/admin/plans`
- `/admin/licenses`
- `/admin/transactions`
- `/admin/resellers`
- `/admin/clients`
- `/admin/monitoring`
- `/admin/audit`
- `/admin/settings`

---

## 10. Page-Level Product Structure

### 10.1 Public App

#### Landing

Sections :

- hero
- proposition de valeur
- produits phares
- catégories
- cas d’usage
- trust / proof
- CTA auth / catalog / pricing

#### Catalog

Sections :

- header
- search
- categories
- filters
- product cards
- pricing entry points

#### Product page

Sections :

- product hero
- product summary
- benefits
- features
- plans
- FAQ
- CTA buy / activate

### 10.2 Client App

#### Client dashboard

Sections :

- workspace header
- KPI strip
- my products
- operations snapshot
- inventory and sales
- voucher inventory
- sync history
- support center
- recent activity

#### Products

- active product cards
- plan and status
- route to product detail

#### Product detail

- product hero
- modules
- status
- actions
- config
- recent activity

#### Usage

- inventory summary
- profiles
- availability
- alerts
- filter / search

#### Licenses

- license summary
- current plan
- expiry
- renewal CTA

#### Sync

- sync summary
- recent jobs
- errors
- history

### 10.3 Reseller App

#### Reseller dashboard

Sections :

- hero stats
- top selling products
- recent commissions
- sales focus
- payout monitoring
- promo activation
- average commission

#### Catalog

- sellable products
- plans
- commissions
- product card grid

#### Sales

- sales history
- status
- reference
- date
- amount
- product

#### Commissions

- totals
- averages
- period filters
- commission table

#### Payouts

- balance
- payout requests
- operators
- status
- history

#### Promo

- promo code
- activations
- conversions
- linked products
- traction

### 10.4 Admin App

#### Admin overview

Sections :

- page header
- KPI strip
- activity feed
- quick actions
- monitoring summary
- license operations
- payout monitoring
- reseller health

#### Other admin pages

Must cover :

- organizations
- users
- products
- plans
- licenses
- transactions
- resellers
- clients
- monitoring
- audit
- settings

---

## 11. Visual Direction and UX Standards

### 11.1 Design direction

The platform should feel like:

- a premium B2B operating system
- a control plane
- a commerce and operations hub

### 11.2 UI expectations

The design language should include:

- glass panels
- layered surfaces
- subtle blur
- strong typography
- icon tiles
- rich cards
- clear badges
- visual product cards
- non-generic layouts

### 11.3 Non-negotiable UX rules

- no page should feel like an unstructured stack
- tables must always be contextualized
- each page needs hierarchy
- each workspace needs narrative clarity
- loading / empty / error states are mandatory
- keyboard and baseline accessibility are mandatory

---

## 12. Frontend Contracts and Domain Models

### 12.1 Canonical frontend domain entities

#### PlatformUser

- `id`
- `email`
- `fullName`
- `avatarUrl`
- `status`
- `globalRoles[]`
- `lastLoginAt`

#### Organization

- `id`
- `name`
- `slug`
- `type`
- `status`
- `logoUrl`
- `country`
- `currency`
- `timezone`
- `createdAt`

#### Membership

- `id`
- `userId`
- `organizationId`
- `role`
- `workspaceAccess[]`
- `status`

#### Workspace

- `id`
- `key`
- `label`
- `description`
- `route`
- `enabled`

#### Product

- `id`
- `code`
- `slug`
- `name`
- `shortDescription`
- `longDescription`
- `category`
- `status`
- `coverImage`
- `icon`
- `defaultRoute`
- `tags[]`

#### ProductPlan

- `id`
- `productId`
- `code`
- `name`
- `billingType`
- `price`
- `currency`
- `durationDays`
- `features[]`
- `status`

#### Subscription

- `id`
- `organizationId`
- `productId`
- `planId`
- `status`
- `startsAt`
- `endsAt`
- `autoRenew`
- `source`

#### License

- `id`
- `subscriptionId`
- `licenseKey`
- `status`
- `issuedAt`
- `expiresAt`
- `assignedToUserId?`
- `metadata`

#### SellableProductPermission

- `id`
- `organizationId`
- `productId`
- `planId?`
- `status`
- `commissionType`
- `commissionValue`
- `salePriceOverride?`

#### InventoryItem

- `id`
- `organizationId`
- `productId`
- `profile`
- `code`
- `price`
- `status`
- `siteId?`
- `createdAt`

#### SyncJob

- `id`
- `organizationId`
- `source`
- `jobType`
- `status`
- `batchSize`
- `inserted`
- `ignored`
- `errorMessage?`
- `createdAt`
- `processedAt?`

#### Transaction

- `id`
- `organizationId`
- `type`
- `status`
- `reference`
- `amount`
- `currency`
- `productId?`
- `planId?`
- `createdAt`

#### Commission

- `id`
- `resellerOrgId`
- `transactionId`
- `reference`
- `amount`
- `status`
- `commissionDate`
- `saleKind`

#### Payout

- `id`
- `resellerOrgId`
- `amount`
- `status`
- `operator`
- `phoneNumber`
- `errorMessage?`
- `createdAt`
- `updatedAt`

#### ActivityEvent

- `id`
- `organizationId`
- `workspace`
- `eventType`
- `title`
- `description`
- `status`
- `amount?`
- `reference?`
- `createdAt`

#### Notification

- `id`
- `userId`
- `title`
- `body`
- `type`
- `read`
- `createdAt`

### 12.2 Frontend contracts by surface

#### AuthSessionContract

- `user`
- `activeOrganization`
- `memberships[]`
- `availableWorkspaces[]`
- `defaultWorkspace`
- `requiresOnboarding`

#### PublicCatalogContract

- `featuredProducts[]`
- `catalogProducts[]`
- `categories[]`
- `pricingHighlights[]`
- `faqs[]`

#### ClientDashboardContract

- `organization`
- `user`
- `activeSubscriptions[]`
- `activeProducts[]`
- `licenseSummary`
- `inventorySummary`
- `inventoryProfiles[]`
- `recentInventoryItems[]`
- `syncSummary`
- `recentSyncJobs[]`
- `recentActivity[]`
- `supportLinks[]`

#### ResellerDashboardContract

- `organization`
- `user`
- `sellableProducts[]`
- `summary`
- `topSellingProducts[]`
- `recentCommissions[]`
- `recentPayouts[]`
- `promoSummary`
- `recentActivity[]`

#### AdminDashboardContract

- `platformSummary`
- `organizationSummary`
- `revenueSummary`
- `licenseSummary`
- `resellerSummary`
- `recentAuditEvents[]`
- `recentTransactions[]`
- `recentPayouts[]`
- `topResellers[]`
- `alerts[]`

### 12.3 Required frontend states

Every surface must explicitly support:

- `loading`
- `empty`
- `partial`
- `error`
- `unauthorized`
- `requires_onboarding`

---

## 13. Technical Blueprint for the New Project

### 13.1 Recommended format

Use a **light monorepo**, but with one real product app.

Recommended shape:

- one platform app
- one shared design system
- one shared contracts package
- one shared utilities package

### 13.2 Stack

- `Next.js App Router`
- `TypeScript`
- `Tailwind CSS`
- `React`
- `TanStack Query`
- `Zod`
- optional `Zustand` for light global state only

### 13.3 Why this stack

It supports:

- route-based multi-app UX
- shared contracts
- typed mock data
- progressive API integration later
- scalable design system

---

## 14. Recommended Repository Structure

```txt
jservices-platform/
  apps/
    web/
      app/
        (public)/
        (auth)/
        admin/
        client/
        reseller/
      components/
      features/
      lib/
      styles/
      mocks/
  packages/
    ui/
    config/
    contracts/
    utils/
```

### 14.1 App folders

#### `app/(public)`

Contains:

- landing
- catalog
- products
- pricing
- contact

#### `app/(auth)`

Contains:

- auth portal
- onboarding
- switch workspace

#### `app/admin`

Admin workspace routes

#### `app/client`

Client workspace routes

#### `app/reseller`

Reseller workspace routes

### 14.2 Feature organization

Use domain-first organization:

```txt
features/
  auth/
  public-catalog/
  admin/
  client/
  reseller/
  products/
  licenses/
  transactions/
  payouts/
  activity/
  organizations/
```

Each feature can contain:

- components
- hooks
- view-models
- repositories
- mocks
- transformers

---

## 15. Data Layer Strategy

### 15.1 Phase 1: no real backend

The application should run on:

- contracts
- fake datasets
- repositories
- mock adapters

### 15.2 Repository pattern

The UI should never consume raw backend directly.

Pages should consume repositories such as:

- `ProductRepository`
- `LicenseRepository`
- `ClientWorkspaceRepository`
- `ResellerWorkspaceRepository`
- `AdminWorkspaceRepository`
- `AuthRepository`

### 15.3 Adapter strategy

Start with:

- `mock adapters`

Later replace with:

- `api adapters`

Without rewriting screens.

---

## 16. Design System Scope

### 16.1 Shared components to create

- `AppShell`
- `Sidebar`
- `Topbar`
- `WorkspaceHeader`
- `SectionHeader`
- `StatCard`
- `ProductCard`
- `ActivityFeed`
- `KpiStrip`
- `DataTable`
- `StatusBadge`
- `QuickActions`
- `SupportCenter`
- `RecentActivity`
- `SyncHistory`
- `LicenseSummary`
- `PayoutSummary`
- `PromoPerformance`
- `TopSellingProducts`
- `LoadingState`
- `EmptyState`
- `ErrorState`
- `NoAccessState`

### 16.2 Design system mission

The design system must define:

- visual identity
- layout grammar
- interaction language
- reusable workspace patterns
- state presentation

---

## 17. Delivery Sequence

### 17.1 Recommended implementation order

1. contracts
2. mock data
3. repositories
4. design system
5. public app
6. auth + onboarding + dynamic routing
7. client app
8. reseller app
9. admin app
10. adapter layer for backend integration
11. real backend connection

### 17.2 Why this order

This sequence:

- preserves product clarity
- reduces coupling
- stabilizes UX first
- makes backend needs explicit

---

## 18. Things Explicitly Rejected

The new project must avoid:

- reusing the current backend as product source of truth
- designing screens around legacy API limitations
- rebuilding monolithic dashboards
- mixing UI types and backend raw DTOs
- over-coupling admin/client/reseller implementations
- introducing branches as core entity too early

---

## 19. Definition of Success

The project is successful if:

- the app can be understood and navigated without real backend integration
- each workspace has a clear mission
- each page has a clear structure
- the frontend is complete enough to serve as product reference
- the future backend can be built from frontend needs, not the reverse
- J+SERVICES becomes a coherent startup platform instead of a stack of disconnected dashboards

---

## 20. Immediate Next Step

The next recommended deliverable after this document is:

`J+SERVICES New Platform Creation Plan`

This plan should define:

- exact project name
- exact folders to scaffold
- packages to initialize
- route tree to create
- contract files to create
- mock repositories to create
- design system files to create
- delivery order in small executable tasks

That next plan should be used to actually scaffold the new project.
