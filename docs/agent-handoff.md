# Agent Handoff

Ce document permet a un autre agent ou a un nouveau contributeur de reprendre le projet sans dependre du contexte oral de la session precedente.

## Etat global

Le projet est une plateforme hybride:

- backend `Node.js / Express`
- base `Supabase`
- couche mobile et push `Firebase`
- frontend web `Next.js` dans [apps/web](/home/juste-dev/Documents/TiketMomo/apps/web)

Les roles canoniques a utiliser dans le code applicatif sont:

- `admin`
- `client`
- `reseller`

Les noms legacy restent encore toleres uniquement pour compatibilite:

- `manager` -> `client`
- `partner` -> `reseller`

Reference produit et migration:

- [migration-canonical-roles.md](/home/juste-dev/Documents/TiketMomo/docs/migration-canonical-roles.md)
- [2026-03-15-role-product-matrix.md](/home/juste-dev/Documents/TiketMomo/docs/plans/2026-03-15-role-product-matrix.md)
- [2026-03-15-rbac-matrix.md](/home/juste-dev/Documents/TiketMomo/docs/plans/2026-03-15-rbac-matrix.md)

## Reperes techniques

Points d'entree:

- backend: [src/server.js](/home/juste-dev/Documents/TiketMomo/src/server.js)
- web: [apps/web/app/page.tsx](/home/juste-dev/Documents/TiketMomo/apps/web/app/page.tsx)

Zones importantes:

- identite et auth: [src/modules/identity-access](/home/juste-dev/Documents/TiketMomo/src/modules/identity-access)
- espace client: [src/controllers/clientController.js](/home/juste-dev/Documents/TiketMomo/src/controllers/clientController.js)
- espace reseller: [src/controllers/resellerController.js](/home/juste-dev/Documents/TiketMomo/src/controllers/resellerController.js)
- admin control plane: [src/modules/admin-control-plane](/home/juste-dev/Documents/TiketMomo/src/modules/admin-control-plane)
- marketing reseller: [src/modules/partner-marketing](/home/juste-dev/Documents/TiketMomo/src/modules/partner-marketing)
- paiements et webhooks: [src/modules/payment-billing](/home/juste-dev/Documents/TiketMomo/src/modules/payment-billing)
- licences SaaS: [src/modules/license-saas](/home/juste-dev/Documents/TiketMomo/src/modules/license-saas)

## Regles de reprise

- dans les nouvelles couches, preferer `client` et `reseller`
- ne pas renommer brutalement les colonnes SQL legacy sans migration dediee
- garder des aliases applicatifs si une ancienne route ou un ancien cookie est encore consomme
- verifier les routes protegees avec une reponse `401` sans session
- avant de declarer le travail termine, lancer les checks backend et web

## Variables d'environnement critiques

Backend:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `FEDAPAY_WEBHOOK_SECRET`
- `ADMIN_DASHBOARD_USERNAME`
- `ADMIN_DASHBOARD_PASSWORD` ou `ADMIN_DASHBOARD_TOKEN`
- `ALLOWED_ORIGINS`
- `PORT`
- `NODE_ENV`

Web:

- `NEXT_PUBLIC_API_BASE_URL`

Mobile et services annexes:

- `GOOGLE_APPLICATION_CREDENTIALS`
- `ADMIN_SUPABASE_UID`

## Commandes de reprise

Installation:

```bash
npm install
npm --prefix apps/web install
```

Verification rapide:

```bash
npm test
npm run web:lint
npm run web:build
```

Demarrage local:

```bash
npm start
npm run web:start
```

## Checks minimum avant livraison

- `GET /health` doit repondre `200`
- `GET /admin/api/stats` doit repondre `401` sans session
- `GET /api/v1/clients/dashboard` doit repondre `401` sans session
- `GET /resellers/api/dashboard` doit repondre `401` sans session

## Dette restante la plus probable

- migration SQL explicite de certains noms `manager_*`
- durcissement du deploiement web et backend
- suppression progressive des aliases legacy quand plus rien ne les consomme
- couverture de tests sur les flux critiques admin, paiement et webhooks
