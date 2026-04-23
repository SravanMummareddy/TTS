# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here

1. Read [`AGENTS.md`](../AGENTS.md) — authoritative rules for all agents
2. Read [`docs/current-sprint.md`](../docs/current-sprint.md)
3. Read [`docs/links.md`](../docs/links.md) if touching URLs or API calls
4. Open the relevant file in [`design/`](../design/) if touching UI

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint
npm run test         # run all Vitest tests
npx vitest run tests/journal/service.test.ts   # run a single test file
npx prisma migrate dev --name <name>           # create + apply a migration
npx prisma studio                              # visual DB browser
```

## Architecture

**Modular monolith.** 11 modules, each self-contained under `/modules/[name]/`. No module imports from another module. Shared code lives in `/lib/`.

### Request flow

```
app/(app)/[module]/page.tsx   (thin — just renders module page component)
  → modules/[name]/components/[Name].tsx   (client component, all UI state)
  → fetch → app/api/[module]/route.ts      (parse + validate only)
              → modules/[name]/service.ts  (business logic)
                → lib/prisma.ts            (Prisma singleton)
```

### Module anatomy

Every module follows the same shape:

```
modules/[name]/
  components/[Name].tsx   — 'use client', all interactivity
  service.ts              — async functions, Prisma queries only
  types.ts                — module-local TypeScript types
  data.ts                 — seed / mock data (present when DB not yet wired)
```

Modules without a DB yet use `data.ts` + local React state (see Tasks module). Modules with a DB have `service.ts` + API routes (see Journal module).

### API route conventions

- Routes only parse/validate input, then delegate to `service.ts`
- Return `Response.json(...)` — no `NextResponse`
- Validation returns a plain string error message, not an object

### Prisma

- One schema at `prisma/schema.prisma`, one migration history
- No cross-module foreign keys in v1
- Prisma client singleton in `lib/prisma.ts` — import `{ prisma }` from there
- `DATABASE_URL` in `.env` — see `docs/links.md` for the actual value

### Design system

All tokens are CSS variables set in `app/globals.css`. Tailwind config aliases them (e.g. `bg-surface`, `text-t2`). Accent color (`--purple` / `--purple-d` / `--purple-g`) is runtime-switched via AppShell — always use the variable, never hardcode a hex.

Key variables: `--bg`, `--surface`, `--surface2`, `--surface3`, `--border`, `--border2`, `--t1`, `--t2`, `--t3`, `--r` (border-radius large), `--rs` (border-radius small), `--font`.

Components use inline `style={{}}` props rather than Tailwind class strings — match whatever pattern the file already uses.

### AppShell

`components/AppShell.tsx` is a client component that owns accent color state and injects CSS variables onto `document.documentElement`. It wraps all authenticated routes via `app/(app)/layout.tsx`.

### Auth

Single-user, no auth system in v1. `app/login/page.tsx` exists as a stub.

## Skills

[`.agents/skills/`](../.agents/skills/) — load the relevant skill before starting: `frontend`, `backend`, `db-prisma`, `design-implementation`, `testing`, etc.

## Claude-specific notes

- Prefer editing existing files over creating new ones
- No comments explaining what code does — only for non-obvious WHY
- No error handling for things that can't happen
- When implementing UI, open the mockup first; don't guess layout or spacing
- Keep responses concise — no trailing summaries
