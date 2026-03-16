# J+SERVICES Platform

Plateforme hybride Supabase/Firebase de `J+SERVICES` pour piloter plusieurs produits, licences SaaS, workspaces `admin`, `client`, `reseller` et futurs dashboards web/mobile. `TiketMomo` est l'un des premiers produits de l'ecosysteme.

## Vue produit

Les espaces canoniques sont maintenant:

- `admin`
- `client`
- `reseller`

Vérité produit:

- `client`: reçoit le stock depuis `Mikhmo AI`, suit licence, stock et distribution
- `reseller`: suit ventes, promo codes, commissions et retraits
- `admin`: supervision globale, comptes, licences, monitoring, audit

Les anciens noms restent encore acceptés pour compatibilité:

- `manager` -> `client`
- `partner` -> `reseller`

Référence de migration:

- [migration-canonical-roles.md](/home/juste-dev/Documents/TiketMomo/docs/migration-canonical-roles.md)

## Architecture

- `Supabase`: Postgres, RLS, Realtime, Storage, RPC, analytics
- `Firebase`: auth/push mobile quand nécessaire
- `Node/Express`: orchestration métier, webhooks, pages de paiement, admin control plane, jobs
- `Next.js`: nouvelle interface web dans [apps/web](/home/juste-dev/Documents/TiketMomo/apps/web)

## Lancement local

Prérequis:

- Node.js 18+
- instance Supabase locale ou cloud
- `.env` configuré

Installation:

```bash
npm install
```

Base de données:

- exécuter [supabase_master_schema.sql](/home/juste-dev/Documents/TiketMomo/database/supabase_master_schema.sql)

Variables minimales:

```env
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
JWT_SECRET=votre_secret_jwt
FEDAPAY_WEBHOOK_SECRET=votre_secret_webhook
GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json
```

Backend:

- `npm run dev`
- `npm start`

Frontend:

- `npm run web:dev`
- `npm run web:build`
- `npm run web:lint`

URLs locales:

- backend: `http://127.0.0.1:3000`
- frontend: `http://127.0.0.1:3001`

## Tests

- backend: `npm test`
- frontend lint: `npm run web:lint`
- frontend build: `npm run web:build`

## Docs de reprise

Pour qu'un autre agent ou un autre developpeur puisse reprendre et deployer sans contexte oral:

- handoff: [agent-handoff.md](/home/juste-dev/Documents/TiketMomo/docs/agent-handoff.md)
- deploiement: [deployment-runbook.md](/home/juste-dev/Documents/TiketMomo/docs/deployment-runbook.md)
- migration roles: [migration-canonical-roles.md](/home/juste-dev/Documents/TiketMomo/docs/migration-canonical-roles.md)

## Parcours web utiles

- `http://127.0.0.1:3001/auth/admin`
- `http://127.0.0.1:3001/auth/client`
- `http://127.0.0.1:3001/auth/reseller`

Admin local:

- `http://127.0.0.1:3000/admin/dev-login`

## Notes de migration

La migration applicative vers `client / reseller` est avancée:

- routes canoniques en place
- sessions `client_session` supportées
- aliases legacy conservés
- backend et frontend réalignés sur le vocabulaire produit

Le stockage SQL garde encore plusieurs noms historiques `manager_*`.
Cela est volontaire tant qu’aucune migration de schéma dédiée n’est planifiée.
