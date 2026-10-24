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
├── server/           # Domain layer — all business logic & DB access
│   ├── db/               # Drizzle client + schema
│   ├── schema/           # Zod input schemas
│   └── [domain]/
│       ├── queries.ts    # Reads (framework-independent)
│       ├── mutations.ts  # Writes (framework-independent)
│       ├── actions.ts    # "use server" adapter (the only Next-aware file)
│       └── types.ts      # Domain types
├── features/         # UI modules — screens, components, hooks
│   └── [feature]/
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
- **Routing layer:** `app/**/page.tsx` may only export `metadata`/`viewport`, await `params`/`searchParams`, and render one screen. No JSX beyond that, no data fetching. Keep it under 15 lines.
- **Screens:** `features/{domain}/screens/` is the only place in the UI that fetches data or calls `notFound()`/`redirect()`. Components take data as props. ESLint-enforced.
- **Data fetching:** Server queries (`server/*/queries.ts`) are plain async functions (no `"use server"`) called directly from Server Components.
- **Mutations:** Domain logic goes in `server/*/mutations.ts`; the `"use server"` adapter in `server/*/actions.ts` handles auth, Zod parsing, and `revalidatePath`/`redirect`, and is called from Client Components. Suffix actions with `Action` (`createPostAction`).
- **Validation:** Parse all external input with a Zod schema from `server/schema/` at the adapter boundary. Never cast `FormData` values with `as string`.
- **Form state:** Use React 19 `useActionState` hook to connect forms to Server Actions — provides `[state, formAction, isPending]`.
- **App shell:** `(app)` screens are full screen with a bottom `TabBar`; size them with `--app-height` (`100dvh` minus the tab bar), never `h-screen`/`vh`. `(content)` keeps the Header/Footer website chrome.
- **Styling:** Tailwind utility classes. Custom design tokens defined in `globals.css` (Burnt Sienna accent, Forest Teal secondary, warm stone palette).
- **DB schema:** Defined in `src/server/db/schema.ts`. UUIDs for primary keys, snake_case column names, cascade deletes on foreign keys.
- **Types:** Domain types in `server/*/types.ts`, shared types in `types/common.ts`. UI-only types stay in the component file.
- **File naming:** PascalCase for components (`PostCard.tsx`), camelCase for utilities/actions (`queries.ts`, `actions.ts`).
