# CLAUDE.md

## Project Overview

Let It Map — a location-sharing web app built with Next.js 16 (App Router).

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript 5
- **DB:** Drizzle ORM + Supabase PostgreSQL
- **Validation:** Zod (input schemas in `src/server/schema/`)
- **Auth:** NextAuth.js v5 (Google, GitHub OAuth)
- **Styling:** Tailwind CSS v4 (no config file — self-configuring)
- **Icons:** Lucide React

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npx drizzle-kit push` — Push schema changes to DB
- `npx drizzle-kit generate` — Generate migrations
- `npm run db:seed` — Load development data (idempotent; leaves non-seed rows alone)

## Project Structure

```
src/
├── app/              # Routing ONLY — a page maps a URL to one screen
│   ├── (app)/            # Full-screen shell + TabBar
│   ├── (content)/        # Header + Footer website chrome
│   └── api/
├── components/       # Shared UI components (layout/, ui/)
├── server/           # Backend — three tiers, one folder per domain
│   ├── api/              # Assembly + cross-cutting: app, middleware, onError
│   ├── db/               # Drizzle client + schema
│   ├── schema/           # Zod input schemas
│   ├── errors.ts         # Domain errors services throw
│   ├── transaction.ts    # DbClient + withTransaction (the unit of work)
│   └── [domain]/
│       ├── routes.ts     # Hono sub-app. The only framework-aware file here
│       ├── service.ts    # Business rules. No SQL
│       ├── repository.ts # SQL + row-to-domain mapping. No rules
│       └── types.ts      # Domain types
├── features/         # UI modules — screens, components, hooks
│   └── [feature]/
│       ├── index.ts      # Public surface. Everything else is internal
│       ├── screens/      # Whole screens. The ONLY place UI fetches data
│       ├── components/   # Presentational. Props only
│       └── hooks/
├── lib/              # Shared config (auth/)
└── types/            # Shared types
```

## Conventions

- **Language:** All code, UI strings, and comments must be in English.
- **Path alias:** Use `@/` for imports (maps to `src/`).
- **Server vs Client:** Components are Server Components by default. Add `"use client"` only when interactivity is needed.
- **File/folder placement:** Always follow `docs/folder-structure-spec.md` when creating files or directories.
- **Layer boundary:** `src/server/**` (except `actions.ts`) must not import `next/*`, `react`, `@/lib/auth`, or any UI. `src/app/**`, `src/features/**`, and `src/components/**` must not import `@/server/db` or `drizzle-orm`. ESLint-enforced — run `npm run lint` after touching either side.
- **Routing layer:** `app/**/page.tsx` forwards the page props to one screen and nothing else — no type declarations, no awaiting, no data fetching. A screen owns its own props type (`PostListScreenProps`) and awaits `params`/`searchParams` itself. Screens with no props are a one-line re-export: `export { ProfileScreen as default } from "@/features/profile"`.
- **Feature entry points:** every feature has an `index.ts` listing what the outside may use. Cross-feature imports go through `@/features/<name>`; inside a feature use relative paths. Deep imports from outside are an ESLint error.
- **Screens:** `features/{domain}/screens/` is the only place in the UI that fetches data or calls `notFound()`/`redirect()`. Components take data as props. ESLint-enforced.
- **One folder per domain:** a domain is an entity with its own table and its own rules (`post`, `location`). Everything about it — `routes.ts`, `service.ts`, `repository.ts`, `types.ts` — lives in that folder. `server/api/` holds only what belongs to no domain: the app assembly, middleware and error mapping.
- **Three tiers:** the adapter (`server/*/routes.ts` plus `server/api/`) does auth → validate → call one service → translate. `service.ts` holds business rules and owns the transaction boundary but writes no SQL. `repository.ts` writes SQL and maps rows to domain types, taking `DbClient` as its first argument. All boundaries are ESLint-enforced.
- **Writes go over HTTP:** a mutation is a Hono route in `server/<domain>/routes.ts`, called from the client through the typed `api` client in `lib/api/client.ts`. Server Actions are reserved for sign-in/out, which needs `redirect`, and live in `server/api/actions/`. This is what lets a mobile client reuse the same backend later.
- **Crossing domains:** a service may call another domain's **service**, never its repository. Inside a domain use relative imports (`./repository`); across domains use `@/server/<domain>/service`.
- **Reads vs writes:** a read returns `null` when something is absent; a write throws a domain error from `server/errors.ts`. Only the adapter turns those into HTTP status or UI state.
- **Reads stay in-process:** screens call `server/*/service.ts` directly — no HTTP hop, because the map and feed's first paint is the thing that matters most.
- **Form state:** a client form owns its own `isSubmitting`/`error` state and posts through `api`. `revalidatePath` is called inside the route; the client follows with `router.refresh()`.
- **Hono routes:** chain every method onto one expression (`new Hono().post(…).put(…)`). Separate statements still work at runtime but silently drop the route from `AppType`, so the client loses its types. Keep handlers inline — extracting one into a plain function breaks Hono's parameter inference; use `factory.createHandlers()` if you must.
- **Ownership:** a write repository merges the owner into the WHERE clause (`updateOwned`, `deleteOwned`) and returns `null` on no match; the service turns that into a `ForbiddenError`. Never read-then-write to check an owner.
- **Validation:** Every route validates with `zValidator` against a schema in `server/schema/`. The same schemas are importable from the client.
- **App shell:** `(app)` screens are full screen with a bottom `TabBar`; size them with `--app-height` (`100dvh` minus the tab bar), never `h-screen`/`vh`. `(content)` keeps the Header/Footer website chrome.
- **Styling:** Tailwind utility classes. Custom design tokens defined in `globals.css` (Burnt Sienna accent, Forest Teal secondary, warm stone palette).
- **DB schema:** Defined in `src/server/db/schema.ts`. UUIDs for primary keys, snake_case column names, cascade deletes on foreign keys.
- **Types:** Domain types in `server/*/types.ts` (returned by repositories), shared types in `types/common.ts`. UI-only types stay in the component file.
- **File naming:** PascalCase for components (`PostCard.tsx`), camelCase for utilities/actions (`queries.ts`, `actions.ts`).
