# AGENTS - fire-engine

## Rôle du projet

- Bibliothèque moteur réutilisable publiée sous `@david-urvoy/fire-engine`.
- Expose des APIs runtime navigateur et des outils de build/génération.

## Architecture

Deux catégories de code existent.

### Runtime

Emplacement principal: `src/`

Ce code est embarqué dans les applications clientes.

Contraintes:

- Compatible navigateur.
- Pas d'API Node.
- Indépendant des jeux consommant le moteur.

### Tooling

Emplacement principal: `tools/`

Ce code sert uniquement au build, au développement et à la génération.

Il peut utiliser:

- `node:fs`
- `node:path`
- APIs Bun

Il ne doit jamais être importé depuis le runtime.

## Exports publics

- Runtime: `@david-urvoy/fire-engine`
- Tooling: `@david-urvoy/fire-engine/tools`

Les exports publics doivent rester stables.

## Architecture interne

Domaines principaux:

- `3d`
- `ai`
- `animation`
- `audio`
- `camera`
- `controls`
- `game`
- `lib`
- `physics`
- `settings`
- `time`
- `ui`

## Patterns privilégiés

- Barrel exports (`index.ts`).
- `*.system.ts`: logique simulation/render.
- `*.manager.ts`: orchestration domaine.
- `*.store.ts`: état partagé.
- `*.context.tsx`: dépendances React runtime.
- Event bus typé.

## Bibliothèques

- React en peer dependency.
- Écosystème Three.js: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`.
- Valtio pour le state runtime.
- Dexie pour la persistance.

## Règles de conception

- Toute fonctionnalité réutilisable doit vivre dans fire-engine.
- Ne pas introduire de logique spécifique à starship.
- Préserver les frontières de domaines.
- Éviter les abstractions prématurées.

## TypeScript

- Strict mode activé.
- Éviter `any`.
- Éviter les casts inutiles.
- Préférer les generics, type guards et types explicites.

## Build et publication

- Le package est publié depuis `dist/`.
- Les consommateurs doivent utiliser `package.json#exports`.
- Ne pas dépendre des chemins source locaux.

Avant modification de:

- exports
- tsconfig
- structure de fichiers
- résolution modules

tester:

```bash
bun run compile
```

## Commandes

- Compilation: `bun run compile`
- Watch: `bun run watch`
- Dev: `bun run dev`

## Points non déterminés

- Stratégie officielle de tests automatisés: non déterminé.
