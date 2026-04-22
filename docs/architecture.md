# Architecture

## Pattern

Modular monolith. Each of the 11 modules is self-contained under `/modules/[name]/`. Shared code lives in `/lib/`. No module imports from another module.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL via Prisma |
| Styling | Tailwind CSS |
| Media | Cloudinary |
| Font | Plus Jakarta Sans |

## Folder conventions

```
/app/                          Next.js routes (thin — delegate to modules)
  (app)/                       Authenticated layout group
    layout.tsx                 AppShell: sidebar + header
    page.tsx                   → modules/dashboard
    [module]/page.tsx          → modules/[module]

/modules/[name]/
  page.tsx                     Page component (server component)
  components/                  UI components for this module only
  service.ts                   Business logic — called by API routes
  types.ts                     Module-specific types

/lib/
  config.ts                    Reads process.env — single place for env access
  prisma.ts                    Prisma client singleton
  types/                       Shared types used across modules

/components/                   Shared UI components (used by 2+ modules)
/prisma/schema.prisma          Single source of truth for data models
/tests/                        Mirrors source structure
```

## Data layer

- One Prisma schema, one migration history
- Each module has its own model(s) — no cross-module FK joins in v1
- No raw SQL — Prisma only
- `DATABASE_URL` set in `.env` [see docs/links.md]

## API conventions

- Routes live at `app/api/[module]/route.ts`
- Routes only parse/validate input and call `modules/[name]/service.ts`
- No business logic in route files
- All external URLs imported from `/lib/config.ts`

## Design tokens

Sourced from mockup CSS variables in `design/`. Mirror in `tailwind.config.ts`:

| Token | Value |
|---|---|
| `--bg` | `#0c0c16` |
| `--surface` | `#12121f` |
| `--surface2` | `#181828` |
| `--surface3` | `#1e1e30` |
| `--border` | `rgba(255,255,255,0.07)` |
| `--t1` | `#f0f0fa` |
| `--t2` | `#9090b0` |
| `--t3` | `#5c5c7a` |
| Accent (default) | `#22c55e` (green) — configurable |
| Border radius | `14px` (large), `10px` (small) |
| Font | Plus Jakarta Sans |

## Auth

Single-user in v1. No auth system required. If deployed publicly, protect behind basic auth or VPN.

## Decisions

See [docs/decisions.md](decisions.md) for ADRs.
