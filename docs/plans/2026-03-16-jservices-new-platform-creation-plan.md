# J+SERVICES New Platform Creation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Créer un nouveau projet frontend-first J+SERVICES, indépendant du backend actuel, structuré comme une plateforme web multi-app centralisée avec surface publique, workspace client, workspace reseller et workspace admin.

**Architecture:** Une application web unique Next.js App Router, organisée par workspaces et domaines métier, alimentée d’abord par des contrats de données et des repositories mock. Le backend réel sera branché plus tard via une couche d’adapters API sans modifier la structure produit.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, TanStack Query, Zod, pnpm workspaces, design system maison.

---

## 1. Project Identity

### 1.1 Recommended project name

Nom de travail recommandé :

- `jservices-platform`

Autres variantes possibles :

- `jservices-os`
- `jservices-web-platform`
- `jservices-control-hub`

Recommandation :

- garder `jservices-platform`

Pourquoi :

- clair
- scalable
- cohérent avec la vision multi-app
- neutre vis-à-vis des services précis

### 1.2 Project intent

Ce projet doit devenir :

- la nouvelle source de vérité produit
- la référence UX
- la base des contrats frontend
- la base des futures APIs backend

---

## 2. Repository Strategy

### 2.1 Recommended approach

Créer un **nouveau projet entièrement séparé** de l’application actuelle.

Ne pas refondre dans l’existant.

### 2.2 Why

Le projet actuel contient trop de dette structurelle et de couplage backend/frontend.

Le nouveau projet doit permettre :

- un démarrage propre
- un design system propre
- des contrats de données propres
- une arborescence claire
- une mise en place progressive du backend plus tard

### 2.3 Top-level repo shape

```txt
jservices-platform/
  apps/
    web/
  packages/
    ui/
    contracts/
    config/
    utils/
  docs/
  package.json
  pnpm-workspace.yaml
  turbo.json (optional)
  README.md
```

---

## 3. Execution Order

Le projet doit être créé dans cet ordre :

1. initialiser le repository et le workspace
2. scaffold l’app `web`
3. scaffold les packages partagés
4. installer le design system de base
5. créer les contrats frontend
6. créer la couche mock data
7. créer les repositories métier
8. créer le shell global de la plateforme
9. créer la surface publique
10. créer auth / onboarding / routing dynamique
11. créer le workspace client
12. créer le workspace reseller
13. créer le workspace admin
14. créer la couche d’adapters API future
15. documenter les contrats backend attendus

---

## 4. Scaffold Target Structure

### 4.1 Monorepo root

```txt
jservices-platform/
  apps/
    web/
      app/
      components/
      features/
      lib/
      mocks/
      styles/
      public/
      package.json
      tsconfig.json
      next.config.ts
      postcss.config.js
      tailwind.config.ts (or CSS-first config if chosen)
    ...
  packages/
    ui/
      src/
      package.json
      tsconfig.json
    contracts/
      src/
      package.json
      tsconfig.json
    config/
      src/
      package.json
    utils/
      src/
      package.json
  docs/
    plans/
  package.json
  pnpm-workspace.yaml
  README.md
```

### 4.2 Web app route groups

```txt
apps/web/app/
  (public)/
    page.tsx
    catalog/
    products/
    pricing/
    contact/
  (auth)/
    auth/
    onboarding/
    switch-workspace/
  admin/
  client/
  reseller/
```

---

## 5. Domain-First Feature Structure

### 5.1 Feature folders

```txt
apps/web/features/
  auth/
  public-catalog/
  products/
  organizations/
  licenses/
  transactions/
  payouts/
  activity/
  client/
  reseller/
  admin/
```

### 5.2 What each feature should contain

Each feature should be allowed to contain:

- `components/`
- `hooks/`
- `repositories/`
- `mocks/`
- `view-models/`
- `transformers/`
- `schemas/`
- `types/`

### 5.3 Rule

No feature should depend directly on backend endpoints.

It must depend on:

- contracts
- repositories
- mock or api adapters

---

## 6. Shared Packages

### 6.1 `packages/ui`

Purpose:

- centralize reusable design system components

Initial contents:

- shell primitives
- buttons
- badges
- cards
- section headers
- tables
- empty/error/loading states
- support blocks
- activity components

### 6.2 `packages/contracts`

Purpose:

- canonical Zod schemas and TS types

Initial files:

- `session.contract.ts`
- `organization.contract.ts`
- `workspace.contract.ts`
- `user.contract.ts`
- `product.contract.ts`
- `plan.contract.ts`
- `subscription.contract.ts`
- `license.contract.ts`
- `inventory.contract.ts`
- `sync.contract.ts`
- `transaction.contract.ts`
- `commission.contract.ts`
- `payout.contract.ts`
- `activity.contract.ts`

### 6.3 `packages/config`

Purpose:

- central config for metadata and app constants

Examples:

- workspace labels
- role labels
- routes
- navigation config
- brand tokens

### 6.4 `packages/utils`

Purpose:

- shared formatting and helper functions

Examples:

- currency formatting
- date formatting
- status mapping
- route helpers
- display transformers

---

## 7. Data Layer Blueprint

### 7.1 Phase 1 mode

The app must run fully in `mock-first mode`.

This means:

- no hard dependency on backend
- all pages can render with fake but realistic data
- contracts are already typed

### 7.2 Data architecture

```txt
contracts -> repositories -> adapters -> pages/components
```

### 7.3 Repository examples

Create these interfaces first:

- `AuthRepository`
- `CatalogRepository`
- `ProductRepository`
- `ClientWorkspaceRepository`
- `ResellerWorkspaceRepository`
- `AdminWorkspaceRepository`
- `OrganizationRepository`
- `NotificationRepository`

### 7.4 Adapter strategy

Initial adapter set:

- `mock-auth.adapter.ts`
- `mock-catalog.adapter.ts`
- `mock-client-workspace.adapter.ts`
- `mock-reseller-workspace.adapter.ts`
- `mock-admin-workspace.adapter.ts`

Future adapter set:

- `api-auth.adapter.ts`
- `api-catalog.adapter.ts`
- `api-client-workspace.adapter.ts`
- `api-reseller-workspace.adapter.ts`
- `api-admin-workspace.adapter.ts`

---

## 8. Global Navigation and Routing

### 8.1 Global surfaces

The application must support:

- public surface
- auth/onboarding surface
- client workspace
- reseller workspace
- admin workspace

### 8.2 Route ownership

#### Public

- `/`
- `/catalog`
- `/products`
- `/products/[slug]`
- `/pricing`
- `/contact`

#### Auth

- `/auth`
- `/onboarding`
- `/switch-workspace`

#### Client

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

#### Reseller

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

#### Admin

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

## 9. Design System Build Order

### 9.1 First layer

Create first:

- `AppShell`
- `Sidebar`
- `Topbar`
- `SectionHeader`
- `StatusBadge`
- `Button`
- `Input`
- `Select`
- `Panel`

### 9.2 Second layer

Then create:

- `StatCard`
- `ProductCard`
- `DataTable`
- `QuickActions`
- `ActivityFeed`
- `SupportCenter`
- `RecentActivity`

### 9.3 State components

Then create:

- `LoadingState`
- `EmptyState`
- `ErrorState`
- `NoAccessState`

### 9.4 Visual direction

The design system must encode:

- premium B2B glass style
- hierarchy by workspace
- role-based context feeling
- 2026 UI patterns

---

## 10. Workspace Delivery Order

### 10.1 Public App first

Reason:

- defines brand
- defines value proposition
- defines product model
- defines catalog and pricing language

### 10.2 Auth and onboarding second

Reason:

- defines access model
- defines routing logic
- defines user-role-workspace transitions

### 10.3 Client workspace third

Reason:

- operational foundation
- product usage model
- inventory/license/sync contracts

### 10.4 Reseller workspace fourth

Reason:

- extends commerce layer
- commission and payout models
- product distribution logic

### 10.5 Admin workspace fifth

Reason:

- depends on all platform entities
- should consume stabilized product and operational concepts

---

## 11. Concrete Creation Phases

### Phase A - Repository initialization

Deliverables:

- new repo folder
- root workspace config
- README
- pnpm workspace
- app/package skeleton

### Phase B - Core platform foundation

Deliverables:

- brand config
- route config
- role config
- workspace config
- shell layout

### Phase C - Contracts and mock layer

Deliverables:

- all canonical contracts
- fake datasets
- repositories
- mock adapters

### Phase D - Public app

Deliverables:

- landing
- catalog
- product page
- pricing
- contact

### Phase E - Auth / onboarding

Deliverables:

- auth portal
- role detection flow
- onboarding flow
- workspace router

### Phase F - Client workspace

Deliverables:

- dashboard
- products
- operations
- usage
- licenses
- sync
- support
- activity
- settings

### Phase G - Reseller workspace

Deliverables:

- dashboard
- catalog
- sales
- commissions
- payouts
- promo
- settings

### Phase H - Admin workspace

Deliverables:

- overview
- organizations
- users
- products
- plans
- licenses
- transactions
- resellers
- monitoring
- audit
- settings

### Phase I - Backend handoff preparation

Deliverables:

- API adapter boundaries
- request/response contracts
- backend dependency matrix
- integration notes

---

## 12. Documentation Required Along the Way

Each phase should produce or update:

- `README.md`
- product architecture notes
- route tree
- entity map
- contracts reference
- backend handoff notes

This is important because the studio of agents must be able to continue without losing business logic or structural decisions.

---

## 13. Non-Negotiable Build Rules

### 13.1 Do not

- do not connect directly to the old backend
- do not reuse current screens as canonical source
- do not build monolithic dashboards
- do not mix raw API DTOs with UI view models
- do not let technical debt define product structure

### 13.2 Must do

- contracts first
- mocks first
- repositories first
- pages by role
- strong design system
- documentation preserved as source of truth

---

## 14. Immediate File Creation Targets

When scaffolding starts, these files should exist early:

### Root

- `package.json`
- `pnpm-workspace.yaml`
- `README.md`

### App web

- `apps/web/package.json`
- `apps/web/app/layout.tsx`
- `apps/web/app/globals.css`
- `apps/web/app/(public)/page.tsx`
- `apps/web/app/(auth)/auth/page.tsx`
- `apps/web/app/client/page.tsx`
- `apps/web/app/reseller/page.tsx`
- `apps/web/app/admin/page.tsx`

### Packages contracts

- `packages/contracts/src/index.ts`
- all contract files

### Packages ui

- `packages/ui/src/index.ts`
- core shell components
- basic state components

### Mocks

- `apps/web/mocks/session.mock.ts`
- `apps/web/mocks/catalog.mock.ts`
- `apps/web/mocks/client.mock.ts`
- `apps/web/mocks/reseller.mock.ts`
- `apps/web/mocks/admin.mock.ts`

---

## 15. Success Criteria for the Creation Phase

The creation phase is successful if:

- the new project exists independently
- the route structure is scaffolded
- the contracts package is in place
- the mock layer is in place
- the design system base is in place
- the public app and workspace shells can render without backend

---

## 16. Next Plan Recommended

After this creation plan, the next execution document should be:

`J+SERVICES Phase 1 Scaffolding Plan`

That plan should break the first implementation into atomic tasks:

- initialize repo
- create workspace
- scaffold Next app
- create packages
- install dependencies
- create route groups
- create shell base
- create first contracts
- create first mocks

This next plan should be the one used to actually start coding.
