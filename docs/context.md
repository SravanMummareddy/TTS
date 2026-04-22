# AI Context Rules

How agents should load and use context in this project. These rules prevent context rot and token waste.

---

## Load order

Start every session with exactly these files, in order:

1. `AGENTS.md` — rules and module map
2. `docs/current-sprint.md` — what's active
3. Then only load files relevant to the specific task

Do not read the entire codebase upfront.

## Before touching a URL or API call

Read `docs/links.md` first. Add the URL there before using it anywhere else.

## Before touching any UI

Open the relevant HTML file in `/design/`. The mockup is the spec — do not guess at colours, spacing, or layout.

## Before touching the database

Read `prisma/schema.prisma`. All model changes go through a Prisma migration.

## Anti-patterns to avoid

| Pattern | Why it causes rot |
|---|---|
| Copy-pasting a URL into a component | Creates hidden duplicates — breaks when the URL changes |
| Summarising a file that already exists | Doubles the information, then they diverge |
| Adding inline TODOs | They never get done; use `docs/current-sprint.md` instead |
| Writing logic in API route files | Breaks the service layer boundary; untestable |
| Cross-module imports | Violates modular monolith; creates coupling |

## Shared data locations

| Data type | Where it lives |
|---|---|
| URLs / endpoints | `docs/links.md` → `.env` → `lib/config.ts` |
| Shared TypeScript types | `lib/types/` |
| Prisma models | `prisma/schema.prisma` |
| Design tokens | `design/` mockup CSS vars → `tailwind.config.ts` |
| Module-specific types | `modules/[name]/types.ts` |

## End-of-session checklist

- Update `docs/current-sprint.md` (move done items, add blockers)
- Update `docs/handoff.md` with state and next steps
- Ensure any new URLs are in `docs/links.md`
