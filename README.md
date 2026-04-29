# CO/ACTION AI Hub

Internal portal for governing, cataloguing, and learning about AI projects across the organization.

## Getting started

Requires Node 18+ (or Bun) and npm.

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:8080.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives)
- React Router
- TanStack Query
- Supabase (auth, Postgres, edge functions)

## Routes surfaced from the home page

- `/policies-governance` — AI Policies & Governance
- `/project-catalogue` — AI Project Catalogue
- `/academy` — AI Academy
