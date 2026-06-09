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

## Routes surfaced from the home page

- `/policies-governance` — AI Policies & Governance
- `/project-catalogue` — AI Project Catalogue
- `/academy` — AI Academy

## Analytics

The app includes a self-contained, dependency-free user analytics layer
([`src/lib/analytics.ts`](src/lib/analytics.ts)). Events are buffered in
`localStorage` (capped at 500) and never leave the browser — there is no
third-party library and no network call.

### What is tracked automatically

- **Page views** — on every route change (via `usePageTracking`)
- **Clicks** — on any element carrying a `data-analytics` attribute
- **User identity** — tied to the Okta user on login, cleared on logout
- **Sessions** — start/end and duration (30-minute inactivity timeout)

### Track a custom event

```ts
import { trackEvent } from "@/lib/analytics";

trackEvent("agent_created", { template: "claims" });
```

### Track a click with no code

Tag the element. Any `data-analytics-*` attributes are captured as event props:

```tsx
<Button data-analytics="cta_create_agent" data-analytics-source="dashboard">
  Create Agent
</Button>
```

### Inspect from the browser console

```js
window.__analytics.summary();    // counts by type + top pages + session duration
window.__analytics.getEvents();  // full event buffer
window.__analytics.clear();      // wipe stored events
```

> Data lives only in the user's browser. To aggregate it centrally later, add a
> `navigator.sendBeacon` flush inside `pushEvent` in
> [`src/lib/analytics.ts`](src/lib/analytics.ts).
