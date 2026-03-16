# Deployment Runbook

Ce document decrit un deploiement prudent du projet pour qu'un agent ou un operateur puisse livrer sans improvisation.

## Cible actuelle

Le projet se deploie en deux surfaces:

- backend Express sur le port `3000` par defaut
- frontend Next.js sur le port `3001` par defaut

La base et les services externes attendus sont:

- Supabase
- Firebase
- FedaPay

## Prerequis

- acces au repository GitHub
- acces aux variables d'environnement de production
- projet Supabase cible disponible
- service account Firebase disponible si utilise
- secret webhook FedaPay configure

## Variables d'environnement minimales

Backend:

```env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://votre-domaine-web
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=...
FEDAPAY_WEBHOOK_SECRET=...
ADMIN_DASHBOARD_USERNAME=...
ADMIN_DASHBOARD_PASSWORD=...
GOOGLE_APPLICATION_CREDENTIALS=/chemin/vers/firebase-key.json
```

Web:

```env
NEXT_PUBLIC_API_BASE_URL=https://votre-api
```

## Build de reference

Depuis la racine:

```bash
npm install
npm --prefix apps/web install
npm test
npm run web:lint
npm run web:build
```

Ne pas deployer si une de ces commandes echoue.

## Ordre de deploiement recommande

1. verifier les variables d'environnement backend
2. deployer le backend
3. verifier `GET /health`
4. verifier les endpoints proteges sans session
5. deployer le frontend web
6. verifier les parcours de login web
7. surveiller logs et erreurs pendant les premieres minutes

## Demarrage backend

Commande standard:

```bash
npm start
```

Points d'attention:

- le backend echoue si `JWT_SECRET` est absent
- en production, les cookies de session utilisent `secure`
- les routes admin de dev ne doivent pas etre exposees sans controle d'acces reseau

## Demarrage web

Build:

```bash
npm run web:build
```

Start:

```bash
npm run web:start
```

Le frontend doit pointer vers l'API de production via `NEXT_PUBLIC_API_BASE_URL`.

## Verification post-deploiement

Checks backend:

- `GET /health` -> `200`
- `GET /admin/api/stats` sans session -> `401`
- `GET /api/v1/clients/dashboard` sans session -> `401`
- `GET /resellers/api/dashboard` sans session -> `401`

Checks web:

- page publique accessible
- login admin charge
- login client charge
- login reseller charge
- aucun appel web ne pointe encore vers `127.0.0.1`

Checks metier:

- les dashboards admin, client et reseller chargent avec une vraie session
- les webhooks FedaPay ont bien leur secret configure
- les lectures Supabase fonctionnent avec les cles attendues

## Rollback minimal

Si le deploiement casse:

1. revenir au commit precedent cote backend
2. remettre les variables d'environnement precedentes si elles ont change
3. redeployer le frontend sur la version precedente si le contrat API a bouge
4. reverifier `GET /health`
5. bloquer temporairement les nouvelles livraisons tant que la cause n'est pas comprise

Ne pas faire de rollback SQL destructif sans plan de migration explicite.

## Points de vigilance

- le schema SQL contient encore des noms historiques `manager_*`
- l'application expose des aliases de compatibilite; ne pas les retirer en meme temps que le deploiement sans verification
- `.env.example` ne doit contenir aucune URL ou secret de production
- tout nouveau deploiement doit repasser par `npm test`, `npm run web:lint`, `npm run web:build`
