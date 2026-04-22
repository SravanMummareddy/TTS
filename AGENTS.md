# AGENTS.md — Personal OS

Universal entry point for all AI agents (Claude Code, OpenCode, ChatGPT/Codex).
**Read this file first before making any changes.**

---

## What this project is

Personal OS is a dark-themed personal dashboard built with Next.js App Router + TypeScript + Prisma.
It has 11 modules: Dashboard, Journal, Notes, Gallery, Fasting, Nutrition, Body, Tasks, Routines, Insights, Settings.

## Context loading order

1. This file (`AGENTS.md`)
2. [`docs/current-sprint.md`](docs/current-sprint.md) — what's being worked on right now
3. [`docs/links.md`](docs/links.md) — before touching any URL or API call
4. [`design/README.md`](design/README.md) — before touching any UI component

Only load additional files when they are directly relevant to the task.

---

## Rule 1 — URLs

- All URLs, API endpoints, and external service base URLs live exclusively in [`docs/links.md`](docs/links.md)
- In code: read them from `process.env` via `/lib/config.ts`
- In prompts/docs: write `[see docs/links.md → KEY_NAME]`
- Never hardcode a URL anywhere else

## Rule 2 — Design

- All mockups are in [`/design`](design/) — the HTML files are the visual source of truth
- Before implementing any screen, component, or layout change, open the corresponding mockup
- Match the mockup exactly; log any intentional deviations in [`docs/decisions.md`](docs/decisions.md)
- Design tokens (colours, radius, font) are defined in the mockup's CSS variables — mirror them in Tailwind config

## Rule 3 — Module boundaries

- Each of the 11 modules lives in `/modules/[name]/`
- Shared logic, types, and config go in `/lib/` — never duplicate across modules
- API routes call service functions; service functions call Prisma; no logic in route files

## Rule 4 — No duplication

- One place for each piece of data: URLs in `docs/links.md`, types in `/lib/types`, config in `/lib/config.ts`
- If you find yourself copy-pasting, stop and extract to shared location

## Rule 5 — Context hygiene

- Don't load the whole codebase — load only what the current task needs
- Don't re-summarise existing files — link to them
- Update [`docs/handoff.md`](docs/handoff.md) at the end of every session

---

## Module → file map

| Module | Route | Module path |
|---|---|---|
| Dashboard | `/` | `modules/dashboard/` |
| Journal | `/journal` | `modules/journal/` |
| Notes | `/notes` | `modules/notes/` |
| Gallery | `/gallery` | `modules/gallery/` |
| Fasting | `/fasting` | `modules/fasting/` |
| Nutrition | `/nutrition` | `modules/nutrition/` |
| Body | `/body` | `modules/body/` |
| Tasks | `/tasks` | `modules/tasks/` |
| Routines | `/routines` | `modules/routines/` |
| Insights | `/insights` | `modules/insights/` |
| Settings | `/settings` | `modules/settings/` |

## Skills

Reusable agent skills are in [`.agents/skills/`](.agents/skills/):

`planning` · `architecture` · `frontend` · `backend` · `db-prisma` · `security` · `review` · `refactor` · `testing` · `api-integration` · `design-implementation`
