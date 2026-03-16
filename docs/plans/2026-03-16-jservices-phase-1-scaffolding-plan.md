# J+SERVICES Phase 1 Scaffolding Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Initialiser le nouveau projet `jservices-platform` avec sa structure monorepo, son application web Next.js, ses packages partagés, sa base de design system, ses premiers contrats et ses premières données mock.

**Architecture:** Une plateforme web unique organisée en monorepo léger avec `apps/web` comme application principale, et `packages/ui`, `packages/contracts`, `packages/config`, `packages/utils` comme briques partagées. Cette phase ne branche aucun backend réel et pose seulement la fondation frontend-first.

**Tech Stack:** pnpm workspaces, Next.js App Router, React, TypeScript, Tailwind CSS, Zod, TanStack Query.

---

## Conventions générales

- Nouveau dossier cible recommandé : `../jservices-platform`
- Gestionnaire de paquets : `pnpm`
- Branche git recommandée : `main`
- Aucun branchement au backend existant dans cette phase
- Tous les écrans utilisent des mocks
- Tous les contrats sont définis avant les repositories

---

## Task 1: Create Repository Root

**Files:**
- Create: `../jservices-platform/`
- Create: `../jservices-platform/package.json`
- Create: `../jservices-platform/pnpm-workspace.yaml`
- Create: `../jservices-platform/README.md`
- Create: `../jservices-platform/.gitignore`

**Step 1: Create the project folder**

Run:

```bash
mkdir -p /home/juste-dev/Documents/jservices-platform
```

**Step 2: Initialize root package**

Run:

```bash
cd /home/juste-dev/Documents/jservices-platform
pnpm init
```

Then edit `package.json` to define:

- private workspace root
- scripts for dev, build, lint

Expected minimum shape:

```json
{
  "name": "jservices-platform",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "lint": "pnpm --filter web lint"
  }
}
```

**Step 3: Create workspace config**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - apps/*
  - packages/*
```

**Step 4: Create `.gitignore`**

Minimum:

```gitignore
node_modules
.next
dist
coverage
.turbo
.DS_Store
.env
.env.local
pnpm-lock.yaml
```

**Step 5: Create root README**

Document:

- project vision
- monorepo structure
- frontend-first approach
- workspace overview

**Step 6: Commit**

```bash
git init
git add package.json pnpm-workspace.yaml README.md .gitignore
git commit -m "chore: initialize jservices-platform workspace"
```

---

## Task 2: Scaffold `apps/web`

**Files:**
- Create: `../jservices-platform/apps/web/*`

**Step 1: Create Next.js app**

Run:

```bash
cd /home/juste-dev/Documents/jservices-platform
pnpm dlx create-next-app@latest apps/web --ts --eslint --app --src-dir false --import-alias "@/*" --use-pnpm
```

**Step 2: Verify app boots**

Run:

```bash
pnpm --filter web dev
```

Expected:

- Next.js starts successfully
- default app accessible locally

**Step 3: Stop dev server and clean default scaffolding**

Remove boilerplate visuals later, but keep:

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `next.config.*`
- `tsconfig.json`

**Step 4: Commit**

```bash
git add apps/web
git commit -m "chore: scaffold Next.js web app"
```

---

## Task 3: Create Shared Packages

**Files:**
- Create: `../jservices-platform/packages/ui/package.json`
- Create: `../jservices-platform/packages/ui/src/index.ts`
- Create: `../jservices-platform/packages/contracts/package.json`
- Create: `../jservices-platform/packages/contracts/src/index.ts`
- Create: `../jservices-platform/packages/config/package.json`
- Create: `../jservices-platform/packages/config/src/index.ts`
- Create: `../jservices-platform/packages/utils/package.json`
- Create: `../jservices-platform/packages/utils/src/index.ts`

**Step 1: Create package folders**

Run:

```bash
mkdir -p packages/ui/src packages/contracts/src packages/config/src packages/utils/src
```

**Step 2: Create minimal package manifests**

Each package should have:

- `name`
- `version`
- `private`
- `type`
- `main` / `exports`

Example for `packages/contracts/package.json`:

```json
{
  "name": "@jservices/contracts",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

**Step 3: Create empty index files**

Create:

- `packages/ui/src/index.ts`
- `packages/contracts/src/index.ts`
- `packages/config/src/index.ts`
- `packages/utils/src/index.ts`

**Step 4: Commit**

```bash
git add packages
git commit -m "chore: add shared package skeletons"
```

---

## Task 4: Install Core Dependencies

**Files:**
- Modify: `../jservices-platform/apps/web/package.json`
- Modify: `../jservices-platform/package.json`

**Step 1: Install app dependencies**

Run:

```bash
cd /home/juste-dev/Documents/jservices-platform
pnpm --filter web add @tanstack/react-query zod
```

**Step 2: Install dev/shared tooling if needed**

Run:

```bash
pnpm --filter web add -D @types/node
```

**Step 3: Ensure workspace package references are possible**

Later the app should import:

- `@jservices/ui`
- `@jservices/contracts`
- `@jservices/config`
- `@jservices/utils`

**Step 4: Commit**

```bash
git add package.json apps/web/package.json
git commit -m "chore: install frontend foundation dependencies"
```

---

## Task 5: Create Route Groups and Empty Page Shells

**Files:**
- Create: `apps/web/app/(public)/page.tsx`
- Create: `apps/web/app/(public)/catalog/page.tsx`
- Create: `apps/web/app/(public)/products/page.tsx`
- Create: `apps/web/app/(public)/pricing/page.tsx`
- Create: `apps/web/app/(public)/contact/page.tsx`
- Create: `apps/web/app/(auth)/auth/page.tsx`
- Create: `apps/web/app/(auth)/onboarding/page.tsx`
- Create: `apps/web/app/(auth)/switch-workspace/page.tsx`
- Create: `apps/web/app/admin/page.tsx`
- Create: `apps/web/app/client/page.tsx`
- Create: `apps/web/app/reseller/page.tsx`

**Step 1: Create route folders**

Run:

```bash
mkdir -p apps/web/app/'(public)'/catalog
mkdir -p apps/web/app/'(public)'/products
mkdir -p apps/web/app/'(public)'/pricing
mkdir -p apps/web/app/'(public)'/contact
mkdir -p apps/web/app/'(auth)'/auth
mkdir -p apps/web/app/'(auth)'/onboarding
mkdir -p apps/web/app/'(auth)'/switch-workspace
mkdir -p apps/web/app/admin
mkdir -p apps/web/app/client
mkdir -p apps/web/app/reseller
```

**Step 2: Replace default homepage**

Create lightweight placeholders that identify each surface clearly.

Example:

```tsx
export default function PublicHomePage() {
  return <main>J+SERVICES Landing</main>;
}
```

**Step 3: Add placeholder pages for auth and workspaces**

Each page should render a minimal heading only.

**Step 4: Run app**

Run:

```bash
pnpm --filter web dev
```

Expected:

- all route folders compile
- app still starts

**Step 5: Commit**

```bash
git add apps/web/app
git commit -m "feat: scaffold core public auth and workspace routes"
```

---

## Task 6: Create Initial Contracts

**Files:**
- Create: `packages/contracts/src/session.contract.ts`
- Create: `packages/contracts/src/organization.contract.ts`
- Create: `packages/contracts/src/user.contract.ts`
- Create: `packages/contracts/src/workspace.contract.ts`
- Create: `packages/contracts/src/product.contract.ts`
- Modify: `packages/contracts/src/index.ts`

**Step 1: Define first Zod schemas**

Start with:

- `WorkspaceSchema`
- `UserSchema`
- `OrganizationSchema`
- `SessionSchema`
- `ProductSchema`

Example minimal structure:

```ts
import { z } from 'zod';

export const WorkspaceSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  route: z.string(),
  enabled: z.boolean(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
```

**Step 2: Export all contracts**

Update `packages/contracts/src/index.ts`.

**Step 3: Commit**

```bash
git add packages/contracts
git commit -m "feat: add initial domain contracts"
```

---

## Task 7: Create Mock Data Seed Files

**Files:**
- Create: `apps/web/mocks/session.mock.ts`
- Create: `apps/web/mocks/catalog.mock.ts`
- Create: `apps/web/mocks/client.mock.ts`
- Create: `apps/web/mocks/reseller.mock.ts`
- Create: `apps/web/mocks/admin.mock.ts`

**Step 1: Create `mocks/` folder**

Run:

```bash
mkdir -p apps/web/mocks
```

**Step 2: Add realistic seed data**

Add mock data for:

- public catalog
- authenticated session
- client dashboard
- reseller dashboard
- admin dashboard

The mocks should reflect:

- products
- plans
- subscriptions
- licenses
- sales
- commissions
- payouts
- activity

**Step 3: Keep data consistent**

Example:

- same product IDs reused across catalog/client/reseller/admin mocks
- same org IDs reused
- same user IDs reused

**Step 4: Commit**

```bash
git add apps/web/mocks
git commit -m "feat: add initial platform mock datasets"
```

---

## Task 8: Create Repository Interfaces

**Files:**
- Create: `apps/web/features/auth/repositories/auth.repository.ts`
- Create: `apps/web/features/public-catalog/repositories/catalog.repository.ts`
- Create: `apps/web/features/client/repositories/client-workspace.repository.ts`
- Create: `apps/web/features/reseller/repositories/reseller-workspace.repository.ts`
- Create: `apps/web/features/admin/repositories/admin-workspace.repository.ts`

**Step 1: Create feature repository folders**

Run:

```bash
mkdir -p apps/web/features/auth/repositories
mkdir -p apps/web/features/public-catalog/repositories
mkdir -p apps/web/features/client/repositories
mkdir -p apps/web/features/reseller/repositories
mkdir -p apps/web/features/admin/repositories
```

**Step 2: Define repository interfaces**

Example:

```ts
export interface AuthRepository {
  getSession(): Promise<AuthSessionContract>;
}
```

**Step 3: Commit**

```bash
git add apps/web/features
git commit -m "feat: add repository interfaces for platform surfaces"
```

---

## Task 9: Create Mock Repository Adapters

**Files:**
- Create: `apps/web/features/auth/repositories/mock-auth.repository.ts`
- Create: `apps/web/features/public-catalog/repositories/mock-catalog.repository.ts`
- Create: `apps/web/features/client/repositories/mock-client-workspace.repository.ts`
- Create: `apps/web/features/reseller/repositories/mock-reseller-workspace.repository.ts`
- Create: `apps/web/features/admin/repositories/mock-admin-workspace.repository.ts`

**Step 1: Implement minimal mock adapters**

Each repository returns mock data from `apps/web/mocks/*`.

Example:

```ts
import { sessionMock } from '@/mocks/session.mock';
import type { AuthRepository } from './auth.repository';

export const mockAuthRepository: AuthRepository = {
  async getSession() {
    return sessionMock;
  },
};
```

**Step 2: Commit**

```bash
git add apps/web/features
git commit -m "feat: add mock repository adapters"
```

---

## Task 10: Create Initial Shared UI Shell

**Files:**
- Create: `packages/ui/src/app-shell.tsx`
- Create: `packages/ui/src/sidebar.tsx`
- Create: `packages/ui/src/topbar.tsx`
- Create: `packages/ui/src/section-header.tsx`
- Create: `packages/ui/src/status-badge.tsx`
- Modify: `packages/ui/src/index.ts`

**Step 1: Create minimal shell components**

Do not overdesign yet.

Need only:

- structure
- slots
- role-aware nav support

**Step 2: Export them**

Update `packages/ui/src/index.ts`.

**Step 3: Commit**

```bash
git add packages/ui
git commit -m "feat: add initial platform shell components"
```

---

## Task 11: Wire Basic Placeholder Pages to Shell

**Files:**
- Modify: `apps/web/app/admin/page.tsx`
- Modify: `apps/web/app/client/page.tsx`
- Modify: `apps/web/app/reseller/page.tsx`

**Step 1: Wrap workspace pages with shell**

Each page should:

- use a distinct context
- show heading
- identify its role

**Step 2: Verify routes render**

Run:

```bash
pnpm --filter web dev
```

Expected:

- `/client`
- `/reseller`
- `/admin`

all render with shell and basic context

**Step 3: Commit**

```bash
git add apps/web/app
git commit -m "feat: wire workspace placeholders into shared shell"
```

---

## Task 12: Verification Pass

**Files:**
- none

**Step 1: Run lint**

```bash
pnpm lint
```

Expected:

- no errors

**Step 2: Run build**

```bash
pnpm build
```

Expected:

- web app builds successfully

**Step 3: Run dev**

```bash
pnpm dev
```

Expected:

- landing loads
- auth placeholder loads
- client/reseller/admin placeholders load

**Step 4: Commit**

```bash
git add .
git commit -m "chore: complete phase 1 platform scaffolding baseline"
```

---

## Phase 1 Exit Criteria

Phase 1 is complete when:

- new repo exists
- monorepo works
- Next web app works
- shared packages exist
- route groups exist
- first contracts exist
- first mocks exist
- first repositories exist
- first shell exists
- all key root/workspace routes render
- lint/build pass

---

## Recommended Next Document

After completing this plan, create:

`J+SERVICES Phase 2 Public App and Auth Plan`

That plan should cover:

- landing page
- catalog
- product page
- pricing
- auth portal
- onboarding
- dynamic post-login routing
