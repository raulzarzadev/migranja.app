# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ranchito is a farm/ranch management system focused on sheep (ovine) tracking — breeding, births, weaning, sales, and inventory. Built as an offline-first PWA with real-time sync.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint (next lint)
pnpm type-check   # TypeScript check + lint
pnpm vitest       # Vitest watch mode
pnpm test         # Jest watch mode
pnpm test:ci      # Jest CI mode
pnpm coverage     # Vitest coverage
```

## Environment Variables

Required in `.env`:
- `NEXT_PUBLIC_ENV` — dev/test/production
- `NEXT_PUBLIC_FIREBASE_CONFIG` — Firebase config as JSON string (use `JSON.stringify()`)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_OPENWEATHER_API_KEY`

For Vitest, prefix with `VITE_`: `VITE_NEXT_PUBLIC_FIREBASE_CONFIG`, `VITE_ENV=test`

## Architecture

**Stack:** Next.js 13 + TypeScript + Firebase (Firestore) + Redux Toolkit + MUI + Tailwind/DaisyUI

### Path Aliases
- `@firebase/*` → `firebase/*`
- `@comps/*` → `components/*`

### Data Flow
```
Firebase Firestore (real-time listeners via onSnapshot)
    → Custom hooks (useAuth, useFarmState)
    → Redux store (via dispatch)
    → Components (via useSelector)
```

All data uses real-time Firestore listeners, not one-time fetches. Offline persistence is enabled via IndexedDB.

### Key Layers

**`firebase/`** — Data access layer. `FirebaseCRUD` is the generic base class providing CRUD + file upload + real-time listeners. Domain services extend it:
- `firebase/Farm/main.ts` — Farm CRUD, team/invitations
- `firebase/Animal/main.ts` — Animal CRUD, gender-specific queries, batch upload
- `firebase/Events/main.ts` — Event CRUD (breeding, birth, weaning, sale, dropout)
- `firebase/Users/main.ts` — Google OAuth, user profiles

**`store/slices/`** — Redux slices:
- `authSlice` — User auth state
- `farmSlice` — Current farm, animals array, events, user farms

**`components/hooks/`** — Custom hooks for state (`useAuth`, `useFarmState`, `useCurrentFarm`, `useFarmAnimals`), domain logic (`useWeaning`, `useCreateBirth`, `useBreedingDates`), and UI (`useModal`, `useFilterByField`).

**`components/HOCs/withAuth`** — Auth HOC that wraps protected pages.

**`components/forms/`** — Form components using React Hook Form + Yup validation.

**`types/base/`** — Core TypeScript models: `AnimalType`, `FarmType`, `FarmEvent`, `SheepType`, etc. Event type constants in `types/base/LABELS_TYPES/`.

**`pages/`** — Next.js routing. Dynamic routes: `[farmId]/` for farm views, `[farmId]/animals/[id]` for animal detail.

### Code Style
- Prettier: single quotes, no semicolons, no trailing commas, 80 char width
- ESLint: next/core-web-vitals
- TypeScript strict mode enabled
